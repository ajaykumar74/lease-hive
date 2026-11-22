import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { ListFilterCondition, ListQueryParameters, ListSortOption } from '@/shared/list-page.models';
import { PageEvent } from '@/shared/IBase';
import { SupplierAwardService } from './supplierAward.service';
import { ISupplierAward } from './supplierAward';

@Component({ selector: 'app-supplier-award-list', standalone: false, templateUrl: './supplierAward-list.component.html' })
export class SupplierAwardListComponent implements OnInit, AfterViewInit, OnDestroy {
  pgEvent: PageEvent = { first: 0, rows: 20, page: 0, pageCount: 0 };
  lstMain: ISupplierAward[] = []; totalNoOfRecords = 0; isLoading = false; hasLoadError = false;
  permission = {} as IPermission; searchTerm = ''; selectedSortKey = 'awardDate-desc';
  readonly sortOptions: ListSortOption[] = [
    { key: 'awardDate-desc', label: 'Award Date — Newest first', field: 'AwardDateTime', descending: true },
    { key: 'awardDate-asc', label: 'Award Date — Oldest first', field: 'AwardDateTime', descending: false },
    { key: 'award-asc', label: 'Award ID — A to Z', field: 'SupplierAwardId', descending: false },
    { key: 'supplier-asc', label: 'Supplier — A to Z', field: 'SupplierPartyDisplayName', descending: false },
    { key: 'amount-desc', label: 'Award Amount — High to low', field: 'AwardAmount', descending: true }
  ];
  private subscription?: Subscription;
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;
  constructor(private supplierAwardService: SupplierAwardService, private router: Router, private loggedInUserService: LoggedInUserService) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void { this.searchData(this.pgEvent, true); }
  ngOnDestroy(): void { this.subscription?.unsubscribe(); }
  onSearch(): void { this.pgEvent = { ...this.pgEvent, first: 0, page: 0 }; this.searchData(this.pgEvent, true); }
  clearSearch(): void { this.searchTerm = ''; this.onSearch(); }
  onSortChanged(): void { this.onSearch(); }
  pageChanged(event: Partial<PageEvent>): void { this.pgEvent = { first: event.first ?? 0, rows: event.rows ?? 20, page: event.page ?? 0, pageCount: event.pageCount ?? 0 }; this.searchData(this.pgEvent, true); }
  searchData(event: PageEvent, force: boolean): void {
    const sort = this.sortOptions.find(x => x.key === this.selectedSortKey) || this.sortOptions[0];
    const query: ListQueryParameters = { Skip: event.first, Take: event.rows, SortBy: sort.field, IsDescending: sort.descending, Conditions: this.getSearchParams() };
    this.subscription?.unsubscribe(); this.isLoading = true; this.hasLoadError = false;
    this.subscription = this.supplierAwardService.search(query).subscribe({ next: response => { this.permission = response.permission; this.lstMain = response.data.Records || []; this.totalNoOfRecords = response.data.TotalRecords || 0; this.supplierAwardService.setCache(response.data, this.permission, { pagination: this.pgEvent }); }, error: error => { this.lstMain = []; this.totalNoOfRecords = 0; this.hasLoadError = true; this.messageService.showError(error); this.isLoading = false; }, complete: () => this.isLoading = false });
  }
  getSearchParams(): ListFilterCondition[] {
    const term = this.searchTerm.trim(); if (!term) return [];
    return ['SupplierAwardId', 'RFQDisplayName', 'SupplierQuotationDisplayName', 'SupplierPartyDisplayName', 'AwardedByDisplayName'].map(DBName => ({ DBName, Value: term, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'AwardSearch' }));
  }
  onViewClick(obj: ISupplierAward): void { this.router.navigate(['/business/procurement/awards/view', obj.Id]); }
  onEditClick(obj: ISupplierAward): void { if (this.permission.CanUpdate) this.router.navigate(['/business/procurement/awards/edit', obj.Id]); }
  createPurchaseOrder(obj: ISupplierAward): void { this.router.navigate(['/business/procurement/purchase-orders/create'], { queryParams: { supplierAwardId: obj.Id } }); }
  formatAmount(obj: ISupplierAward): string { return new Intl.NumberFormat('en-US', { style: 'currency', currency: obj.CurrencyCode || 'INR', minimumFractionDigits: 2 }).format(obj.AwardAmount || 0); }
  onOptionItemClicked(key: string): void { if (key === 'Create') this.router.navigate(['/business/procurement/awards/create']); else if (key === 'Refresh') this.searchData(this.pgEvent, true); }
}
