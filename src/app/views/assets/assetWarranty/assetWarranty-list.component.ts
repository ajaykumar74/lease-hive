import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { AssetWarrantyService } from './assetWarranty.service';
import { IAssetWarranty } from './assetWarranty';
import { PageEvent } from '@/shared/IBase';
import { PermissionService } from '@/shared/security/permission.service';

@Component({
  selector: 'app-assetwarranty-list',
  standalone: false,
  templateUrl: './assetWarranty-list.component.html'
})
export class AssetWarrantyListComponent implements OnInit {

  constructor(
    private assetWarrantyService: AssetWarrantyService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private loggedInUserService: LoggedInUserService,
    private readonly permissionService: PermissionService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10 } as PageEvent;
  lstMain: IAssetWarranty[]; 
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  assetId: number | null = null;
  objSearch: any = { Name: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    const routeAssetId = Number(this.activatedRoute.snapshot.paramMap.get('assetId'));
    this.assetId = routeAssetId > 0 ? routeAssetId : null;
     if (this.assetWarrantyService.CacheData.IsLoaded) {
      this.currentPage = this.assetWarrantyService.CacheData.CurrentPage;
      this.objSearch = this.assetWarrantyService.CacheData.objSearch;
      this.permission = this.assetWarrantyService.CacheData.permission;
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, this.assetId !== null || !this.assetWarrantyService.CacheData.IsLoaded);
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
    this.objSearch = { Name: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.searchData(this.pgEvent, true);
  }

  pageChanged(arg): void {
    this.searchData(arg.page, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.assetWarrantyService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.assetWarrantyService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.assetWarrantyService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.assetWarrantyService.CacheData.Data, this.assetWarrantyService.CacheData.TotalRecords);
    }
  }

   

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords; 
  }

  getSearchParams() {
    var Items = [];
    Items = [
      { DBName: 'WarrantyNo', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
     
    ];

    if (this.assetId) {
      Items.push({ DBName: 'AssetId', Value: this.assetId.toString(), DataType: DataType.Int, Operator: Operator.EqualTo });
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
    if (this.permissionService.hasPermission('asset.assetwarranty.update')) {
        this.router.navigate(['/business/assets/warranties/edit', obj.Id]);
    }
    else {
        this.router.navigate(['/business/assets/warranties/view', obj.Id]);
    } 
  
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/assets/warranties/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




