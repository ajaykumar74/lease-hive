import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { LocationService } from './location.service';
import { ILocation } from './location';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './location-list.component.html'
})
export class LocationListComponent implements OnInit {

  constructor(
    private locationService: LocationService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10, page: 0, pageCount: 0 };
  lstMain: ILocation[] = [];
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
     if (this.locationService.CacheData.IsLoaded) {
      this.currentPage = this.locationService.CacheData.CurrentPage;
      this.objSearch = this.locationService.CacheData.objSearch;
      this.permission = this.locationService.CacheData.permission;
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

    if (isReload || this.locationService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.locationService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.locationService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.locationService.CacheData.Data, this.locationService.CacheData.TotalRecords);
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
      { DBName: 'locationName', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'locationCode', Value: this.objSearch.Code, DataType: DataType.Text, Operator: Operator.Contains },
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
        this.router.navigate(['/business/organisations/locations/edit', obj.Id]);
    }
    else {
        this.router.navigate(['/business/organisations/locations/view', obj.Id]);
    } 
  
  };

  onViewClick(item: ILocation): void { this.router.navigate(['/business/organisations/locations/view', item.Id], { state: { location: item } }); }
  onEditClick(item: ILocation): void { this.router.navigate(['/business/organisations/locations/edit', item.Id], { state: { location: item } }); }
  getInitials(item: ILocation): string { return (item.LocationName || item.LocationCode || 'Location').split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase(); }
  getStatusClass(status: string): string { const value = (status || '').toLowerCase(); return value.includes('active') ? 'status-active' : value.includes('inactive') || value.includes('closed') ? 'status-closed' : 'status-pending'; }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/organisations/locations/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




