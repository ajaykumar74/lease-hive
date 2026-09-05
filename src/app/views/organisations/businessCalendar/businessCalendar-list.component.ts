import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { BusinessCalendarService } from './businessCalendar.service';
import { IBusinessCalendar } from './businessCalendar';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './businessCalendar-list.component.html'
})
export class BusinessCalendarListComponent implements OnInit {

  constructor(
    private businessCalendarService: BusinessCalendarService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10, page: 0, pageCount: 0 };
  lstMain: IBusinessCalendar[] = [];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { RecordStatus: 'Active', Name: '',  CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
     if (this.businessCalendarService.CacheData.IsLoaded) {
      this.currentPage = this.businessCalendarService.CacheData.CurrentPage;
      this.objSearch = this.businessCalendarService.CacheData.objSearch;
      this.permission = this.businessCalendarService.CacheData.permission;
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, true);
    }, 500);
  }

  onAdvSearchClicked(obj: any): void {
    this.objSearch = { ...obj, RecordStatus: obj.RecordStatus || 'Active' };
    this.search();
  }

  onHideAdvSearch(): void {
    this.isAdvanceView = !this.isAdvanceView;
  }


  search(): void {
    this.searchData(this.pgEvent, true);
  }

  clearSearch(): void {
    this.objSearch = { RecordStatus: 'Active', Name: '', Code: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.searchData(this.pgEvent, true);
  }

  pageChanged(event: { first?: number; rows?: number; page?: number; pageCount?: number }): void {
    this.pgEvent = { first: event.first ?? 0, rows: event.rows ?? 10, page: event.page ?? 0, pageCount: event.pageCount ?? 0 };
    this.currentPage = this.pgEvent.page + 1;
    this.searchData(this.pgEvent, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.businessCalendarService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.businessCalendarService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.businessCalendarService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.businessCalendarService.CacheData.Data, this.businessCalendarService.CacheData.TotalRecords);
    }
  }

   

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords; 
  }

  getSearchParams() {
    var Items = [];
    Items = [
      { DBName: 'RecordStatus', Value: this.objSearch.RecordStatus, DataType: DataType.Text, Operator: Operator.EqualTo },
    //  { DBName: 'OperatorId', Value: '', DataType: DataType.Int, Operator: Operator.EqualTo },
      { DBName: 'CalendarName', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
     // { DBName: 'Code', Value: this.objSearch.Code, DataType: DataType.Text, Operator: Operator.Contains },
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
        this.router.navigate(['/business/organisations/calendars/edit', obj.Id]);
    }
    else {
        this.router.navigate(['/business/organisations/calendars/view', obj.Id]);
    } 
  
  };

  onViewClick(item: IBusinessCalendar): void { this.router.navigate(['/business/organisations/calendars/view', item.Id], { state: { businessCalendar: item } }); }
  onEditClick(item: IBusinessCalendar): void { this.router.navigate(['/business/organisations/calendars/edit', item.Id], { state: { businessCalendar: item } }); }
  getInitials(item: IBusinessCalendar): string { return (item.CalendarName || item.CalendarCode || 'Calendar').split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase(); }
  getStatusClass(status: string): string { const value = (status || '').toLowerCase(); return value.includes('active') ? 'status-active' : value.includes('inactive') || value.includes('closed') ? 'status-closed' : 'status-pending'; }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/organisations/calendars/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




