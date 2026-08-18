import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { DepartmentService } from './department.service';
import { IDepartment } from './department';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './department-list.component.html'
})
export class DepartmentListComponent implements OnInit {

  constructor(
    private departmentService: DepartmentService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10, page: 0, pageCount: 0 };
  lstMain: IDepartment[] = [];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  organisationUnitId: number | null = null;
  objSearch: any = { RecordStatus: 'Active', Name: '',  CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    const routeId = Number(this.activatedRoute.snapshot.paramMap.get('organisationUnitId'));
    this.organisationUnitId = routeId > 0 ? routeId : null;
     if (this.isCurrentContextCached()) {
      this.currentPage = this.departmentService.CacheData.CurrentPage;
      this.objSearch = this.departmentService.CacheData.objSearch;
      this.permission = this.departmentService.CacheData.permission;
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

    if (isReload || this.departmentService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.departmentService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.departmentService.setCache(res.data, this.permission, this.objSearch, pgEvent.page, this.contextKey);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.departmentService.CacheData.Data, this.departmentService.CacheData.TotalRecords);
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
      { DBName: 'DepartmentName', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'DepartmentCode', Value: this.objSearch.Code, DataType: DataType.Text, Operator: Operator.Contains },
    ];

    if (this.organisationUnitId) {
      Items.push({ DBName: 'OrganisationUnitId', Value: this.organisationUnitId.toString(), DataType: DataType.Int, Operator: Operator.EqualTo });
    }


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
    const page = this.permission.CanCreate || this.permission.CanUpdate ? 'edit' : 'view';
    const route = this.organisationUnitId
      ? ['/business/organisations/departments/organisation-unit', this.organisationUnitId, page, obj.Id]
      : ['/business/organisations/departments', page, obj.Id];
    this.router.navigate(route);
  
  };

  onViewClick(item: IDepartment): void { const route = this.organisationUnitId ? ['/business/organisations/departments/organisation-unit', this.organisationUnitId, 'view', item.Id] : ['/business/organisations/departments/view', item.Id]; this.router.navigate(route, { state: { department: item } }); }
  onEditClick(item: IDepartment): void { const route = this.organisationUnitId ? ['/business/organisations/departments/organisation-unit', this.organisationUnitId, 'edit', item.Id] : ['/business/organisations/departments/edit', item.Id]; this.router.navigate(route, { state: { department: item } }); }
  getInitials(item: IDepartment): string { return (item.DepartmentName || item.DepartmentCode || 'Department').split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase(); }
  getStatusClass(status: string): string { const value = (status || '').toLowerCase(); return value.includes('active') ? 'status-active' : value.includes('inactive') || value.includes('closed') ? 'status-closed' : 'status-pending'; }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      const route = this.organisationUnitId
        ? ['/business/organisations/departments/organisation-unit', this.organisationUnitId, 'create']
        : ['/business/organisations/departments/create'];
      this.router.navigate(route);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }

  private get contextKey(): string {
    return this.organisationUnitId ? `organisation-unit:${this.organisationUnitId}` : 'all';
  }

  private isCurrentContextCached(): boolean {
    return !!this.departmentService.CacheData.IsLoaded && this.departmentService.CacheContextKey === this.contextKey;
  }
}




