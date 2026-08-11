import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { ExceptionLogService } from './exceptionLog.service';
import { IExceptionLog } from './exceptionLog';
import { PageEvent } from '@/shared/IBase';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-ExceptionLog-list',
  standalone: false,
  templateUrl: './ExceptionLog-list.component.html'
})
export class ExceptionLogListComponent implements OnInit {

  constructor(
    private ExceptionLogService: ExceptionLogService,
    private router: Router,
    private settingsService: SettingsService,
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { page: 0, first: 0, rows: 100 } as PageEvent;
  lstMain: IExceptionLog[];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { Name: '', IncludeDeleted: false, CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
  brandPartner: any;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;
  gridSize: any = 'small';

  now = new Date();
  toDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 1); // Tomorrow
  fromDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 7); // 7 days ago

  daysToKeep: number = 0;


  ngOnInit(): void {
    this.brandPartner = this.loggedInUserService.loggedInUser.BrandPartner;
    this.pgEvent.rows = this.settingsService.Settings.RecordsPerPage;
    this.gridSize = this.settingsService.Settings.GridSize;
    if (this.ExceptionLogService.CacheData.IsLoaded) {
      this.pgEvent = this.ExceptionLogService.CacheData.pgEvent;
      this.objSearch = this.ExceptionLogService.CacheData.objSearch;
      this.permission = this.ExceptionLogService.CacheData.permission;
    }
  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.searchData(this.pgEvent, !this.ExceptionLogService.CacheData.IsLoaded);
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

  rowStyle(obj: IExceptionLog) {

  }

  onPageChanged(arg): void {
    this.pgEvent.page = arg.page;
    this.pgEvent.rows = arg.rows;
    this.pgEvent.first = arg.first;
    this.searchData(this.pgEvent, true);
  }

  searchData(pgEvent: PageEvent, isReload: boolean): void {

    if (isReload || this.ExceptionLogService.CacheData.pgEvent.page != pgEvent.page) {

      var searchParam = {
        Skip: (pgEvent.page * pgEvent.rows),
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Conditions: this.getSearchParams()
      }
      this.isLoading = true;
      this.ExceptionLogService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.permission.CanCreate = true;
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.ExceptionLogService.setCache(res.data, this.permission, this.objSearch, pgEvent);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.ExceptionLogService.CacheData.Data, this.ExceptionLogService.CacheData.TotalRecords);
    }
  }



  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords;
  }

  getSearchParams() {
    var Items = [];
    // if (this.fromDate != null) {
    //   Items.push({ DBName: 'CreatedDateTime', Value: this.loggedInUserService.formatDate(this.fromDate), DataType: DataType.Date, Operator: Operator.LessThanEqualTo })
    // }
    // if (this.toDate != null) {
    //   Items.push({ DBName: 'CreatedDateTime', Value: this.loggedInUserService.formatDate(this.toDate), DataType: DataType.Date, Operator: Operator.GreaterThanEqualTo })
    // }
    // return Items;

  }

  onDetailsClick(obj: any): void {
    this.router.navigate(['dashboard/exceptionLogs/view/' + obj.Id]);
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/exceptionLogs/create']);
    }
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }

  }

  onDeleteOld(): void {

    this.isLoading = true;
    this.ExceptionLogService.deleteOld(this.daysToKeep).subscribe({
      next: res => {
        this.search();
      },
      error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
      complete: () => { this.isLoading = false; }
    });
  }

}




