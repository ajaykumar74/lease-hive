import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { DataType, IStateData, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { ContactService } from './contact.service';
import { IContact } from './contact';
import { PageEvent } from '@/shared/IBase';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html'
})
export class ContactListComponent implements OnInit {

  constructor(
    private contactService: ContactService,
    private router: Router,
    private settingsService: SettingsService,
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { page: 0, first: 0, rows: 10 } as PageEvent;
  lstMain: IContact[];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  Caption: string = '';
  permission = { CanCreate: true } as IPermission;
  objSearch: any = { Name: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
  stateData: IStateData;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;
  gridSize: any = 'small';
  ngOnInit(): void {
    this.pgEvent.rows = this.settingsService.Settings.RecordsPerPage;
    this.gridSize = this.settingsService.Settings.GridSize;
    var nState = this.router.lastSuccessfulNavigation?.extras.state;
    this.stateData = nState['stateData'] as IStateData;
    this.Caption = this.stateData.Name + ' Contacts'

    if (this.contactService.CacheData.IsLoaded) {
      this.pgEvent = this.contactService.CacheData.pgEvent;
      this.objSearch = this.contactService.CacheData.objSearch;
      this.permission = this.contactService.CacheData.permission;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.contactService.CacheData.IsLoaded);
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
  rowStyle(obj: IContact) {
    if (obj.IsDeleted === true) {
      return { backgroundColor: '#fddcd6' };
    }
    else {
      return { backgroundColor: 'normal' };
    }
  }

  clearSearch(): void {
    this.objSearch = { Name: '', Code: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.searchData(this.pgEvent, true);
  }

  onPageChanged(arg): void {
    this.pgEvent.page = arg.page;
    this.pgEvent.rows = arg.rows; 
    this.pgEvent.first = arg.first; 
    this.searchData(this.pgEvent, true);
  }

  searchData(pgEvent: PageEvent, isReload: boolean): void {

    if (isReload || this.contactService.CacheData.pgEvent.page != pgEvent.page) {

      var searchParam = {
        Skip: (pgEvent.page * pgEvent.rows),
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Conditions: this.getSearchParams()
      }
      this.isLoading = true;
      this.contactService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.contactService.setCache(res.data, this.permission, this.objSearch, pgEvent);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.contactService.CacheData.Data, this.contactService.CacheData.TotalRecords);
    }
  }



  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords;
  }

  getSearchParams() {
    var Items = [];
    Items = [
      { DBName: 'FirstName', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
    ];


this.loggedInUserService.loggedInUser.Role


    
    if (this.stateData != null) {
      Items.push({ DBName: 'RecordById', Value: this.stateData.Id.toString(), DataType: DataType.Int, Operator: Operator.EqualTo });
      Items.push({ DBName: 'RecordByType', Value: this.stateData.RecordType.toString(), DataType: DataType.TextExact, Operator: Operator.EqualTo });
    }


    var auditCriteria = null;

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

  onDetailsClick(obj: any): void {
    if (this.permission.CanCreate || this.permission.CanUpdate) {
      this.router.navigate(['dashboard/contacts/edit/' + obj.Id]);
    }
    else {
      this.router.navigate(['dashboard/contacts/view/' + obj.Id]);
    }

  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/contacts/create'], {
        state: { stateData: this.stateData }
      });

    }
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }

  }
}




