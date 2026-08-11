import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';

import { NotificationService } from './notification.service';
import { INotification } from './notification';

import { PageEvent } from '@/shared/IBase';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-notification-list',
  standalone: false,
  templateUrl: './notification-list.component.html'
})
export class NotificationListComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private settingsService: SettingsService,
    private loggedInUserService: LoggedInUserService
  ) { }

  pgEvent: PageEvent = { page: 0, first: 0, rows: 10 } as PageEvent;
  lstMain: INotification[];
  sortBy: string = 'Id';
  IsDescending: boolean = true;
  totalNoOfRecords = 0;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;

  objSearch: any = {
    Title: '',
    IncludeDeleted: false,
    CreatedByName: '',
    AuditType: '',
    Days: 1,
    RecordsFromDate: new Date()
  };

  brandPartner: any;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  gridSize: any = 'small';

  ngOnInit(): void {
    this.brandPartner = this.loggedInUserService.loggedInUser.BrandPartner;
    this.pgEvent.rows = this.settingsService.Settings.RecordsPerPage;
    this.gridSize = this.settingsService.Settings.GridSize;

    if (this.notificationService.CacheData.IsLoaded) {
      this.pgEvent = this.notificationService.CacheData.pgEvent;
      this.objSearch = this.notificationService.CacheData.objSearch;
      this.permission = this.notificationService.CacheData.permission;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.notificationService.CacheData.IsLoaded);
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
    this.objSearch = {
      Title: '',
      IncludeDeleted: false,
      CreatedByName: '',
      AuditType: '',
      Days: 1,
      RecordsFromDate: new Date()
    };
    this.searchData(this.pgEvent, true);
  }

  rowStyle(obj: INotification) {
    return { backgroundColor: 'normal' };
  }

  onPageChanged(arg): void {
    this.pgEvent.page = arg.page;
    this.pgEvent.rows = arg.rows;
    this.pgEvent.first = arg.first;
    this.searchData(this.pgEvent, true);
  }

  searchData(pgEvent: PageEvent, isReload: boolean): void {

    if (isReload || this.notificationService.CacheData.pgEvent.page != pgEvent.page) {

      var searchParam = {
        Skip: (pgEvent.page * pgEvent.rows),
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Conditions: this.getSearchParams()
      }

      this.isLoading = true;

      this.notificationService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.permission.CanCreate = true;

          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.notificationService.setCache(res.data, this.permission, this.objSearch, pgEvent);
        },
        error: err => {
          this.lstMain = [];
          this.messageService.showError(err);
          this.isLoading = false;
        },
        complete: () => { this.isLoading = false; }
      });

    }
    else {
      this.SetListData(this.notificationService.CacheData.Data, this.notificationService.CacheData.TotalRecords);
    }
  }

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords;
  }

  getSearchParams() {
    var Items = [];

    Items = [
     { DBName: 'Subject', Value: this.objSearch.Title, DataType: DataType.Text, Operator: Operator.Contains },
     ];

 
    var auditCriteria = null;

    if (this.objSearch.AuditType == 'Created') {
      auditCriteria = 'CreatedDateTime;' + this.objSearch.Days + ';' + this.loggedInUserService.formatDate(this.objSearch.RecordsFromDate);
    }
    else if (this.objSearch.AuditType == 'Modified') {
      auditCriteria = 'ModifiedDateTime;' + this.objSearch.Days + ';' + this.loggedInUserService.formatDate(this.objSearch.RecordsFromDate);
    }

    if (auditCriteria != null) {
      Items.push({ DBName: 'Records', Value: auditCriteria, DataType: DataType.Text, Operator: Operator.EqualTo });
    }

    return Items;
  }

  onDetailsClick(obj: any): void {
    this.router.navigate(['dashboard/notifications/view/' + obj.Id]);
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/notifications/create']);
    }
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }
  }
}
