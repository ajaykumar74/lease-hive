import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { SupportTicketService } from './supportTicket.service';
import { ISupportTicket, TagSeverity } from './supportTicket';
import { PageEvent } from '@/shared/IBase';
import { SettingsService } from '../settings/settings.service';
import { AppConstants } from '@/shared/constants/AppConstants'

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './supportTicket-list.component.html'
})
export class SupportTicketListComponent implements OnInit {

  constructor(
    private readonly supportTicketService: SupportTicketService,
    private readonly settingsService: SettingsService,
    private readonly router: Router,
    private readonly loggedInUserService: LoggedInUserService,
    private readonly appConstants: AppConstants,
  ) { }
  pgEvent: PageEvent = { page: 0, first: 0, rows: 10 } as PageEvent;
  lstMain: ISupportTicket[];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { Name: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  isCustomer: boolean = false;
  brandPartner: any;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;
  gridSize: any = 'small';
  ngOnInit(): void {
    this.isCustomer = (this.loggedInUserService.loggedInUser?.AccountType === 'Customer')
    this.pgEvent.rows = this.settingsService.Settings.RecordsPerPage;
    this.gridSize = this.settingsService.Settings.GridSize;
    if (this.supportTicketService.CacheData.IsLoaded) {
      this.pgEvent = this.supportTicketService.CacheData.pgEvent;
      this.objSearch = this.supportTicketService.CacheData.objSearch;
      this.permission = this.supportTicketService.CacheData.permission;
    }
    this.brandPartner = this.loggedInUserService.loggedInUser.BrandPartner;
  }

  // Todo move in SupportTicketService
  getTagSeverity(key: string | null | undefined): TagSeverity {
    const map: Record<string, TagSeverity> = {
      high: 'danger',
      medium: 'warn',
      low: 'info',

      Open: 'warn',
      InProgress: 'info',
      Resolved: 'secondary',
      Closed: 'success',
      Reopened: 'danger',
    };
    return map[key?.toLowerCase() ?? ''] ?? 'info';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.supportTicketService.CacheData.IsLoaded);
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
    this.objSearch = { Name: '', Code: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.searchData(this.pgEvent, true);
  }

  onPageChanged(arg): void {
    this.pgEvent.page = arg.page;
    this.pgEvent.rows = arg.rows; 
    this.pgEvent.first = arg.first; 
    this.searchData(this.pgEvent, true);
  }

  searchData(pgEvent: PageEvent, isReload: boolean): void {

    if (isReload || this.supportTicketService.CacheData.pgEvent.page != pgEvent.page) {

      let brandPartnerId = 0;
      if (this.loggedInUserService.loggedInUser.AccountType == this.appConstants.RecordType.BrandPartner) {
        brandPartnerId = this.loggedInUserService.loggedInUser.BrandPartner.Id;
      }
      let searchParam = {
        Skip: (pgEvent.page * pgEvent.rows),
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Conditions: this.getSearchParams(),
        BrandPartnerId: brandPartnerId
      }
      this.isLoading = true;
      this.supportTicketService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.supportTicketService.setCache(res.data, this.permission, this.objSearch, pgEvent);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.supportTicketService.CacheData.Data, this.supportTicketService.CacheData.TotalRecords);
    }
  }



  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords;
  }

  getSearchParams() {
    let Items = [];

    Items = [
      { DBName: 'Title', Value: this.objSearch.Title, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'Code', Value: this.objSearch.Code, DataType: DataType.Text, Operator: Operator.Contains },
    ];

    if (this.loggedInUserService.loggedInUser?.AccountType === 'Customer') {
      Items.push({ DBName: 'CustomerId', Value: this.loggedInUserService.loggedInUser.Customer.Id.toString(), DataType: DataType.Int, Operator: Operator.EqualTo })
    }
    let auditCriteria = null;

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
    this.router.navigate(['dashboard/supportTickets/view/' + obj.Id]);
  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/supportTickets/create']);
    }
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }

  }

}




