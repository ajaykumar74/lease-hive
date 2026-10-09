import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { TenantNotificationRecipientRuleService } from './tenantNotificationRecipientRule.service';
import { ITenantNotificationRecipientRule } from './tenantNotificationRecipientRule';
import { PageEvent } from '@/shared/IBase';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './tenantNotificationRecipientRule-list.component.html'
})
export class TenantNotificationRecipientRuleListComponent implements OnInit {

  constructor(
    private tenantNotificationRecipientRuleService: TenantNotificationRecipientRuleService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10, page: 0, pageCount: 0 };
  lstMain: ITenantNotificationRecipientRule[]; 
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { TenantNotificationId: '', RecipientType: '', SourceType: '' };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
     if (this.tenantNotificationRecipientRuleService.CacheData.IsLoaded) {
      this.currentPage = this.tenantNotificationRecipientRuleService.CacheData.CurrentPage;
      this.objSearch = this.tenantNotificationRecipientRuleService.CacheData.objSearch;
      this.permission = this.tenantNotificationRecipientRuleService.CacheData.permission;
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.tenantNotificationRecipientRuleService.CacheData.IsLoaded);
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
    this.objSearch = { TenantNotificationId: '', RecipientType: '', SourceType: '' };
    this.searchData(this.pgEvent, true);
  }

  pageChanged(arg: PaginatorState): void {
    const rows = arg.rows ?? this.pgEvent.rows;
    const first = arg.first ?? 0;
    const pageEvent: PageEvent = {
      first,
      rows,
      page: arg.page ?? Math.floor(first / rows),
      pageCount: arg.pageCount ?? Math.ceil(this.totalNoOfRecords / rows)
    };
    this.pgEvent = pageEvent;
    this.searchData(pageEvent, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.tenantNotificationRecipientRuleService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.tenantNotificationRecipientRuleService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.tenantNotificationRecipientRuleService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.tenantNotificationRecipientRuleService.CacheData.Data, this.tenantNotificationRecipientRuleService.CacheData.TotalRecords);
    }
  }

   

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords; 
  }

  getSearchParams() {
    return [
      { DBName: 'TenantNotificationId', Value: this.objSearch.TenantNotificationId, DataType: DataType.Int, Operator: Operator.EqualTo },
      { DBName: 'RecipientType', Value: this.objSearch.RecipientType, DataType: DataType.Text, Operator: Operator.EqualTo },
      { DBName: 'SourceType', Value: this.objSearch.SourceType, DataType: DataType.Text, Operator: Operator.EqualTo }
    ];

  }

  onDetailsClick(obj: any): void {
    if (this.permission.CanUpdate) {
        this.router.navigate(['dashboard/notificationRecipientRules/edit/' + obj.Id]);
    }
    else {
        this.router.navigate(['dashboard/notificationRecipientRules/view/' + obj.Id]);
    } 
  
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/notificationRecipientRules/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




