import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { QuoteService } from './quote.service';
import { IQuote, IQuoteList } from './quote';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './quote-list.component.html'
})
export class QuoteListComponent implements OnInit {

  constructor(
    private quoteService: QuoteService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10 } as PageEvent;
  lstMain: IQuoteList[];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { Name: '',  RecordStatus: 'Active', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
     if (this.quoteService.CacheData.IsLoaded) {
      this.currentPage = this.quoteService.CacheData.CurrentPage;
      this.objSearch = this.quoteService.CacheData.objSearch;
      this.permission = this.quoteService.CacheData.permission;
      this.pgEvent = {
        first: Math.max(0, (this.currentPage - 1) * this.pgEvent.rows),
        rows: this.pgEvent.rows,
        page: Math.max(0, this.currentPage - 1),
        pageCount: 0
      };
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.quoteService.CacheData.IsLoaded);
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
    this.resetPagination();
    this.searchData(this.pgEvent, true);
  }

  clearSearch(): void {
    this.objSearch = { Name: '', Code: '', RecordStatus: 'Active', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.resetPagination();
    this.searchData(this.pgEvent, true);
  }

  pageChanged(event: { first?: number; rows?: number; page?: number; pageCount?: number }): void {
    this.pgEvent = {
      first: event.first ?? 0,
      rows: event.rows ?? 10,
      page: event.page ?? 0,
      pageCount: event.pageCount ?? 0
    };
    this.currentPage = this.pgEvent.page + 1;
    this.searchData(this.pgEvent, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.quoteService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.quoteService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.quoteService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.quoteService.CacheData.Data, this.quoteService.CacheData.TotalRecords);
    }
  }

   

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords; 
  }

  getSearchParams() {
    var Items = [];
    Items = [
       { DBName: 'TenantId', Value: this.loggedInUserService.loggedInUser.Tenant.Id.toString(), DataType: DataType.Int, Operator: Operator.EqualTo },
       { DBName: 'RecordStatus', Value: this.objSearch.RecordStatus, DataType: DataType.Text, Operator: Operator.EqualTo },
       { DBName: 'QuoteId', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
     
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
    this.quoteService.getById(obj.Id).subscribe({
      next: data => {
        const quote = data.data as IQuote;
        if (quote?.IsEditable && (this.permission.CanCreate || this.permission.CanUpdate)) {
          this.router.navigate(['/business/origination/quotes/edit/' + obj.Id]);
        } else {
          // A pending or otherwise locked quotation still needs to be reviewed,
          // approved and issued. The legacy details view only renders fields and
          // leaves those workflow controls unreachable.
          this.router.navigate(['/business/origination/quotes/review/' + obj.Id]);
        }
      },
      error: err => this.messageService.showError(err)
    });
  };

  private resetPagination(): void {
    this.pgEvent = { first: 0, rows: this.pgEvent.rows || 10, page: 0, pageCount: 0 };
    this.currentPage = 1;
  }

  getStatusClass(status: string): string {
    const value = (status || '').toLowerCase();
    if (value.includes('accepted')) return 'status-active';
    if (value.includes('issued') || value.includes('draft')) return 'status-pending';
    if (value.includes('rejected') || value.includes('expired') || value.includes('withdrawn') || value.includes('superseded')) return 'status-closed';
    return 'status-pending';
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/origination/quotes/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




