import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { PicklistItemService } from './picklistItem.service';
import { IPicklistItem } from './picklistItem';
import { PageEvent } from '@/shared/IBase';
import { ISelectItem } from '@/shared/ISelectItem';

@Component({
  selector: 'app-picklistItem-list',
  standalone: false,
  templateUrl: './picklistItem-list.component.html'
})
export class PicklistItemListComponent implements OnInit {

  constructor(
    private picklistItemService: PicklistItemService,
    private router: Router,
    private loggedInUserService: LoggedInUserService,
    private confirmationService: ConfirmationService
  ) { }
  pgEvent: PageEvent = { page: 0, first: 0, rows: 10 } as PageEvent;
  lstMain: IPicklistItem[] = [];
  categoryOptions: ISelectItem[] = [];
  sortBy = 'Category';
  IsDescending = false;
  totalNoOfRecords = 0;
  currentPage = 0;
  isLoading = false;
  deletingId: number | null = null;
  permission = {} as IPermission;
  objSearch = { Category: '' };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    if (this.picklistItemService.CacheData.IsLoaded) {
      this.currentPage = this.picklistItemService.CacheData.CurrentPage;
      this.objSearch = this.picklistItemService.CacheData.objSearch;
      this.permission = this.picklistItemService.CacheData.permission;
      this.pgEvent = { ...this.pgEvent, page: this.currentPage, first: this.currentPage * this.pgEvent.rows };
    }
    this.loadCategoryOptions();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.picklistItemService.CacheData.IsLoaded);
    }, 500);
  }

  search(): void {
    this.pgEvent = { ...this.pgEvent, first: 0, page: 0 };
    this.searchData(this.pgEvent, true);
  }

  clearSearch(): void {
    this.objSearch = { Category: '' };
    this.search();
  }

  onPageChanged(event: PaginatorState): void {
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

    if (isReload || this.picklistItemService.CacheData.CurrentPage != pgEvent.page) {

      const searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Conditions: this.getSearchParams()
      }
      this.isLoading = true;
      this.picklistItemService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.picklistItemService.setCache(res.data, this.permission, this.objSearch, pgEvent);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.picklistItemService.CacheData.Data, this.picklistItemService.CacheData.TotalRecords);
    }
  }



  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords;
  }

  getSearchParams() {
    return [
      { DBName: 'Category', Value: this.objSearch.Category, DataType: DataType.Text, Operator: Operator.EqualTo }
    ];

  }

  onDetailsClick(obj: any): void {
    if (this.permission.CanUpdate) {
      this.router.navigate(['dashboard/picklistItems/edit', obj.Id]);
    }
    else {
      this.router.navigate(['dashboard/picklistItems/view', obj.Id]);
    }

  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/picklistItems/create']);
    }
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }
  }

  confirmDelete(item: IPicklistItem): void {
    this.confirmationService.confirm({
      header: 'Delete PickList item',
      message: `Delete '${item.ItemName}' from the '${item.Category}' category? This cannot be undone.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(item)
    });
  }

  private delete(item: IPicklistItem): void {
    this.deletingId = item.Id;
    this.picklistItemService.delete(item.Id).subscribe({
      next: () => {
        this.picklistItemService.CacheData.IsLoaded = false;
        this.loggedInUserService.refreshPicklistCache().subscribe({
          next: () => {
            this.messageService.showSuccess('PickList item deleted successfully.');
            this.loadCategoryOptions();
            this.searchData(this.pgEvent, true);
          },
          error: err => this.messageService.showError(err),
          complete: () => this.deletingId = null
        });
      },
      error: err => {
        this.messageService.showError(err);
        this.deletingId = null;
      }
    });
  }

  private loadCategoryOptions(): void {
    this.picklistItemService.getCategoryOptions().subscribe({
      next: options => this.categoryOptions = options,
      error: err => this.messageService.showError(err)
    });
  }
}




