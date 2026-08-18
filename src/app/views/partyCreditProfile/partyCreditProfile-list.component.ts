import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { PartyCreditProfileService } from './partyCreditProfile.service';
import { IPartyCreditProfile } from './partyCreditProfile';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './partyCreditProfile-list.component.html'
})
export class PartyCreditProfileListComponent implements OnInit {

  constructor(
    private partyCreditProfileService: PartyCreditProfileService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10 } as PageEvent;
  lstMain: IPartyCreditProfile[]; 
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  partyId: number | null = null;
  objSearch: any = { RecordStatus: 'Active', Name: '',  CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    const routePartyId = Number(this.activatedRoute.snapshot.paramMap.get('partyId'));
    this.partyId = routePartyId > 0 ? routePartyId : null;
     if (this.isCurrentContextCached()) {
      this.currentPage = this.partyCreditProfileService.CacheData.CurrentPage;
      this.objSearch = this.partyCreditProfileService.CacheData.objSearch;
      this.permission = this.partyCreditProfileService.CacheData.permission;
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.isCurrentContextCached());
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

  pageChanged(arg): void {
    this.searchData(arg.page, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.partyCreditProfileService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.partyCreditProfileService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.partyCreditProfileService.setCache(res.data, this.permission, this.objSearch, pgEvent.page, this.contextKey);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.partyCreditProfileService.CacheData.Data, this.partyCreditProfileService.CacheData.TotalRecords);
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
    //  { DBName: 'Name', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'CreditPolicyCode', Value: this.objSearch.Code, DataType: DataType.Text, Operator: Operator.Contains },
    ];

    if (this.partyId) {
      Items.push({ DBName: 'PartyId', Value: this.partyId.toString(), DataType: DataType.Int, Operator: Operator.EqualTo });
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
    const route = this.partyId
      ? ['/business/parties/credit-profiles/party', this.partyId, page, obj.Id]
      : ['/business/parties/credit-profiles', page, obj.Id];
    this.router.navigate(route);
  
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      const route = this.partyId
        ? ['/business/parties/credit-profiles/party', this.partyId, 'create']
        : ['/business/parties/credit-profiles/create'];
      this.router.navigate(route);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }

  private get contextKey(): string {
    return this.partyId ? `party:${this.partyId}` : 'all';
  }

  private isCurrentContextCached(): boolean {
    return !!this.partyCreditProfileService.CacheData.IsLoaded
      && this.partyCreditProfileService.CacheContextKey === this.contextKey;
  }
}




