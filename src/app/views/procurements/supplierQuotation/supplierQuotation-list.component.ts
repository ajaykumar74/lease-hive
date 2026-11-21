import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';

import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ListEmptyState, ListFilterCondition, ListPageState, ListQueryParameters, ListSortOption } from '@/shared/list-page.models';
import { PageEvent } from '@/shared/IBase';
import { SupplierQuotationService } from './supplierQuotation.service';
import { ISupplierQuotation } from './supplierQuotation';

interface SupplierQuotationFilters {
  supplierQuotationId: string;
  supplierQuoteNo: string;
  rfqId: number | null;
  supplierPartyId: number | null;
  quotationStatus: string | null;
  recordStatus: string | null;
}

type SupplierQuotationListState = ListPageState<SupplierQuotationFilters>;

@Component({
  selector: 'app-supplier-quotation-list',
  standalone: false,
  templateUrl: './supplierQuotation-list.component.html'
})
export class SupplierQuotationListComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private supplierQuotationService: SupplierQuotationService,
    private router: Router,
    private loggedInUserService: LoggedInUserService
  ) {}

  pgEvent: PageEvent = { first: 0, rows: 20, page: 0, pageCount: 0 } as PageEvent;
  lstMain: ISupplierQuotation[] = [];
  totalNoOfRecords = 0;
  isLoading = false;
  hasLoadError = false;
  permission = {} as IPermission;
  searchTerm = '';
  filterControlsVisible = false;
  filters: SupplierQuotationFilters = this.createEmptyFilters();
  selectedSortKey = 'quoteDate-desc';
  quotationStatusOptions: ISelectItem[] = [];
  recordStatusOptions: ISelectItem[] = [];

  readonly sortOptions: ListSortOption[] = [
    { key: 'quoteDate-desc', label: 'Quote Date — Newest first', field: 'QuoteDate', descending: true },
    { key: 'quoteDate-asc', label: 'Quote Date — Oldest first', field: 'QuoteDate', descending: false },
    { key: 'quoteNo-asc', label: 'Supplier Quote No. — A to Z', field: 'SupplierQuoteNo', descending: false },
    { key: 'quoteNo-desc', label: 'Supplier Quote No. — Z to A', field: 'SupplierQuoteNo', descending: true },
    { key: 'validUntil-asc', label: 'Valid Until — Earliest first', field: 'ValidUntil', descending: false },
    { key: 'amount-desc', label: 'Total Amount — High to low', field: 'TotalAmount', descending: true },
    { key: 'amount-asc', label: 'Total Amount — Low to high', field: 'TotalAmount', descending: false },
    { key: 'status-asc', label: 'Quotation Status — A to Z', field: 'QuotationStatusCode', descending: false }
  ];

  private searchSubscription?: Subscription;
  private lastRequestSignature = '';

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    this.quotationStatusOptions = this.loggedInUserService.getPicklistOptions('SupplierQuotationQuotationStatusCode');
    this.recordStatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');
    this.restoreListState();
  }

  ngAfterViewInit(): void {
    if (this.canReuseCachedResult()) {
      this.permission = this.supplierQuotationService.CacheData.permission;
      this.setListData(this.supplierQuotationService.CacheData.Data, this.supplierQuotationService.CacheData.TotalRecords);
      return;
    }
    this.searchData(this.pgEvent, true, true);
  }

  ngOnDestroy(): void { this.searchSubscription?.unsubscribe(); }

  get activeFilterCount(): number {
    return [this.filters.supplierQuotationId, this.filters.supplierQuoteNo, this.filters.rfqId, this.filters.supplierPartyId, this.filters.quotationStatus, this.filters.recordStatus].filter(value => value !== null && value !== '').length;
  }

  get hasActiveFilters(): boolean { return this.activeFilterCount > 0; }

  get emptyState(): ListEmptyState | null {
    if (this.isLoading || this.hasLoadError || this.totalNoOfRecords !== 0) return null;
    return this.searchTerm.trim() || this.hasActiveFilters
      ? { icon: 'pi pi-search', title: 'No Matching Supplier Quotations', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
      : { icon: 'pi pi-inbox', title: 'No Supplier Quotations Yet', description: 'Create a supplier quotation to record and compare supplier pricing.', actionLabel: 'Create Supplier Quotation' };
  }

  onSearch(): void { this.resetToFirstPage(); this.searchData(this.pgEvent, true, true); }

  clearSearch(): void {
    if (!this.searchTerm) return;
    this.searchTerm = '';
    this.onSearch();
  }

  clearFilters(): void {
    if (!this.hasActiveFilters) return;
    this.filters = this.createEmptyFilters();
    this.resetToFirstPage();
    this.searchData(this.pgEvent, true, true);
  }

  clearSearchAndFilters(): void {
    this.searchTerm = '';
    this.filters = this.createEmptyFilters();
    this.resetToFirstPage();
    this.searchData(this.pgEvent, true, true);
  }

  toggleFilterControls(): void { this.filterControlsVisible = !this.filterControlsVisible; this.persistState(); }
  onFiltersChanged(): void { this.resetToFirstPage(); this.searchData(this.pgEvent, true, true); }
  onSortChanged(): void { this.selectedSortKey = this.getSafeSortOption().key; this.resetToFirstPage(); this.searchData(this.pgEvent, true, true); }

  pageChanged(event: PaginatorState): void {
    this.pgEvent = { ...this.pgEvent, first: event.first ?? 0, rows: event.rows ?? this.pgEvent.rows, page: event.page ?? 0, pageCount: event.pageCount ?? this.pgEvent.pageCount };
    this.searchData(this.pgEvent, true, true);
  }

  searchData(pageEvent: PageEvent, isReload: boolean, forceReload = false): void {
    this.pgEvent = { first: pageEvent.first ?? 0, rows: pageEvent.rows ?? 20, page: pageEvent.page ?? 0, pageCount: pageEvent.pageCount ?? 0 };
    if (!isReload && this.canReuseCachedResult()) {
      this.permission = this.supplierQuotationService.CacheData.permission;
      this.setListData(this.supplierQuotationService.CacheData.Data, this.supplierQuotationService.CacheData.TotalRecords);
      return;
    }

    const sort = this.getSafeSortOption();
    const searchParam: ListQueryParameters = { Skip: this.pgEvent.first, Take: this.pgEvent.rows, SortBy: sort.field, IsDescending: sort.descending, Conditions: this.getSearchParams() };
    const signature = JSON.stringify(searchParam);
    if (!forceReload && signature === this.lastRequestSignature && !this.hasLoadError) { this.persistState(); return; }

    this.searchSubscription?.unsubscribe();
    this.lastRequestSignature = signature;
    this.isLoading = true;
    this.hasLoadError = false;
    this.searchSubscription = this.supplierQuotationService.search(searchParam).subscribe({
      next: response => {
        this.permission = response.permission;
        this.setListData(response.data.Records, response.data.TotalRecords);
        this.supplierQuotationService.setCache(response.data, this.permission, this.captureListState());
      },
      error: error => {
        this.lstMain = [];
        this.totalNoOfRecords = 0;
        this.hasLoadError = true;
        this.messageService.showError(error);
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  getSearchParams(): ListFilterCondition[] {
    const conditions: ListFilterCondition[] = [];
    const addContains = (DBName: string, value: string): void => {
      const trimmed = value?.trim();
      if (trimmed) conditions.push({ DBName, Value: trimmed, DataType: DataType.Text, Operator: Operator.Contains });
    };
    const addIdFilter = (DBName: string, value: number | null): void => {
      if (value && value > 0) conditions.push({ DBName, Value: String(value), DataType: DataType.Int, Operator: Operator.EqualTo });
    };
    const tenantId = this.loggedInUserService.loggedInUser?.Tenant?.Id;
    if (tenantId) conditions.push({ DBName: 'TenantId', Value: String(tenantId), DataType: DataType.Int, Operator: Operator.EqualTo });

    const searchTerm = this.searchTerm.trim();
    if (searchTerm) {
      conditions.push({ DBName: 'SupplierQuotationId;SupplierQuoteNo', Value: `${searchTerm};${searchTerm}`, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR });
    }
    addContains('SupplierQuotationId', this.filters.supplierQuotationId);
    addContains('SupplierQuoteNo', this.filters.supplierQuoteNo);
    addIdFilter('RFQId', this.filters.rfqId);
    addIdFilter('SupplierPartyId', this.filters.supplierPartyId);
    if (this.filters.quotationStatus) conditions.push({ DBName: 'QuotationStatusCode', Value: this.filters.quotationStatus, DataType: DataType.Text, Operator: Operator.EqualTo });
    if (this.filters.recordStatus) conditions.push({ DBName: 'RecordStatus', Value: this.filters.recordStatus, DataType: DataType.Text, Operator: Operator.EqualTo });
    return conditions;
  }

  onViewClick(obj: ISupplierQuotation): void { this.router.navigate(['/business/procurement/supplier-quotations/view', obj.Id]); }
  onEditClick(obj: ISupplierQuotation): void { if (this.permission.CanUpdate && this.isEditable(obj)) this.router.navigate(['/business/procurement/supplier-quotations/edit', obj.Id]); }
  isEditable(obj: ISupplierQuotation): boolean { return !/(inactive|deleted|closed)/.test((obj.RecordStatus || '').toLowerCase()); }

  formatAmount(obj: ISupplierQuotation): string {
    if (obj.TotalAmount === null || obj.TotalAmount === undefined) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: obj.CurrencyCode || 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(obj.TotalAmount);
  }

  private createEmptyFilters(): SupplierQuotationFilters {
    return { supplierQuotationId: '', supplierQuoteNo: '', rfqId: null, supplierPartyId: null, quotationStatus: null, recordStatus: null };
  }

  private resetToFirstPage(): void { this.pgEvent = { ...this.pgEvent, first: 0, page: 0 }; }
  private setListData(data: ISupplierQuotation[] | null | undefined, totalRecords: number): void { this.lstMain = data || []; this.totalNoOfRecords = totalRecords || 0; }
  private getSafeSortOption(): ListSortOption { return this.sortOptions.find(option => option.key === this.selectedSortKey) || this.sortOptions[0]; }

  private captureListState(): SupplierQuotationListState {
    return { toolbar: { searchTerm: this.searchTerm, selectedSortKey: this.getSafeSortOption().key, filtersVisible: this.filterControlsVisible, activeFilterCount: this.activeFilterCount }, filters: { ...this.filters }, pagination: { ...this.pgEvent } };
  }

  private restoreListState(): void {
    const state = this.supplierQuotationService.CacheData.stateData as SupplierQuotationListState | undefined;
    if (!state?.toolbar || !state.pagination) return;
    this.searchTerm = state.toolbar.searchTerm || '';
    this.selectedSortKey = this.sortOptions.some(option => option.key === state.toolbar.selectedSortKey) ? state.toolbar.selectedSortKey : this.sortOptions[0].key;
    this.filterControlsVisible = !!state.toolbar.filtersVisible;
    this.filters = { ...this.createEmptyFilters(), ...state.filters };
    this.pgEvent = { first: state.pagination.first ?? 0, rows: state.pagination.rows ?? 20, page: state.pagination.page ?? 0, pageCount: state.pagination.pageCount ?? 0 };
  }

  private canReuseCachedResult(): boolean {
    const state = this.supplierQuotationService.CacheData.stateData as SupplierQuotationListState | undefined;
    return !!this.supplierQuotationService.CacheData.IsLoaded && !!state?.toolbar && !!state?.pagination;
  }

  private persistState(): void { this.supplierQuotationService.CacheData.stateData = this.captureListState(); }

  onOptionItemClicked(key: string): void {
    if (key === 'Create') this.router.navigate(['/business/procurement/supplier-quotations/create']);
    else if (key === 'Refresh') this.searchData(this.pgEvent, true, true);
  }
}
