import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { UploadSessionService } from './uploadSession.service';
import { IUploadSession } from './uploadSession';
import { PageEvent } from '@/shared/IBase';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './uploadSession-list.component.html'
})
export class UploadSessionListComponent implements OnInit {

  constructor(
    private uploadSessionService: UploadSessionService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10, page: 0, pageCount: 0 };
  lstMain: IUploadSession[]; 
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { DocumentId: '', DocumentVersionId: '', ObjectETag: '' };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
     if (this.uploadSessionService.CacheData.IsLoaded) {
      this.currentPage = this.uploadSessionService.CacheData.CurrentPage;
      this.objSearch = this.uploadSessionService.CacheData.objSearch;
      this.permission = this.uploadSessionService.CacheData.permission;
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.uploadSessionService.CacheData.IsLoaded);
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
    this.objSearch = { DocumentId: '', DocumentVersionId: '', ObjectETag: '' };
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

    if (isReload || this.uploadSessionService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.uploadSessionService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.uploadSessionService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.uploadSessionService.CacheData.Data, this.uploadSessionService.CacheData.TotalRecords);
    }
  }

   

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords; 
  }

  getSearchParams() {
    return [
      { DBName: 'TenantId', Value: this.loggedInUserService.loggedInUser.Tenant.Id.toString(), DataType: DataType.Int, Operator: Operator.EqualTo },
      { DBName: 'DocumentId', Value: this.objSearch.DocumentId, DataType: DataType.Int, Operator: Operator.EqualTo },
      { DBName: 'DocumentVersionId', Value: this.objSearch.DocumentVersionId, DataType: DataType.Int, Operator: Operator.EqualTo },
      { DBName: 'ObjectETag', Value: this.objSearch.ObjectETag, DataType: DataType.Text, Operator: Operator.Contains }
    ];
  }

  onDetailsClick(obj: any): void {
    if (this.permission.CanCreate || this.permission.CanUpdate) {
        this.router.navigate(['/dashboard/upload-sessions/edit/' + obj.Id]);
    }
    else {
        this.router.navigate(['/dashboard/upload-sessions/view/' + obj.Id]);
    } 
  
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/upload-sessions/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




