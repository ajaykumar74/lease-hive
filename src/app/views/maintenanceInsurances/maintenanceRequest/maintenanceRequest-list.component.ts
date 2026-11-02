import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 
import { Subscription } from 'rxjs';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ListEmptyState, ListFilterCondition, ListPageState, ListQueryParameters, ListSortOption } from '@/shared/list-page.models';
import { MaintenanceRequestService } from './maintenanceRequest.service';
import { IMaintenanceRequest } from './maintenanceRequest';
import { PageEvent } from '@/shared/IBase';

interface MaintenanceRequestFilters {
  requestNumber: string;
  asset: string;
  requestedAtRange: Date[] | null;
  priority: string | null;
  status: string | null;
  location: string;
}

type MaintenanceRequestListState = ListPageState<MaintenanceRequestFilters>;

@Component({
  selector: 'app-maintenance-request-list',
  standalone: false,
  templateUrl: './maintenanceRequest-list.component.html'
})
export class MaintenanceRequestListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private maintenanceRequestService: MaintenanceRequestService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) {}

  pgEvent: PageEvent = { first: 0, rows: 20, page: 0, pageCount: 0 };
  lstMain: IMaintenanceRequest[] = [];
  totalNoOfRecords = 0;
  isLoading = false;
  hasLoadError = false;
  permission = {} as IPermission;
  searchTerm = '';
  filterControlsVisible = false;
  filters: MaintenanceRequestFilters = this.createEmptyFilters();
  selectedSortKey = 'requestedAt-desc';

  readonly sortOptions: ListSortOption[] = [
    { key: 'requestedAt-desc', label: 'Requested At — Newest First', field: 'RequestedAt', descending: true },
    { key: 'requestedAt-asc', label: 'Requested At — Oldest First', field: 'RequestedAt', descending: false },
    { key: 'priority-desc', label: 'Priority — High to Low', field: 'PriorityCode', descending: true },
    { key: 'priority-asc', label: 'Priority — Low to High', field: 'PriorityCode', descending: false },
    { key: 'requestNumber-asc', label: 'Request Number — Ascending', field: 'MaintenanceRequestNo', descending: false },
    { key: 'requestNumber-desc', label: 'Request Number — Descending', field: 'MaintenanceRequestNo', descending: true },
    { key: 'asset-asc', label: 'Asset — A to Z', field: 'AssetDisplayName', descending: false }
  ];

  priorityOptions: ISelectItem[] = [];
  statusOptions: ISelectItem[] = [
    { Text: 'Open', Value: 'OPEN' },
    { Text: 'Triaged', Value: 'TRIAGED' },
    { Text: 'Approved', Value: 'APPROVED' },
    { Text: 'Rejected', Value: 'REJECTED' },
    { Text: 'Converted', Value: 'CONVERTED' },
    { Text: 'Cancelled', Value: 'CANCELLED' }
  ];

  private searchSubscription?: Subscription;
  private lastRequestSignature = '';

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    this.priorityOptions = this.loggedInUserService.getPicklistOptions('PriorityCode');
    const configuredStatusOptions = this.loggedInUserService.getPicklistOptions('MaintenanceRequestStatusCode');
    if (configuredStatusOptions.length) this.statusOptions = configuredStatusOptions;
    this.restoreListState();
  }

  ngAfterViewInit(): void {
    if (this.canReuseCachedResult()) {
      this.permission = this.maintenanceRequestService.CacheData.permission;
      this.setListData(this.maintenanceRequestService.CacheData.Data, this.maintenanceRequestService.CacheData.TotalRecords);
      return;
    }

    this.searchData(this.pgEvent, true);
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  get activeFilterCount(): number {
    return [
      this.filters.requestNumber,
      this.filters.asset,
      this.filters.requestedAtRange?.some(Boolean) ? 1 : 0,
      this.filters.priority,
      this.filters.status,
      this.filters.location
    ].filter(value => !!value).length;
  }

  get hasActiveFilters(): boolean {
    return this.activeFilterCount > 0;
  }

  get emptyState(): ListEmptyState | null {
    if (this.isLoading || this.hasLoadError || this.totalNoOfRecords !== 0) return null;

    return this.searchTerm.trim() || this.hasActiveFilters
      ? { icon: 'pi pi-search', title: 'No Matching Requests', description: 'Try changing your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
      : { icon: 'pi pi-inbox', title: 'No Maintenance Requests Yet', description: 'Maintenance requests will appear here once they are created.', actionLabel: 'Create Maintenance Request' };
  }

  onSearch(): void {
    this.resetToFirstPage();
    this.searchData(this.pgEvent, true);
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
    this.searchData(this.pgEvent, true);
  }

  clearSearchAndFilters(): void {
    this.searchTerm = '';
    this.filters = this.createEmptyFilters();
    this.resetToFirstPage();
    this.searchData(this.pgEvent, true);
  }

  toggleFilterControls(): void {
    this.filterControlsVisible = !this.filterControlsVisible;
    this.persistState();
  }

  onFiltersChanged(): void {
    this.resetToFirstPage();
    this.searchData(this.pgEvent, true);
  }

  onSortChanged(): void {
    this.selectedSortKey = this.getSafeSortOption().key;
    this.resetToFirstPage();
    this.searchData(this.pgEvent, true);
  }

  pageChanged(event: Partial<PageEvent>): void {
    this.pgEvent = {
      first: event.first ?? 0,
      rows: event.rows ?? 20,
      page: event.page ?? 0,
      pageCount: event.pageCount ?? 0
    };
    this.searchData(this.pgEvent, true);
  }

  searchData(pgEvent: PageEvent, isReload: boolean, forceReload = false): void {
    this.pgEvent = {
      first: pgEvent.first ?? 0,
      rows: pgEvent.rows ?? 20,
      page: pgEvent.page ?? 0,
      pageCount: pgEvent.pageCount ?? 0
    };

    if (!isReload && this.canReuseCachedResult()) {
      this.permission = this.maintenanceRequestService.CacheData.permission;
      this.setListData(this.maintenanceRequestService.CacheData.Data, this.maintenanceRequestService.CacheData.TotalRecords);
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
    this.searchSubscription = this.maintenanceRequestService.search(searchParam).subscribe({
      next: res => {
        this.permission = res.permission;
        this.setListData(res.data.Records, res.data.TotalRecords);
        this.maintenanceRequestService.setCache(res.data, this.permission, this.captureListState());
      },
      error: err => {
        this.lstMain = [];
        this.totalNoOfRecords = 0;
        this.hasLoadError = true;
        this.messageService.showError(err);
        this.isLoading = false;
      },
      complete: () => { this.isLoading = false; }
    });
  }

  getSearchParams(): ListFilterCondition[] {
    const conditions: ListFilterCondition[] = [];
    const addContains = (DBName: string, Value: string | null | undefined): void => {
      const value = Value?.trim();
      if (value) conditions.push({ DBName, Value: value, DataType: DataType.Text, Operator: Operator.Contains });
    };

    // SearchTerm is the list API's server-side composite-search convention.
    addContains('SearchTerm', this.searchTerm);
    addContains('MaintenanceRequestNo', this.filters.requestNumber);
    addContains('AssetDisplayName', this.filters.asset);
    addContains('LocationDisplayName', this.filters.location);

    if (this.filters.priority) {
      conditions.push({ DBName: 'PriorityCode', Value: this.filters.priority, DataType: DataType.Text, Operator: Operator.EqualTo });
    }
    if (this.filters.status) {
      conditions.push({ DBName: 'StatusCode', Value: this.filters.status, DataType: DataType.Text, Operator: Operator.EqualTo });
    }

    const [from, to] = this.filters.requestedAtRange || [];
    if (from) {
      conditions.push({ DBName: 'RequestedAt', Value: String(this.loggedInUserService.formatDate(from)), DataType: DataType.Date, Operator: Operator.GreaterThanEqualTo });
    }
    if (to) {
      conditions.push({ DBName: 'RequestedAt', Value: String(this.loggedInUserService.formatDate(to)), DataType: DataType.Date, Operator: Operator.LessThanEqualTo });
    }

    return conditions;
  }

  onViewClick(obj: IMaintenanceRequest): void {
    this.router.navigate(['/maintenance-insurance/maintenance/requests/view', obj.Id]);
  }

  onEditClick(obj: IMaintenanceRequest): void {
    if (this.permission.CanUpdate && this.isEditable(obj)) {
      this.router.navigate(['/maintenance-insurance/maintenance/requests/edit', obj.Id]);
    }
  }

  isEditable(obj: IMaintenanceRequest): boolean {
    const status = `${obj.StatusCode || ''} ${obj.RecordStatus || ''}`.toLowerCase();
    return !/(completed|cancelled|canceled|closed|void|inactive|rejected|converted)/.test(status);
  }

  getPrioritySeverity(priority: string | null | undefined): 'danger' | 'warn' | 'info' | 'success' | 'secondary' | 'contrast' {
    const value = (priority || '').toLowerCase();
    if (/(critical|urgent|high)/.test(value)) return 'danger';
    if (/(medium|normal)/.test(value)) return 'warn';
    if (/(low)/.test(value)) return 'info';
    return 'secondary';
  }

  isLongDescription(value: string | null | undefined): boolean {
    return (value?.length || 0) > 72;
  }

  private createEmptyFilters(): MaintenanceRequestFilters {
    return { requestNumber: '', asset: '', requestedAtRange: null, priority: null, status: null, location: '' };
  }

  private resetToFirstPage(): void {
    this.pgEvent = { ...this.pgEvent, first: 0, page: 0 };
  }

  private setListData(data: IMaintenanceRequest[] | null | undefined, totalrecords: number): void {
    this.lstMain = data || [];
    this.totalNoOfRecords = totalrecords || 0;
  }

  private getSafeSortOption(): ListSortOption {
    const requestedOption = this.sortOptions.find(option => option.key === this.selectedSortKey);
    if (requestedOption && this.sortOptions.some(option => option.field === requestedOption.field)) {
      return requestedOption;
    }
    return this.sortOptions[0];
  }

  private captureListState(): MaintenanceRequestListState {
    return {
      toolbar: {
        searchTerm: this.searchTerm,
        selectedSortKey: this.getSafeSortOption().key,
        filtersVisible: this.filterControlsVisible,
        activeFilterCount: this.activeFilterCount
      },
      filters: {
        ...this.filters,
        requestedAtRange: this.filters.requestedAtRange ? [...this.filters.requestedAtRange] : null
      },
      pagination: { ...this.pgEvent }
    };
  }

  private restoreListState(): void {
    const state = this.maintenanceRequestService.CacheData.stateData as MaintenanceRequestListState | undefined;
    if (!state?.toolbar || !state.pagination) return;

    this.searchTerm = state.toolbar.searchTerm || '';
    this.selectedSortKey = this.sortOptions.some(option => option.key === state.toolbar.selectedSortKey)
      ? state.toolbar.selectedSortKey
      : this.sortOptions[0].key;
    this.filterControlsVisible = !!state.toolbar.filtersVisible;
    this.filters = {
      ...this.createEmptyFilters(),
      ...state.filters,
      requestedAtRange: this.deserializeDateRange(state.filters?.requestedAtRange)
    };
    this.pgEvent = {
      first: state.pagination.first ?? 0,
      rows: state.pagination.rows ?? 20,
      page: state.pagination.page ?? 0,
      pageCount: state.pagination.pageCount ?? 0
    };
  }

  private deserializeDateRange(value: Date[] | null | undefined): Date[] | null {
    if (!value?.length) return null;
    const dates = value.map(date => date instanceof Date ? date : new Date(date)).filter(date => !Number.isNaN(date.getTime()));
    return dates.length ? dates : null;
  }

  private canReuseCachedResult(): boolean {
    const state = this.maintenanceRequestService.CacheData.stateData as MaintenanceRequestListState | undefined;
    return !!this.maintenanceRequestService.CacheData.IsLoaded && !!state?.toolbar && !!state?.pagination;
  }

  private persistState(): void {
    this.maintenanceRequestService.CacheData.stateData = this.captureListState();
  }

  onOptionItemClicked(key: string): void {
    if (key === 'Create') {
      this.router.navigate(['/maintenance-insurance/maintenance/requests/create']);
    } else if (key === 'Refresh') {
      this.searchData(this.pgEvent, true, true);
    }
  }
}




