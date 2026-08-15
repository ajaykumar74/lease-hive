import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { ProspectService } from './prospect.service';
import { IProspect } from './prospect';
import { PageEvent } from '@/shared/IBase';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-prospect-list',
  standalone: false,
  templateUrl: './prospect-list.component.html'
})
export class ProspectListComponent implements OnInit {

  constructor(
    private prospectService: ProspectService,
    private settingsService: SettingsService,
    private router: Router,
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { page: 0, first: 0, rows: 10 } as PageEvent;
  lstMain: IProspect[];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = { CanCreate: true } as IPermission;
  objSearch: any = { Name: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;
  gridSize: any = 'small';
  ngOnInit(): void {
    this.gridSize = this.settingsService.Settings.GridSize;
    if (this.prospectService.CacheData.IsLoaded) {
      this.pgEvent = this.prospectService.CacheData.pgEvent;
      this.objSearch = this.prospectService.CacheData.objSearch;
      this.permission = this.prospectService.CacheData.permission;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.prospectService.CacheData.IsLoaded);
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

  rowStyle(obj: IProspect) {
    // if (obj.IsDeleted === true) {
    //   return { backgroundColor: '#fddcd6' };
    // }
    // else {
      return { backgroundColor: 'normal' };
    // }
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

    if (isReload) {

      var searchParam = {
        Skip: (pgEvent.page * pgEvent.rows),
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Conditions: this.getSearchParams()
      }
      this.isLoading = true;
      this.prospectService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.prospectService.setCache(res.data, this.permission, this.objSearch, pgEvent);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.prospectService.CacheData.Data, this.prospectService.CacheData.TotalRecords);
    }
  }



  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords;
  }

  getSearchParams() {
    var Items = [];
    Items = [
      { DBName: 'Name', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'BrandPartnerId', Value: this.loggedInUserService.loggedInUser.BrandPartner.Id.toString(), DataType: DataType.Int, Operator: Operator.EqualTo },
    ];


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
      this.router.navigate(['dashboard/prospects/edit/' + obj.Id]);
    }
    else {
      this.router.navigate(['dashboard/prospects/view/' + obj.Id]);
    }

  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/prospects/create']);
    }
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }

  }
}




