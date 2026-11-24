import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { LeaseRequirementAssetService } from './leaseRequirementAsset.service';
import { ILeaseRequirementAsset } from './leaseRequirementAsset';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './leaseRequirementAsset-list.component.html'
})
export class LeaseRequirementAssetListComponent implements OnInit {

  constructor(
    private leaseRequirementAssetService: LeaseRequirementAssetService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10 } as PageEvent;
  lstMain: ILeaseRequirementAsset[]; 
  sortBy: string = 'CreatedDateTime';
  IsDescending: boolean = true;
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
     if (this.leaseRequirementAssetService.CacheData.IsLoaded) {
      this.currentPage = this.leaseRequirementAssetService.CacheData.CurrentPage;
      this.objSearch = this.leaseRequirementAssetService.CacheData.objSearch;
      this.permission = this.leaseRequirementAssetService.CacheData.permission;
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.leaseRequirementAssetService.CacheData.IsLoaded);
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

  pageChanged(arg: Partial<PageEvent>): void {
    this.pgEvent = { ...this.pgEvent, ...arg } as PageEvent;
    this.currentPage = (arg.page ?? Math.floor((arg.first ?? 0) / (arg.rows ?? this.pgEvent.rows)) + 1) + 1;
    this.searchData(this.pgEvent, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.leaseRequirementAssetService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.leaseRequirementAssetService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.leaseRequirementAssetService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.leaseRequirementAssetService.CacheData.Data, this.leaseRequirementAssetService.CacheData.TotalRecords);
    }
  }

   

  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords; 
  }

  getSearchParams() {
    var Items = [];
    Items = [
      { DBName: 'RecordStatus', Value: this.objSearch.RecordStatus, DataType: DataType.Text, Operator: Operator.EqualTo }
    ];

    const searchTerm = this.objSearch.Name?.trim();
    if (searchTerm) {
      const searchFields = 'LeaseRequirementAssetId;LeaseRequirementDisplayName;AssetDisplayName;AssetMakeDisplayName;AssetModelDisplayName';
      const searchValues = Array(5).fill(searchTerm).join(';');
      Items.push({ DBName: searchFields, Value: searchValues, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR });
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
    if (this.permission.CanCreate || this.permission.CanUpdate) {
        this.router.navigate(['/business/crm/leaseRequirementAssets/edit/' + obj.Id]);
    }
    else {
        this.router.navigate(['/business/crm/leaseRequirementAssets/view/' + obj.Id]);
    } 
  
  };

  onViewClick(asset: ILeaseRequirementAsset): void {
    this.router.navigate(['/business/crm/leaseRequirementAssets/view', asset.Id]);
  }

  onEditClick(asset: ILeaseRequirementAsset): void {
    this.router.navigate(['/business/crm/leaseRequirementAssets/edit', asset.Id]);
  }

  createQuote(asset: ILeaseRequirementAsset): void {
    this.router.navigate(['/business/origination/quotes/create'], {
      queryParams: {
        leaseRequirementId: asset.LeaseRequirementId,
        leaseRequirementAssetId: asset.Id
      }
    });
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/crm/leaseRequirementAssets/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




