import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { TenantEmailProfileService } from './tenantEmailProfile.service';
import { ITenantEmailProfile } from './tenantEmailProfile';
import { PageEvent } from '@/shared/IBase';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './tenantEmailProfile-list.component.html'
})
export class TenantEmailProfileListComponent implements OnInit {

  constructor(
    private tenantEmailProfileService: TenantEmailProfileService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10, page: 0, pageCount: 0 };
  lstMain: ITenantEmailProfile[]; 
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { ProfileCode: '', CompanyName: '', FromEmail: '' };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
     if (this.tenantEmailProfileService.CacheData.IsLoaded) {
      this.currentPage = this.tenantEmailProfileService.CacheData.CurrentPage;
      this.objSearch = this.tenantEmailProfileService.CacheData.objSearch;
      this.permission = this.tenantEmailProfileService.CacheData.permission;
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.tenantEmailProfileService.CacheData.IsLoaded);
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
    this.objSearch = { ProfileCode: '', CompanyName: '', FromEmail: '' };
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

    if (isReload || this.tenantEmailProfileService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.tenantEmailProfileService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.tenantEmailProfileService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.tenantEmailProfileService.CacheData.Data, this.tenantEmailProfileService.CacheData.TotalRecords);
    }
  }

   

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords; 
  }

  getSearchParams() {
    return [
      { DBName: 'ProfileCode', Value: this.objSearch.ProfileCode, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'CompanyName', Value: this.objSearch.CompanyName, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'FromEmail', Value: this.objSearch.FromEmail, DataType: DataType.Text, Operator: Operator.Contains }
    ];

  }

  onDetailsClick(obj: any): void {
    if (this.permission.CanUpdate) {
        this.router.navigate(['dashboard/emailProfiles/edit/' + obj.Id]);
    }
    else {
        this.router.navigate(['dashboard/emailProfiles/view/' + obj.Id]);
    } 
  
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/emailProfiles/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




