import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { LeadService } from './lead.service';
import { ILead } from './lead';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './lead-list.component.html'
})
export class LeadListComponent implements OnInit {

  constructor(
    private leadService: LeadService,
    private router: Router,
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10 } as PageEvent;
  lstMain: ILead[] = [];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0;
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { Name: '', RecordStatus: 'Active', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    if (this.leadService.CacheData.IsLoaded) {
      this.currentPage = this.leadService.CacheData.CurrentPage;
      this.objSearch = this.leadService.CacheData.objSearch;
      this.permission = this.leadService.CacheData.permission;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.leadService.CacheData.IsLoaded);
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

    if (isReload || this.leadService.CacheData.CurrentPage != pgEvent.page) {

      var searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Conditions: this.getSearchParams()
      }
      this.isLoading = true;
      this.leadService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.leadService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.leadService.CacheData.Data, this.leadService.CacheData.TotalRecords);
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
      { DBName: 'ProspectName', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },

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
      this.router.navigate(['/business/crm/leads/edit/' + obj.Id]);
    }
    else {
      this.router.navigate(['/business/crm/leads/view/' + obj.Id]);
    }

  };

  /** The destination can use either the query-string id or history.state.lead. */
  onLeadAction(action: 'edit' | 'opportunity' | 'requirement' | 'quote', lead: ILead): void {
    const routes = {
      edit: ['/business/crm/leads/edit', lead.Id],
      opportunity: ['/business/crm/opportunities'],
      requirement: ['/business/origination/requirements'],
      quote: ['/business/origination/quotes']
    };
    this.router.navigate(routes[action], { queryParams: { leadId: lead.Id }, state: { lead } });
  }

  getInitials(lead: ILead): string {
    const value = lead.ProspectName || lead.ContactName || 'Lead';
    return value.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }

  getStatusClass(status: string): string {
    const value = (status || '').toLowerCase();
    if (value.includes('active') || value.includes('qualified')) return 'status-active';
    if (value.includes('inactive') || value.includes('disqualified') || value.includes('closed')) return 'status-closed';
    return 'status-pending';
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/crm/leads/create']);
    }
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }
  }
}




