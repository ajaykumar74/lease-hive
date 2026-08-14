import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { PermissionService } from './permission.service';
import { IAppPermission } from './appPermission';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './permission-list.component.html'
})
export class PermissionListComponent implements OnInit {

  constructor(
    private permissionService: PermissionService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10 } as PageEvent;
  lstMain: IAppPermission[]; 
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { Name: '',  IncludeDeleted: false, CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
     if (this.permissionService.CacheData.IsLoaded) {
      this.currentPage = this.permissionService.CacheData.CurrentPage;
      this.objSearch = this.permissionService.CacheData.objSearch;
      this.permission = this.permissionService.CacheData.permission;
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.permissionService.CacheData.IsLoaded);
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
    this.objSearch = { Name: '', Code: '', IncludeDeleted: false, CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.searchData(this.pgEvent, true);
  }

  pageChanged(arg): void {
    this.searchData(arg.page, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.permissionService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.permissionService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          //look for all permisison starting with "Module" and set the permission for this page
         /*  this.permission.CanCreate = this.loggedInUserService.loggedInUser.Permissions.some(p => p.PermissionCode === 'Module.Create');
          this.permission.CanUpdate = this.loggedInUserService.loggedInUser.Permissions.some(p => p.PermissionCode === 'Module.Update');
          this.permission.CanDelete = this.loggedInUserService.loggedInUser.Permissions.some(p => p.PermissionCode === 'Module.Delete');
          this.permission.CanViewOnly = this.loggedInUserService.loggedInUser.Permissions.some(p => p.PermissionCode === 'Module.ViewOnly');
          this.permission.CanPrint = this.loggedInUserService.loggedInUser.Permissions.some(p => p.PermissionCode === 'Module.Print');
    */       this.SetListData(res.data.Records, res.data.TotalRecords);
          this.permissionService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.permissionService.CacheData.Data, this.permissionService.CacheData.TotalRecords);
    }
  }

   

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords; 
  }

  getSearchParams() {
    var Items = [];
    Items = [
    //  { DBName: 'OperatorId', Value: '', DataType: DataType.Int, Operator: Operator.EqualTo },
      { DBName: 'Name', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'Code', Value: this.objSearch.Code, DataType: DataType.Text, Operator: Operator.Contains },
    ];


    var auditCriteria = null;
    if (this.objSearch.IncludeDeleted == false) {
      Items.push({ DBName: 'IsDeleted', Value: 'false', DataType: DataType.bit, Operator: Operator.EqualTo })
    }

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
        this.router.navigate(['permissions/edit/' + obj.Id]);
    }
    else {
        this.router.navigate(['permissions/view/' + obj.Id]);
    } 
  
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['permissions/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




