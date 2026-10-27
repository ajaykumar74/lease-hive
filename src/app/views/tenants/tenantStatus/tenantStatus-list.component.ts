import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { TenantStatusService } from './tenantStatus.service';
import { ITenantStatus } from './tenantStatus';
import { PageEvent } from '@/shared/IBase';
import { ISelectItem } from '@/shared/ISelectItem';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';

@Component({
  selector: 'app-tenant-status-list',
  standalone: false,
  templateUrl: './tenantStatus-list.component.html'
})
export class TenantStatusListComponent implements OnInit {

  constructor(
    private tenantStatusService: TenantStatusService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService,
    private lookups: PlatformAdminLookupService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10, page: 0, pageCount: 0 };
  lstMain: ITenantStatus[] = [];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  tenantOptions: ISelectItem[] = [];
  objSearch: any = { Name: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
     if (this.tenantStatusService.CacheData.IsLoaded) {
      this.currentPage = this.tenantStatusService.CacheData.CurrentPage;
      this.objSearch = this.tenantStatusService.CacheData.objSearch;
      this.permission = this.tenantStatusService.CacheData.permission;
    }
    this.lookups.getTenants().subscribe({
      next: options => this.tenantOptions = options,
      error: err => this.messageService?.showError(err)
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.tenantStatusService.CacheData.IsLoaded);
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
    this.objSearch = { Name: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.searchData(this.pgEvent, true);
  }

  pageChanged(event: { first?: number; rows?: number; page?: number; pageCount?: number }): void {
    this.pgEvent = {
      first: event.first ?? 0,
      rows: event.rows ?? 10,
      page: event.page ?? 0,
      pageCount: event.pageCount ?? 0
    } as PageEvent;
    this.searchData(this.pgEvent, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.tenantStatusService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.tenantStatusService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.tenantStatusService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.tenantStatusService.CacheData.Data, this.tenantStatusService.CacheData.TotalRecords);
    }
  }

   

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords; 
  }

  getSearchParams() {
    var Items = [];
    Items = [
      { DBName: 'Status', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
     
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

  getTenantLabel(tenantId: number): string | number {
    return this.tenantOptions.find(option => Number(option.Value) === Number(tenantId))?.Text || tenantId;
  }

  onDetailsClick(obj: any): void {
    if (this.permission.CanCreate || this.permission.CanUpdate) {
        this.router.navigate(['/dashboard/tenantStatuss', 'edit', obj.Id]);
    }
    else {
        this.router.navigate(['/dashboard/tenantStatuss', 'view', obj.Id]);
    } 
  
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/tenantStatuss', 'create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




