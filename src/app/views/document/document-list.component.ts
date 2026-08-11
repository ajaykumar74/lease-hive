import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator, IStateData, CombineCriteriaType } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { DocumentService } from './document.service';
import { IDocument } from './document';
import { PageEvent } from '@/shared/IBase';
import { IBrandPartner } from '../brandPartner/brandPartner';
import { SettingsService } from '../settings/settings.service';
import { AppConstants } from '@/shared/constants/AppConstants';
import { loggedInUser } from '@/shared/IloggedInUser';

@Component({
  selector: 'app-document-list',
  standalone: false,
  templateUrl: './document-list.component.html'
})
export class DocumentListComponent implements OnInit {

  constructor(
    private documentService: DocumentService,
    private settingsService: SettingsService,
    private router: Router,
    private loggedInUserService: LoggedInUserService,
    private readonly appConst: AppConstants,
  ) { }
  pgEvent: PageEvent = { page: 0, first: 0, rows: 10 } as PageEvent;
  lstMain: IDocument[];
  sortBy: string = 'Id';
  IsDescending: boolean = true;
  totalNoOfRecords = 0;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = { CanCreate: true } as IPermission;
  objSearch: any = { Name: '', IncludeDeleted: false, CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
  stateData: IStateData;
  Caption: string = '';
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;
  brandPartner: IBrandPartner;
  gridSize: any = 'small';
  ngOnInit(): void {
    var nState = this.router.lastSuccessfulNavigation?.extras.state;
    this.stateData = nState['stateData'] as IStateData;
    if (this.stateData.RecordType == this.appConst.RecordType.Vehicle) {
      this.Caption = 'Vehicle Documents #' + this.stateData.Data.Vrm;
    }
    else if (this.stateData.RecordType == this.appConst.RecordType.Customer) {
      this.Caption = 'My Documents'
    }
    else {
      this.Caption = 'My Documents'
    }


    this.brandPartner = this.loggedInUserService.loggedInUser.BrandPartner;
    this.pgEvent.rows = this.settingsService.Settings.RecordsPerPage;
    this.gridSize = this.settingsService.Settings.GridSize;
    if (this.documentService.CacheData.IsLoaded) {
      this.pgEvent = this.documentService.CacheData.pgEvent;
      this.objSearch = this.documentService.CacheData.objSearch;
      this.permission = this.documentService.CacheData.permission;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, true);
    }, 500);
  }

  onAdvSearchClicked(obj: any): void {
    this.objSearch = obj;
    this.search();
  }

  onHideAdvSearch(): void {
    this.isAdvanceView = !this.isAdvanceView;
  }


  search(): void {
    this.searchData(this.pgEvent, true);
  }

  clearSearch(): void {
    this.objSearch = { Name: '', Code: '', IncludeDeleted: false, CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.searchData(this.pgEvent, true);
  }

  rowStyle(obj: IDocument) {
    // if (obj.IsDeleted === true) {
    //   return { backgroundColor: '#fddcd6' };
    // }
    // else {
    return { backgroundColor: 'normal' };
    // }
  }

  onPageChanged(arg): void {
    this.pgEvent.page = arg.page;
    this.pgEvent.rows = arg.rows;
    this.pgEvent.first = arg.first;
    this.searchData(this.pgEvent, true);
  }

  searchData(pgEvent: PageEvent, isReload: boolean): void {

    if (isReload || this.documentService.CacheData.pgEvent.page != pgEvent.page) {

      var searchParam = {
        Skip: (pgEvent.page * pgEvent.rows),
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Criteria: this.getSearchCriteria()
      }
      this.isLoading = true;
      this.documentService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.documentService.setCache(res.data, this.permission, this.objSearch, pgEvent);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.documentService.CacheData.Data, this.documentService.CacheData.TotalRecords);
    }
  }



  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords;
  }

  getSearchParams() {
    if (this.stateData != null) {
      Items = [
        { DBName: 'RecordByType', Value: this.stateData.RecordType, DataType: DataType.Text, Operator: Operator.EqualTo, },
        { DBName: 'RecordById', Value: this.stateData.Id.toString(), DataType: DataType.Text, Operator: Operator.EqualTo },
      ];
    } 
    //( RecordByType = 'Customer' AND RecordById = '1011' OR ( CreatedById = 47))  AND ( DisplayName like '%12%' ) 
    var Items = [];
    if (this.stateData != null) {
      Items = [
        { DBName: 'RecordByType', Value: this.stateData.RecordType, DataType: DataType.Text, Operator: Operator.EqualTo, },
        { DBName: 'RecordById', Value: this.stateData.Id.toString(), DataType: DataType.Text, Operator: Operator.EqualTo },
      ];
    } 
    if (this.objSearch.Name) {
      Items.push({ DBName: 'DisplayName', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR });
      // Items.push({ DBName: 'DocumentNumber', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineORExact });
    }
    Items.push({ DBName: 'CreatedById', Value: this.loggedInUserService.loggedInUser.RecordId.toString(), DataType: DataType.Text, Operator: Operator.EqualTo, CombineCriteria: CombineCriteriaType.CombineOR, GroupName:'OR' });

    var auditCriteria = null;
    if (this.objSearch.IncludeDeleted == false) {
    }

    if (this.objSearch.AuditType == 'Created') {
      auditCriteria = 'CreatedDateTime;' + this.objSearch.Days + ';' + this.loggedInUserService.formatDate(this.objSearch.RecordsFromDate);
    }
    else if (this.objSearch.AuditType == 'Modified') {
      auditCriteria = 'ModifiedDateTime;' + this.objSearch.Days + ';' + this.loggedInUserService.formatDate(this.objSearch.RecordsFromDate);
    }
    if (auditCriteria != null) {
      Items.push({ DBName: 'Records', Value: auditCriteria, DataType: DataType.Text, Operator: Operator.EqualTo })
    }

    return Items;

  }

  getSearchCriteria() {
    var strCriteria = '';
    //((RecordByType = 'Customer' And RecordById = 1011)  OR ( CreatedById = 47)) And DisplayName like '%12%'
    if (this.stateData != null) {
      strCriteria = `RecordByType = '${this.stateData.RecordType}' And RecordById = ${this.stateData.Id}`; 
     strCriteria = `(${strCriteria}) OR (CreatedById = ${this.loggedInUserService.loggedInUser.RecordId}) `;
    } 

    if (this.objSearch.Name != null && this.objSearch.Name != '') {
      strCriteria  = `(${strCriteria}) And (DisplayName like '%${this.objSearch.Name}%')`;
    }
     
    return strCriteria;

  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/document/create'], {
        state: { stateData: this.stateData }
      });
    }
    else if (key == "Refresh") {
      this.search();
    }
  }

  onDetailsClick(obj: any): void {
    if (this.permission.CanCreate || this.permission.CanUpdate) {
      this.router.navigate(['dashboard/document/edit/' + obj.Id], {
        state: { stateData: this.stateData }
      });
    }
    else {
      this.router.navigate(['dashboard/document/view/' + obj.Id], {
        state: { stateData: this.stateData }
      });
    }

  };


}




