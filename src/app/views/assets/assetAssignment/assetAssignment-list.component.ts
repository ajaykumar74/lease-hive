import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { AssetAssignmentService } from './assetAssignment.service';
import { IAssetAssignment } from './assetAssignment';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './assetAssignment-list.component.html'
})
export class AssetAssignmentListComponent implements OnInit {

  constructor(
    private assetAssignmentService: AssetAssignmentService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10 } as PageEvent;
  lstMain: IAssetAssignment[]; 
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  assetId: number | null = null;
  Caption = 'Asset Assignment List';
  objSearch: any = { Name: '',  RecordStatus: 'Active', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    const routeAssetId = Number(this.activatedRoute.snapshot.paramMap.get('assetId'));
    this.assetId = routeAssetId > 0 ? routeAssetId : null;
    this.Caption = this.assetId
      ? `Asset Assignment List - Asset #${this.assetId}`
      : 'Asset Assignment List';

     if (this.isCurrentContextCached()) {
      this.currentPage = this.assetAssignmentService.CacheData.CurrentPage;
      this.objSearch = this.assetAssignmentService.CacheData.objSearch;
      this.permission = this.assetAssignmentService.CacheData.permission;
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.isCurrentContextCached());
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
    this.objSearch = { Name: '', Code: '', RecordStatus: 'Active', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.searchData(this.pgEvent, true);
  }

  pageChanged(arg): void {
    this.searchData(arg.page, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.assetAssignmentService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.assetAssignmentService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.assetAssignmentService.setCache(
            res.data,
            this.permission,
            this.objSearch,
            pgEvent.page,
            this.contextKey
          );
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.assetAssignmentService.CacheData.Data, this.assetAssignmentService.CacheData.TotalRecords);
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
      { DBName: 'AssignmentType', Value: this.objSearch.Code, DataType: DataType.Text, Operator: Operator.Contains },
     
    ];

    if (this.assetId) {
      Items.push({ DBName: 'AssetId', Value: this.assetId.toString(), DataType: DataType.Int, Operator: Operator.EqualTo });
    }
    else {
      Items.push({ DBName: 'AssetId', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains });
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

  getStatusClass(status: string): string {
    const value = (status || '').toLowerCase();
    if (value.includes('active') || value.includes('available') || value.includes('approved')) return 'status-active';
    if (value.includes('inactive') || value.includes('closed') || value.includes('retired')) return 'status-closed';
    return 'status-pending';
  }

  onViewClick(obj: any): void {
    const route = this.assetId
      ? ['/business/assets/assignments/asset', this.assetId, 'view', obj.Id]
      : ['/business/assets/assignments/view', obj.Id];
    this.router.navigate(route);
  }

  onDetailsClick(obj: any): void {
    const route = this.assetId
      ? ['/business/assets/assignments/asset', this.assetId, this.permission.CanCreate || this.permission.CanUpdate ? 'edit' : 'view', obj.Id]
      : ['/business/assets/assignments', this.permission.CanCreate || this.permission.CanUpdate ? 'edit' : 'view', obj.Id];

    this.router.navigate(route);
  
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      const route = this.assetId
        ? ['/business/assets/assignments/asset', this.assetId, 'create']
        : ['/business/assets/assignments/create'];
      this.router.navigate(route);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }

  private get contextKey(): string {
    return this.assetId ? `asset:${this.assetId}` : 'all';
  }

  private isCurrentContextCached(): boolean {
    return !!this.assetAssignmentService.CacheData.IsLoaded
      && this.assetAssignmentService.CacheContextKey === this.contextKey;
  }
}




