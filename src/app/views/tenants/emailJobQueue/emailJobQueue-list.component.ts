import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';

import { IPermission } from '@/shared/IPermission';
import { DataType, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { EmailJobQueueService } from './emailJobQueue.service';
import { IEmailJobQueue } from './emailJobQueue';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-email-job-queue-list',
  standalone: false,
  templateUrl: './emailJobQueue-list.component.html'
})
export class EmailJobQueueListComponent implements OnInit {

  constructor(
    private emailJobQueueService: EmailJobQueueService,
    private router: Router
  ) { }
  pgEvent: PageEvent = { first: 0, rows: 10, page: 0, pageCount: 0 };
  lstMain: IEmailJobQueue[] = [];
  sortBy = 'Id';
  IsDescending = true;
  totalNoOfRecords = 0;
  currentPage = 0;
  isLoading = false;
  permission = {} as IPermission;
  objSearch = { EmailType: '', Status: '', Subject: '', ReferenceType: '' };
  readonly statusOptions = [
    { label: 'All statuses', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Sent', value: 'Sent' },
    { label: 'Failed', value: 'Failed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    if (this.emailJobQueueService.CacheData.IsLoaded) {
      this.currentPage = this.emailJobQueueService.CacheData.CurrentPage;
      this.objSearch = this.emailJobQueueService.CacheData.objSearch;
      this.permission = this.emailJobQueueService.CacheData.permission;
      this.pgEvent = { ...this.pgEvent, first: this.currentPage * this.pgEvent.rows, page: this.currentPage };
    }  
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.searchData(this.pgEvent, !this.emailJobQueueService.CacheData.IsLoaded), 0);
  }

  search(): void {
    this.pgEvent = { ...this.pgEvent, first: 0, page: 0 };
    this.searchData(this.pgEvent, true);
  }

  clearSearch(): void {
    this.objSearch = { EmailType: '', Status: '', Subject: '', ReferenceType: '' };
    this.search();
  }

  pageChanged(event: PaginatorState): void {
    const rows = event.rows ?? this.pgEvent.rows;
    const first = event.first ?? 0;
    const pageEvent: PageEvent = {
      first,
      rows,
      page: event.page ?? Math.floor(first / rows),
      pageCount: event.pageCount ?? Math.ceil(this.totalNoOfRecords / rows)
    };
    this.pgEvent = pageEvent;
    this.searchData(pageEvent, true);
  }

  searchData(pgEvent: PageEvent, isReload: boolean): void {
    if (!isReload && this.emailJobQueueService.CacheData.CurrentPage === pgEvent.page) {
      this.setListData(this.emailJobQueueService.CacheData.Data, this.emailJobQueueService.CacheData.TotalRecords);
      return;
    }

    const searchParam = {
      Skip: pgEvent.first,
      Take: pgEvent.rows,
      SortBy: this.sortBy,
      IsDescending: this.IsDescending,
      Conditions: this.getSearchParams()
    };
    this.isLoading = true;
    this.emailJobQueueService.search(searchParam).subscribe({
      next: res => {
        this.permission = res.permission;
        this.setListData(res.data.Records, res.data.TotalRecords);
        this.emailJobQueueService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
      },
      error: err => {
        this.lstMain = [];
        this.messageService.showError(err);
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  setListData(data: IEmailJobQueue[], totalRecords: number): void {
    this.lstMain = data ?? [];
    this.totalNoOfRecords = totalRecords ?? 0;
  }

  getSearchParams(): any[] {
    return [
      { DBName: 'EmailType', Value: this.objSearch.EmailType, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'Status', Value: this.objSearch.Status, DataType: DataType.Text, Operator: Operator.EqualTo },
      { DBName: 'Subject', Value: this.objSearch.Subject, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'ReferenceType', Value: this.objSearch.ReferenceType, DataType: DataType.Text, Operator: Operator.Contains }
    ];
  }

  onDetailsClick(item: IEmailJobQueue): void {
    this.router.navigate(['dashboard/emailJobQueues/view', item.Id]);
  }

  onOptionItemClicked(key: string): void {
    if (key === 'Refresh') {
      this.searchData(this.pgEvent, true);
    }
  }

  statusClass(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'sent':
        return 'status-active';
      case 'failed':
      case 'cancelled':
        return 'status-closed';
      default:
        return 'status-pending';
    }
  }
}




