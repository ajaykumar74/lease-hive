import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { DataType, IStateData, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { PortalUserService } from './portalUser.service';
import { IPortalUser } from './portalUser';
import { PageEvent } from '@/shared/IBase';
import { SettingsService } from '../settings/settings.service';
import { AppConstants } from '@/shared/constants/AppConstants'

@Component({
  selector: 'app-portalUser-list',
  standalone: false,
  templateUrl: './portalUser-list.component.html'
})
export class PortalUserListComponent implements OnInit {

  constructor(
    private portalUserService: PortalUserService,
    private settingsService: SettingsService,
    private router: Router,
    private loggedInUserService: LoggedInUserService,
    private readonly appConstants: AppConstants,
  ) { }
  pgEvent: PageEvent = { page: 0, first: 0, rows: 10 } as PageEvent;
  lstMain: IPortalUser[];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0;
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { Name: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;
  gridSize: any = 'small';
  ngOnInit(): void {
    this.gridSize = this.settingsService.Settings.GridSize;
    if (this.portalUserService.CacheData.IsLoaded) {
      this.pgEvent = this.portalUserService.CacheData.pgEvent;
      this.objSearch = this.portalUserService.CacheData.objSearch;
      this.permission = this.portalUserService.CacheData.permission;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.portalUserService.CacheData.IsLoaded);
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
    this.objSearch = { Name: '', Code: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.searchData(this.pgEvent, true);
  }
  onPageChange(arg): void {
    this.pgEvent.page = arg.page;
    this.pgEvent.rows = arg.rows;
    this.pgEvent.first = arg.first;
    this.searchData(this.pgEvent, true);
  }
  rowStyle(obj: IPortalUser) {
    if (obj.IsDeleted === true) {
      return { backgroundColor: '#fddcd6' };
    }
    else {
      return { backgroundColor: 'normal' };
    }
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
      this.portalUserService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.portalUserService.setCache(res.data, this.permission, this.objSearch, pgEvent);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.portalUserService.CacheData.Data, this.portalUserService.CacheData.TotalRecords);
    }
  }

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords;
  }

  getSearchParams() {
    var Items = [];
    Items = [
      //  { DBName: 'OperatorId', Value: '', DataType: DataType.Int, Operator: Operator.EqualTo },
      { DBName: 'FirstName', Value: this.objSearch.FirstName, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'RecordById', Value: this.loggedInUserService.getRecordId.toString(), DataType: DataType.Int, Operator: Operator.EqualTo },
      { DBName: 'RecordByType', Value: this.loggedInUserService.getRecordType, DataType: DataType.TextExact, Operator: Operator.EqualTo },
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
      this.router.navigate(['dashboard/portalUsers/edit/' + obj.Id]);
    }
    else {
      this.router.navigate(['dashboard/portalUsers/view/' + obj.Id]);
    }

  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {

      if (this.loggedInUserService.loggedInUser.AccountType == this.appConstants.RecordType.Customer && this.lstMain?.length > 3) {
        this.messageService.showError('Only max 3 users allowed.');
      } else {
        this.router.navigate(['dashboard/portalUsers/create']);
      }
    }
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }

  }
}




