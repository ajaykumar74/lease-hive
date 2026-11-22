import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ListEmptyState, ListFilterCondition, ListPageState, ListQueryParameters, ListSortOption } from '@/shared/list-page.models';
import { PageEvent } from '@/shared/IBase';
import { RFQSupplierService } from './rFQSupplier.service';
import { IRFQSupplier } from './rFQSupplier';

interface RFQSupplierFilters {
  rfqSupplierId: string;
  rfqId: number | null;
  supplierPartyId: number | null;
  invitationStatus: string | null;
}

type RFQSupplierListState = ListPageState<RFQSupplierFilters>;

@Component({
  selector: 'app-rfq-supplier-list',
  standalone: false,
  templateUrl: './rFQSupplier-list.component.html'
})
export class RFQSupplierListComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private rFQSupplierService: RFQSupplierService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loggedInUserService: LoggedInUserService
  ) {}

  pgEvent: PageEvent = { first: 0, rows: 20, page: 0, pageCount: 0 };
  lstMain: IRFQSupplier[] = [];
  totalNoOfRecords = 0;
  isLoading = false;
  hasLoadError = false;
  permission = {} as IPermission;
  searchTerm = '';
  filterControlsVisible = false;
  filters: RFQSupplierFilters = this.createEmptyFilters();
  selectedSortKey = 'invitedOn-desc';
  invitationStatusOptions: ISelectItem[] = [];

  readonly sortOptions: ListSortOption[] = [
    { key: 'invitedOn-desc', label: 'Invited On — Newest first', field: 'InvitedOn', descending: true },
    { key: 'invitedOn-asc', label: 'Invited On — Oldest first', field: 'InvitedOn', descending: false },
    { key: 'rfqSupplierId-asc', label: 'RFQ Supplier ID — A to Z', field: 'RFQSupplierId', descending: false },
    { key: 'rfq-asc', label: 'RFQ — A to Z', field: 'RFQDisplayName', descending: false },
    { key: 'supplier-asc', label: 'Supplier — A to Z', field: 'SupplierPartyDisplayName', descending: false },
    { key: 'status-asc', label: 'Invitation Status — A to Z', field: 'InvitationStatusCode', descending: false },
    { key: 'respondedOn-desc', label: 'Responded On — Newest first', field: 'RespondedOn', descending: true }
  ];

  private searchSubscription?: Subscription;
  private lastRequestSignature = '';

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    this.invitationStatusOptions = this.loggedInUserService.getPicklistOptions('RFQSupplierInvitationStatusCode');
    this.restoreListState();
    const rfqId = Number(this.activatedRoute.snapshot.queryParamMap.get('rfqId'));
    if (rfqId > 0) this.filters.rfqId = rfqId;
  }

  ngAfterViewInit(): void {
    if (this.canReuseCachedResult()) {
      this.permission = this.rFQSupplierService.CacheData.permission;
      this.setListData(this.rFQSupplierService.CacheData.Data, this.rFQSupplierService.CacheData.TotalRecords);
      return;
    }
    this.searchData(this.pgEvent, true, true);
  }

  ngOnDestroy(): void { this.searchSubscription?.unsubscribe(); }

  get activeFilterCount(): number {
    return [this.filters.rfqSupplierId, this.filters.rfqId, this.filters.supplierPartyId, this.filters.invitationStatus]
      .filter(value => value !== null && value !== '').length;
  }

  get hasActiveFilters(): boolean { return this.activeFilterCount > 0; }

  get emptyState(): ListEmptyState | null {
    if (this.isLoading || this.hasLoadError || this.totalNoOfRecords !== 0) return null;
    return this.searchTerm.trim() || this.hasActiveFilters
      ? { icon: 'pi pi-search', title: 'No Matching RFQ Suppliers', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
      : { icon: 'pi pi-inbox', title: 'No RFQ Suppliers Yet', description: 'Create an RFQ supplier invitation to begin collecting responses.', actionLabel: 'Create RFQ Supplier' };
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

  pageChanged(event: Partial<PageEvent>): void {
    this.pgEvent = {
      first: event.first ?? 0,
      rows: event.rows ?? this.pgEvent.rows,
      page: event.page ?? 0,
      pageCount: event.pageCount ?? this.pgEvent.pageCount
    };
    this.searchData(this.pgEvent, true, true);
  }

  searchData(pageEvent: PageEvent, isReload: boolean, forceReload = false): void {
    this.pgEvent = {
      first: pageEvent.first ?? 0,
      rows: pageEvent.rows ?? 20,
      page: pageEvent.page ?? 0,
      pageCount: pageEvent.pageCount ?? 0
    };
    if (!isReload && this.canReuseCachedResult()) {
      this.permission = this.rFQSupplierService.CacheData.permission;
      this.setListData(this.rFQSupplierService.CacheData.Data, this.rFQSupplierService.CacheData.TotalRecords);
      return;
    }

    const sort = this.getSafeSortOption();
    const searchParam: ListQueryParameters = {
      Skip: this.pgEvent.first,
      Take: this.pgEvent.rows,
      SortBy: sort.field,
      IsDescending: sort.descending,
      Conditions: this.getSearchParams()
    };
    const requestSignature = JSON.stringify(searchParam);
    if (!forceReload && requestSignature === this.lastRequestSignature && !this.hasLoadError) {
      this.persistState();
      return;
    }

    this.searchSubscription?.unsubscribe();
    this.lastRequestSignature = requestSignature;
    this.isLoading = true;
    this.hasLoadError = false;
    this.searchSubscription = this.rFQSupplierService.search(searchParam).subscribe({
      next: response => {
        this.permission = response.permission;
        this.setListData(response.data.Records, response.data.TotalRecords);
        this.rFQSupplierService.setCache(response.data, this.permission, this.captureListState());
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

    const searchTerm = this.searchTerm.trim();
    if (searchTerm) {
      ['RFQSupplierId', 'RFQDisplayName', 'SupplierPartyDisplayName', 'SupplierServiceAreaDisplayName', 'SupplierContactDisplayName']
        .forEach(DBName => conditions.push({ DBName, Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'RFQSupplierSearch' }));
    }
    addContains('RFQSupplierId', this.filters.rfqSupplierId);
    addIdFilter('RFQId', this.filters.rfqId);
    addIdFilter('SupplierPartyId', this.filters.supplierPartyId);
    if (this.filters.invitationStatus) {
      conditions.push({ DBName: 'InvitationStatusCode', Value: this.filters.invitationStatus, DataType: DataType.Text, Operator: Operator.EqualTo });
    }
    return conditions;
  }

  onViewClick(obj: IRFQSupplier): void { this.router.navigate(['/business/procurement/rfqs/suppliers/view', obj.Id]); }
  onEditClick(obj: IRFQSupplier): void { if (this.permission.CanUpdate) this.router.navigate(['/business/procurement/rfqs/suppliers/edit', obj.Id]); }

  private createEmptyFilters(): RFQSupplierFilters {
    return { rfqSupplierId: '', rfqId: null, supplierPartyId: null, invitationStatus: null };
  }

  private resetToFirstPage(): void { this.pgEvent = { ...this.pgEvent, first: 0, page: 0 }; }
  private setListData(data: IRFQSupplier[] | null | undefined, totalRecords: number): void { this.lstMain = data || []; this.totalNoOfRecords = totalRecords || 0; }
  private getSafeSortOption(): ListSortOption { return this.sortOptions.find(option => option.key === this.selectedSortKey) || this.sortOptions[0]; }

  private captureListState(): RFQSupplierListState {
    return {
      toolbar: { searchTerm: this.searchTerm, selectedSortKey: this.getSafeSortOption().key, filtersVisible: this.filterControlsVisible, activeFilterCount: this.activeFilterCount },
      filters: { ...this.filters },
      pagination: { ...this.pgEvent }
    };
  }

  private restoreListState(): void {
    const state = this.rFQSupplierService.CacheData.stateData as RFQSupplierListState | undefined;
    if (!state?.toolbar || !state.pagination) return;
    this.searchTerm = state.toolbar.searchTerm || '';
    this.selectedSortKey = this.sortOptions.some(option => option.key === state.toolbar.selectedSortKey) ? state.toolbar.selectedSortKey : this.sortOptions[0].key;
    this.filterControlsVisible = !!state.toolbar.filtersVisible;
    this.filters = { ...this.createEmptyFilters(), ...state.filters };
    this.pgEvent = { first: state.pagination.first ?? 0, rows: state.pagination.rows ?? 20, page: state.pagination.page ?? 0, pageCount: state.pagination.pageCount ?? 0 };
  }

  private canReuseCachedResult(): boolean {
    const state = this.rFQSupplierService.CacheData.stateData as RFQSupplierListState | undefined;
    return !!this.rFQSupplierService.CacheData.IsLoaded && !!state?.toolbar && !!state?.pagination;
  }

  private persistState(): void { this.rFQSupplierService.CacheData.stateData = this.captureListState(); }

  onOptionItemClicked(key: string): void {
    if (key === 'Create') this.router.navigate(['/business/procurement/rfqs/suppliers/create']);
    else if (key === 'Refresh') this.searchData(this.pgEvent, true, true);
  }
}
