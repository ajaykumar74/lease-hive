import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { OpportunityService } from './opportunity.service';
import { IOpportunity } from './opportunity';
import { PageEvent } from '@/shared/IBase';
import { ILead } from '../lead/lead';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './opportunity-list.component.html'
})
export class OpportunityListComponent implements OnInit {

  constructor(
    private opportunityService: OpportunityService,
    private router: Router,
    private route: ActivatedRoute,
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10 } as PageEvent;
  lstMain: IOpportunity[]; 
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0; 
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { Name: '',  RecordStatus: 'Active', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
  leadId: number | null = null;
  selectedLead: ILead | null = null;

  get listCaption(): string {
    if (this.selectedLead?.ProspectName) {
      return `${this.selectedLead.ProspectName}'s Opportunities`;
    }
    return this.leadId ? 'Lead Opportunities' : 'Opportunity List';
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    const queryLeadId = Number(this.route.snapshot.queryParamMap.get('leadId'));
    this.leadId = Number.isInteger(queryLeadId) && queryLeadId > 0 ? queryLeadId : null;

    const navigationLead = history.state?.lead as ILead | undefined;
    if (navigationLead && navigationLead.Id === this.leadId) {
      this.selectedLead = navigationLead;
    }

     if (!this.leadId && this.opportunityService.CacheData.IsLoaded) {
      this.currentPage = this.opportunityService.CacheData.CurrentPage;
      this.objSearch = this.opportunityService.CacheData.objSearch;
      this.permission = this.opportunityService.CacheData.permission;
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !!this.leadId || !this.opportunityService.CacheData.IsLoaded);
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

  pageChanged(event: { first?: number; rows?: number }): void {
    const pageEvent = {
      first: event.first ?? 0,
      rows: event.rows ?? this.pgEvent.rows
    } as PageEvent;
    this.pgEvent = pageEvent;
    this.currentPage = Math.floor(pageEvent.first / pageEvent.rows) + 1;
    this.searchData(pageEvent, true);
  }

	searchData(pgEvent: PageEvent, isReload: boolean): void { 

    if (isReload || this.opportunityService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending  ,
        Conditions: this.getSearchParams()  
      }
      this.isLoading = true;
      this.opportunityService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission; 
          this.SetListData(res.data.Records, res.data.TotalRecords);
          if (!this.leadId) {
            this.opportunityService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
          }
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.opportunityService.CacheData.Data, this.opportunityService.CacheData.TotalRecords);
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
       { DBName: 'OpportunityName', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
     
    ];

    if (this.leadId) {
      Items.push({ DBName: 'LeadId', Value: this.leadId.toString(), DataType: DataType.Int, Operator: Operator.EqualTo });
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
        this.router.navigate(['/business/crm/opportunities/edit/' + obj.Id]);
    }
    else {
        this.router.navigate(['/business/crm/opportunities/view/' + obj.Id]);
    } 
  
  };

  onViewClick(opportunity: IOpportunity): void {
    this.router.navigate(['/business/crm/opportunities/view', opportunity.Id]);
  }

  onEditClick(opportunity: IOpportunity): void {
    this.router.navigate(['/business/crm/opportunities/edit', opportunity.Id]);
  }

  getInitials(opportunity: IOpportunity): string {
    const value = opportunity.OpportunityName || opportunity.OpportunityId || 'Opportunity';
    return value.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }

  getWeightedValue(opportunity: IOpportunity): number {
    return (Number(opportunity.EstimatedAmount) || 0) * (Number(opportunity.ProbabilityPct) || 0) / 100;
  }

  getStatusClass(status: string): string {
    const value = (status || '').toLowerCase();
    if (value.includes('active') || value.includes('open') || value.includes('qualified')) return 'status-active';
    if (value.includes('inactive') || value.includes('lost') || value.includes('closed')) return 'status-closed';
    return 'status-pending';
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/crm/opportunities/create']);
    } 
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }    
  }
}




