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
import { IPurchaseRequisition } from './purchaseRequisition';
import { PurchaseRequisitionService } from './purchaseRequisition.service';

interface PurchaseRequisitionFilters {
  prNo: string;
  requestedBy: string;
  buyingOrganisation: string;
  source: string;
  requisitionStatusId: string | null;
  approvalStatus: string | null;
}

type PurchaseRequisitionListState = ListPageState<PurchaseRequisitionFilters>;

@Component({
  selector: 'app-purchase-requisition-list',
  standalone: false,
  templateUrl: './purchaseRequisition-list.component.html'
})
export class PurchaseRequisitionListComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private purchaseRequisitionService: PurchaseRequisitionService,
    private router: Router,
    private loggedInUserService: LoggedInUserService
  ) {}

  pgEvent: PageEvent = { first: 0, rows: 20, page: 0, pageCount: 0 } as PageEvent;
  lstMain: IPurchaseRequisition[] = [];
  totalNoOfRecords = 0;
  isLoading = false;
  hasLoadError = false;
  permission = {} as IPermission;
  searchTerm = '';
  filterControlsVisible = false;
  filters: PurchaseRequisitionFilters = this.createEmptyFilters();
  selectedSortKey = 'requisitionDate-desc';
  requisitionStatusOptions: ISelectItem[] = [];

  readonly sortOptions: ListSortOption[] = [
    { key: 'requisitionDate-desc', label: 'Requisition Date — Newest first', field: 'RequisitionDate', descending: true },
    { key: 'requisitionDate-asc', label: 'Requisition Date — Oldest first', field: 'RequisitionDate', descending: false },
    { key: 'prNo-asc', label: 'PR No. — A to Z', field: 'PRNo', descending: false },
    { key: 'prNo-desc', label: 'PR No. — Z to A', field: 'PRNo', descending: true },
    { key: 'requiredBy-asc', label: 'Required By — Earliest first', field: 'RequiredByDate', descending: false },
    { key: 'amount-desc', label: 'Estimated Amount — High to low', field: 'EstimatedTotal', descending: true },
    { key: 'amount-asc', label: 'Estimated Amount — Low to high', field: 'EstimatedTotal', descending: false },
    { key: 'status-asc', label: 'PR Status — A to Z', field: 'PurchaseRequisitionStatusName', descending: false }
  ];

  readonly approvalStatusOptions = [
    { label: 'Not submitted', value: 'NOT_SUBMITTED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Returned', value: 'RETURNED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  private searchSubscription?: Subscription;
  private lookupSubscription?: Subscription;
  private lastRequestSignature = '';

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    this.restoreListState();
    this.lookupSubscription = this.loggedInUserService.getEntityLookupOptions('purchase-requisition-statuses').subscribe({
      next: options => this.requisitionStatusOptions = options,
      error: () => this.requisitionStatusOptions = []
    });
  }

  ngAfterViewInit(): void {
    if (this.canReuseCachedResult()) {
      this.permission = this.purchaseRequisitionService.CacheData.permission;
      this.setListData(this.purchaseRequisitionService.CacheData.Data, this.purchaseRequisitionService.CacheData.TotalRecords);
      return;
    }
    this.searchData(this.pgEvent, true, true);
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.lookupSubscription?.unsubscribe();
  }

  get activeFilterCount(): number {
    return [this.filters.prNo, this.filters.requestedBy, this.filters.buyingOrganisation, this.filters.source, this.filters.requisitionStatusId, this.filters.approvalStatus].filter(value => !!value).length;
  }

  get hasActiveFilters(): boolean {
    return this.activeFilterCount > 0;
  }

  get emptyState(): ListEmptyState | null {
    if (this.isLoading || this.hasLoadError || this.totalNoOfRecords !== 0) return null;
    return this.searchTerm.trim() || this.hasActiveFilters
      ? { icon: 'pi pi-search', title: 'No Matching Purchase Requisitions', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
      : { icon: 'pi pi-inbox', title: 'No Purchase Requisitions Yet', description: 'Create a purchase requisition to start your procurement workflow.', actionLabel: 'Create Purchase Requisition' };
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
      this.permission = this.purchaseRequisitionService.CacheData.permission;
      this.setListData(this.purchaseRequisitionService.CacheData.Data, this.purchaseRequisitionService.CacheData.TotalRecords);
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
    this.searchSubscription = this.purchaseRequisitionService.search(searchParam).subscribe({
      next: response => {
        this.permission = response.permission;
        this.setListData(response.data.Records, response.data.TotalRecords);
        this.purchaseRequisitionService.setCache(response.data, this.permission, this.captureListState());
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
    const addContains = (DBName: string, value: string | null | undefined): void => {
      const trimmed = value?.trim();
      if (trimmed) conditions.push({ DBName, Value: trimmed, DataType: DataType.Text, Operator: Operator.Contains });
    };
    const tenantId = this.loggedInUserService.loggedInUser?.Tenant?.Id;
    if (tenantId) conditions.push({ DBName: 'TenantId', Value: String(tenantId), DataType: DataType.Int, Operator: Operator.EqualTo });

    const searchTerm = this.searchTerm.trim();
    if (searchTerm) {
      const searchFields = 'PRNo;RequestedByName;BuyingOrganisationName';
      conditions.push({ DBName: searchFields, Value: `${searchTerm};${searchTerm};${searchTerm}`, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR });
    }
    addContains('PRNo', this.filters.prNo);
    addContains('RequestedByName', this.filters.requestedBy);
    addContains('BuyingOrganisationName', this.filters.buyingOrganisation);
    addContains('SourceReferenceType', this.filters.source);
    if (this.filters.requisitionStatusId) conditions.push({ DBName: 'PurchaseRequisitionStatusId', Value: this.filters.requisitionStatusId, DataType: DataType.Int, Operator: Operator.EqualTo });
    if (this.filters.approvalStatus) conditions.push({ DBName: 'ApprovalStatus', Value: this.filters.approvalStatus, DataType: DataType.Text, Operator: Operator.EqualTo });
    return conditions;
  }

  onViewClick(obj: IPurchaseRequisition): void { this.router.navigate(['/business/procurement/requisitions/view', obj.Id]); }
  onEditClick(obj: IPurchaseRequisition): void { if (this.permission.CanUpdate) this.router.navigate(['/business/procurement/requisitions/edit', obj.Id]); }
  getApprovalStatusLabel(status: string | null | undefined): string { return status === 'NOT_SUBMITTED' ? 'Not submitted' : status || 'Not submitted'; }

  private createEmptyFilters(): PurchaseRequisitionFilters {
    return { prNo: '', requestedBy: '', buyingOrganisation: '', source: '', requisitionStatusId: null, approvalStatus: null };
  }

  private resetToFirstPage(): void { this.pgEvent = { ...this.pgEvent, first: 0, page: 0 }; }
  private setListData(data: IPurchaseRequisition[] | null | undefined, totalRecords: number): void { this.lstMain = data || []; this.totalNoOfRecords = totalRecords || 0; }
  private getSafeSortOption(): ListSortOption { return this.sortOptions.find(option => option.key === this.selectedSortKey) || this.sortOptions[0]; }

  private captureListState(): PurchaseRequisitionListState {
    return {
      toolbar: { searchTerm: this.searchTerm, selectedSortKey: this.getSafeSortOption().key, filtersVisible: this.filterControlsVisible, activeFilterCount: this.activeFilterCount },
      filters: { ...this.filters },
      pagination: { ...this.pgEvent }
    };
  }

  private restoreListState(): void {
    const state = this.purchaseRequisitionService.CacheData.stateData as PurchaseRequisitionListState | undefined;
    if (!state?.toolbar || !state.pagination) return;
    this.searchTerm = state.toolbar.searchTerm || '';
    this.selectedSortKey = this.sortOptions.some(option => option.key === state.toolbar.selectedSortKey) ? state.toolbar.selectedSortKey : this.sortOptions[0].key;
    this.filterControlsVisible = !!state.toolbar.filtersVisible;
    this.filters = { ...this.createEmptyFilters(), ...state.filters };
    this.pgEvent = { first: state.pagination.first ?? 0, rows: state.pagination.rows ?? 20, page: state.pagination.page ?? 0, pageCount: state.pagination.pageCount ?? 0 };
  }

  private canReuseCachedResult(): boolean {
    const state = this.purchaseRequisitionService.CacheData.stateData as PurchaseRequisitionListState | undefined;
    return !!this.purchaseRequisitionService.CacheData.IsLoaded && !!state?.toolbar && !!state?.pagination;
  }

  private persistState(): void { this.purchaseRequisitionService.CacheData.stateData = this.captureListState(); }

  onOptionItemClicked(key: string): void {
    if (key === 'Create') this.router.navigate(['/business/procurement/requisitions/create']);
    else if (key === 'Refresh') this.searchData(this.pgEvent, true, true);
  }
}
