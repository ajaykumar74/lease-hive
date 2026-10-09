import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { LoggedInUserService } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { AuditLogService } from './auditLog.service';
import { IAuditLog } from './auditLog';
import { PageEvent } from '@/shared/IBase';
import { ISelectItem } from '@/shared/ISelectItem';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './auditLog-list.component.html'
})
export class AuditLogListComponent implements OnInit {

  constructor(
    private auditLogService: AuditLogService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10 } as PageEvent;
  lstMain: IAuditLog[]; 
  sortBy: string = 'OccurredAt';
  IsDescending: boolean = true;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { StartDate: null, EndDate: null, ApplicationUserId: null };
  applicationUserOptions: ISelectItem[] = [];

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
     if (this.auditLogService.CacheData.IsLoaded) {
      this.currentPage = this.auditLogService.CacheData.CurrentPage;
      this.objSearch = this.auditLogService.CacheData.objSearch;
      this.permission = this.auditLogService.CacheData.permission;
    }

    this.loadApplicationUserOptions();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.auditLogService.CacheData.IsLoaded);
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
    this.objSearch = { StartDate: null, EndDate: null, ApplicationUserId: null };
    this.searchData(this.pgEvent, true);
  }

  pageChanged(arg): void {
    this.searchData(arg.page, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.auditLogService.CacheData.CurrentPage != pgEvent.page) {

      const searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        StartDate: this.formatDateForApi(this.objSearch.StartDate),
        EndDate: this.formatDateForApi(this.objSearch.EndDate),
        ApplicationUserId: this.objSearch.ApplicationUserId || null
      };
      this.isLoading = true;
      this.auditLogService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.auditLogService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.auditLogService.CacheData.Data, this.auditLogService.CacheData.TotalRecords);
    }
  }

   

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords; 
  }

  getApplicationUserLabel(applicationUserId: number): string {
    return this.applicationUserOptions.find(option => Number(option.Value) === applicationUserId)?.Text
      ?? `User #${applicationUserId}`;
  }

  onDetailsClick(obj: any): void {
    this.router.navigate(['/dashboard/auditLogs/view', obj.Id]);
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/auditLogs/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }
  }

  private loadApplicationUserOptions(): void {
    this.loggedInUserService.getApplicationUserOptions().subscribe({
      next: options => this.applicationUserOptions = options,
      error: err => this.messageService?.showError(err)
    });
  }

  private formatDateForApi(value: Date | string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}




