import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';

import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { ListEmptyState, ListFilterCondition, ListPageCachedState, ListQueryParameters, ListSortOption } from '@/shared/list-page.models';
import { PageEvent } from '@/shared/IBase';
import { ApprovalRequestService } from './approvalRequest.service';
import { IApprovalRequest } from './approvalRequest';

interface ApprovalRequestFilters {
  referenceType: string | null;
}

type ApprovalRequestListState = ListPageCachedState<ApprovalRequestFilters>;

@Component({
  selector: 'app-approval-request-list',
  standalone: false,
  templateUrl: './approvalRequest-list.component.html'
})
export class ApprovalRequestListComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private approvalRequestService: ApprovalRequestService,
    private router: Router,
    private loggedInUserService: LoggedInUserService
  ) {}

  pgEvent: PageEvent = { first: 0, rows: 20, page: 0, pageCount: 0 } as PageEvent;
  lstMain: IApprovalRequest[] = [];
  totalNoOfRecords = 0;
  isLoading = false;
  hasLoadError = false;
  permission = {} as IPermission;
  searchTerm = '';
  filterControlsVisible = false;
  filters: ApprovalRequestFilters = this.createEmptyFilters();
  selectedSortKey = 'requested-desc';

  readonly sortOptions: ListSortOption[] = [
    { key: 'requested-desc', label: 'Requested — Newest first', field: 'RequestedOn', descending: true },
    { key: 'requested-asc', label: 'Requested — Oldest first', field: 'RequestedOn', descending: false },
    { key: 'amount-desc', label: 'Amount — High to low', field: 'RequestedAmount', descending: true },
    { key: 'amount-asc', label: 'Amount — Low to high', field: 'RequestedAmount', descending: false },
    { key: 'document-asc', label: 'Document type — A to Z', field: 'ReferenceType', descending: false }
  ];

  readonly referenceTypeOptions = [
    { label: 'Purchase orders', value: 'PURCHASE_ORDER' },
    { label: 'Purchase requisitions', value: 'PURCHASE_REQUISITION' },
    { label: 'Supplier awards', value: 'SUPPLIER_AWARD' },
    { label: 'Supplier invoices', value: 'SUPPLIER_INVOICE' },
    { label: 'Goods receipts', value: 'GOODS_RECEIPT' }
  ];

  private searchSubscription?: Subscription;
  private lastRequestSignature = '';

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  get isHistoryView(): boolean {
    return this.router.url.includes('/procurement/approvals/history');
  }

  get pageTitle(): string {
    return this.isHistoryView ? 'Approval History' : 'My Pending Approvals';
  }

  get contextKey(): string {
    return this.isHistoryView ? 'approval-history' : 'pending-approvals';
  }

  get activeFilterCount(): number {
    return this.filters.referenceType ? 1 : 0;
  }

  get hasActiveFilters(): boolean {
    return this.activeFilterCount > 0;
  }

  get emptyState(): ListEmptyState | null {
    if (this.isLoading || this.hasLoadError || this.totalNoOfRecords !== 0) return null;
    if (this.searchTerm.trim() || this.hasActiveFilters) {
      return { icon: 'pi pi-search', title: 'No Matching Approval Requests', description: 'Try adjusting your search or document filter.', actionLabel: 'Clear Search & Filters' };
    }
    return this.isHistoryView
      ? { icon: 'pi pi-history', title: 'No Approval History', description: 'Completed approval decisions will appear here.' }
      : { icon: 'pi pi-check-circle', title: 'No Pending Approvals', description: 'Approval requests assigned to you will appear here.' };
  }

  ngOnInit(): void {
    this.restoreListState();
  }

  ngAfterViewInit(): void {
    if (this.canReuseCachedResult()) {
      this.permission = this.approvalRequestService.CacheData.permission;
      this.setListData(this.approvalRequestService.CacheData.Data, this.approvalRequestService.CacheData.TotalRecords);
      return;
    }
    this.searchData(this.pgEvent, true, true);
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearch(): void {
    this.resetToFirstPage();
    this.searchData(this.pgEvent, true, true);
  }

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

  toggleFilterControls(): void {
    this.filterControlsVisible = !this.filterControlsVisible;
    this.persistState();
  }

  onFiltersChanged(): void {
    this.resetToFirstPage();
    this.searchData(this.pgEvent, true, true);
  }

  onSortChanged(): void {
    this.selectedSortKey = this.getSafeSortOption().key;
    this.resetToFirstPage();
    this.searchData(this.pgEvent, true, true);
  }

  pageChanged(event: PaginatorState): void {
    this.pgEvent = {
      ...this.pgEvent,
      first: event.first ?? 0,
      rows: event.rows ?? this.pgEvent.rows,
      page: event.page ?? 0,
      pageCount: event.pageCount ?? this.pgEvent.pageCount
    };
    this.searchData(this.pgEvent, true, true);
  }

  searchData(pageEvent: PageEvent, isReload: boolean, forceReload = false): void {
    const sort = this.getSafeSortOption();
    const searchParam: ListQueryParameters = {
      Skip: pageEvent.first,
      Take: pageEvent.rows,
      SortBy: sort.field,
      IsDescending: sort.descending,
      Conditions: this.getSearchParams()
    };
    const signature = JSON.stringify(searchParam);
    if (!forceReload && !isReload && signature === this.lastRequestSignature && !this.hasLoadError) {
      this.persistState();
      return;
    }

    this.searchSubscription?.unsubscribe();
    this.lastRequestSignature = signature;
    this.isLoading = true;
    this.hasLoadError = false;
    this.searchSubscription = this.approvalRequestService.search(searchParam).subscribe({
      next: response => {
        this.permission = response.permission;
        this.setListData(response.data.Records, response.data.TotalRecords);
        this.approvalRequestService.setCache(response.data, this.permission, this.captureListState());
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
    const tenantId = this.loggedInUserService.loggedInUser?.Tenant?.Id;
    if (tenantId) {
      conditions.push({ DBName: 'TenantId', Value: String(tenantId), DataType: DataType.Int, Operator: Operator.EqualTo });
    }
    conditions.push({
      DBName: 'ApprovalStatus',
      Value: 'PENDING',
      DataType: DataType.Text,
      Operator: this.isHistoryView ? Operator.NotEqualTo : Operator.EqualTo
    });
    const searchTerm = this.searchTerm.trim();
    if (searchTerm) {
      conditions.push({ DBName: 'ApprovalRequestId', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains });
    }
    if (this.filters.referenceType) {
      conditions.push({ DBName: 'ReferenceType', Value: this.filters.referenceType, DataType: DataType.Text, Operator: Operator.EqualTo });
    }
    return conditions;
  }

  getReferenceTypeLabel(referenceType: string | null | undefined): string {
    return this.referenceTypeOptions.find(option => option.value === referenceType)?.label ||
      (referenceType || 'Unknown').replace(/[_-]+/g, ' ').toLowerCase().replace(/\b\w/g, character => character.toUpperCase());
  }

  getDocumentLabel(request: IApprovalRequest): string {
    return `${this.getReferenceTypeLabel(request.ReferenceType)} #${request.ReferenceId}`;
  }

  onReview(request: IApprovalRequest): void {
    if (request.ReferenceType === 'PURCHASE_REQUISITION') {
      this.router.navigate(['/business/procurement/requisitions/edit', request.ReferenceId]);
      return;
    }
    if (request.ReferenceType === 'PURCHASE_ORDER') {
      this.router.navigate(['/business/procurement/purchase-orders/edit', request.ReferenceId]);
      return;
    }
    this.router.navigate(['/business/procurement/approvals/pending/view', request.Id]);
  }

  private createEmptyFilters(): ApprovalRequestFilters {
    return { referenceType: null };
  }

  private resetToFirstPage(): void {
    this.pgEvent = { ...this.pgEvent, first: 0, page: 0 };
  }

  private setListData(data: IApprovalRequest[] | null | undefined, totalRecords: number): void {
    this.lstMain = data || [];
    this.totalNoOfRecords = totalRecords || 0;
  }

  private getSafeSortOption(): ListSortOption {
    return this.sortOptions.find(option => option.key === this.selectedSortKey) || this.sortOptions[0];
  }

  private captureListState(): ApprovalRequestListState {
    return {
      contextKey: this.contextKey,
      toolbar: { searchTerm: this.searchTerm, selectedSortKey: this.getSafeSortOption().key, filtersVisible: this.filterControlsVisible, activeFilterCount: this.activeFilterCount },
      filters: { ...this.filters },
      pagination: { ...this.pgEvent }
    };
  }

  private restoreListState(): void {
    const state = this.approvalRequestService.CacheData.stateData as ApprovalRequestListState | undefined;
    if (!state || state.contextKey !== this.contextKey) return;
    this.searchTerm = state.toolbar.searchTerm || '';
    this.selectedSortKey = this.sortOptions.some(option => option.key === state.toolbar.selectedSortKey) ? state.toolbar.selectedSortKey : this.sortOptions[0].key;
    this.filterControlsVisible = !!state.toolbar.filtersVisible;
    this.filters = { ...this.createEmptyFilters(), ...state.filters };
    this.pgEvent = { first: state.pagination.first ?? 0, rows: state.pagination.rows ?? 20, page: state.pagination.page ?? 0, pageCount: state.pagination.pageCount ?? 0 };
  }

  private canReuseCachedResult(): boolean {
    const state = this.approvalRequestService.CacheData.stateData as ApprovalRequestListState | undefined;
    return !!this.approvalRequestService.CacheData.IsLoaded && state?.contextKey === this.contextKey;
  }

  private persistState(): void {
    this.approvalRequestService.CacheData.stateData = this.captureListState();
  }

  onOptionItemClicked(key: string): void {
    if (key === 'Refresh') this.searchData(this.pgEvent, true, true);
  }
}
