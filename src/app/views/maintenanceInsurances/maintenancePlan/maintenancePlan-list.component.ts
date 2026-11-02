import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; 
import { catchError, forkJoin, of, Subscription } from 'rxjs';

import { IPermission } from '@/shared/IPermission';
import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from  '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { ListEmptyState, ListFilterCondition, ListPageState, ListQueryParameters, ListSortOption } from '@/shared/list-page.models';
import { MaintenancePlanService } from './maintenancePlan.service';
import { IMaintenancePlan } from './maintenancePlan';
import { PageEvent } from '@/shared/IBase';

interface MaintenancePlanFilters {
  planCode: string;
  planName: string;
  maintenanceTypeId: string | null;
  assetCategoryId: string | null;
  triggerType: string | null;
  recordStatus: string | null;
}

type MaintenancePlanListState = ListPageState<MaintenancePlanFilters>;

@Component({
  selector: 'app-maintenance-plan-list',
  standalone: false,
  templateUrl: './maintenancePlan-list.component.html'
})
export class MaintenancePlanListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private maintenancePlanService: MaintenancePlanService,
    private router: Router, 
    private loggedInUserService: LoggedInUserService
  ) {}

  pgEvent: PageEvent = { first: 0, rows: 20, page: 0, pageCount: 0 };
  lstMain: IMaintenancePlan[] = [];
  totalNoOfRecords = 0;
  isLoading = false;
  hasLoadError = false;
  permission = {} as IPermission;
  searchTerm = '';
  filterControlsVisible = false;
  filters: MaintenancePlanFilters = this.createEmptyFilters();
  selectedSortKey = 'planName-asc';

  readonly sortOptions: ListSortOption[] = [
    { key: 'planName-asc', label: 'Plan Name — A to Z', field: 'MaintenancePlanName', descending: false },
    { key: 'planName-desc', label: 'Plan Name — Z to A', field: 'MaintenancePlanName', descending: true },
    { key: 'planCode-asc', label: 'Plan Code — Ascending', field: 'MaintenancePlanCode', descending: false },
    { key: 'planCode-desc', label: 'Plan Code — Descending', field: 'MaintenancePlanCode', descending: true },
    { key: 'maintenanceType-asc', label: 'Maintenance Type — A to Z', field: 'MaintenanceTypeId', descending: false },
    { key: 'assetCategory-asc', label: 'Asset Category — A to Z', field: 'AssetCategoryId', descending: false },
    { key: 'recordStatus-asc', label: 'Record Status — A to Z', field: 'RecordStatus', descending: false }
  ];

  maintenanceTypeOptions: ISelectItem[] = [];
  assetCategoryOptions: ISelectItem[] = [];
  measureDefinitionOptions: ISelectItem[] = [];
  triggerTypeOptions: ISelectItem[] = [];
  recordStatusOptions: ISelectItem[] = [];

  private searchSubscription?: Subscription;
  private lookupSubscription?: Subscription;
  private lastRequestSignature = '';

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    this.triggerTypeOptions = this.loggedInUserService.getPicklistOptions('TriggerTypeCode');
    this.recordStatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');
    this.loadLookupOptions();
    this.restoreListState();
  }

  ngAfterViewInit(): void {
    if (this.canReuseCachedResult()) {
      this.permission = this.maintenancePlanService.CacheData.permission;
      this.setListData(this.maintenancePlanService.CacheData.Data, this.maintenancePlanService.CacheData.TotalRecords);
      return;
    }

    this.searchData(this.pgEvent, true);
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.lookupSubscription?.unsubscribe();
  }

  get activeFilterCount(): number {
    return [
      this.filters.planCode,
      this.filters.planName,
      this.filters.maintenanceTypeId,
      this.filters.assetCategoryId,
      this.filters.triggerType,
      this.filters.recordStatus
    ].filter(value => !!value).length;
  }

  get hasActiveFilters(): boolean {
    return this.activeFilterCount > 0;
  }

  get emptyState(): ListEmptyState | null {
    if (this.isLoading || this.hasLoadError || this.totalNoOfRecords !== 0) return null;

    return this.searchTerm.trim() || this.hasActiveFilters
      ? { icon: 'pi pi-search', title: 'No Matching Maintenance Plans', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
      : { icon: 'pi pi-inbox', title: 'No Maintenance Plans Yet', description: 'Create a maintenance plan to define scheduled servicing and maintenance requirements.', actionLabel: 'Create Maintenance Plan' };
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
      this.permission = this.maintenancePlanService.CacheData.permission;
      this.setListData(this.maintenancePlanService.CacheData.Data, this.maintenancePlanService.CacheData.TotalRecords);
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
    this.searchSubscription = this.maintenancePlanService.search(searchParam).subscribe({
      next: res => {
        this.permission = res.permission;
        this.setListData(res.data.Records, res.data.TotalRecords);
        this.maintenancePlanService.setCache(res.data, this.permission, this.captureListState());
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

    // The existing MaintenancePlans endpoint requires this compatibility condition.
    // Server-side authorization must continue to scope the request to the authenticated tenant.
    const tenantId = this.loggedInUserService.loggedInUser?.Tenant?.Id;
    if (tenantId) {
      conditions.push({ DBName: 'TenantId', Value: String(tenantId), DataType: DataType.Int, Operator: Operator.EqualTo });
    }

    const searchTerm = this.searchTerm.trim();
    if (searchTerm) {
      // The endpoint's generic Dapper builder only accepts database columns.
      // Group the two real searchable columns so the term matches either one.
      conditions.push({ DBName: 'MaintenancePlanCode', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'PlanSearch' });
      conditions.push({ DBName: 'MaintenancePlanName', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'PlanSearch' });
    }
    addContains('MaintenancePlanCode', this.filters.planCode);
    addContains('MaintenancePlanName', this.filters.planName);
    if (this.filters.maintenanceTypeId) {
      conditions.push({ DBName: 'MaintenanceTypeId', Value: this.filters.maintenanceTypeId, DataType: DataType.Int, Operator: Operator.EqualTo });
    }
    if (this.filters.assetCategoryId) {
      conditions.push({ DBName: 'AssetCategoryId', Value: this.filters.assetCategoryId, DataType: DataType.Int, Operator: Operator.EqualTo });
    }
    if (this.filters.triggerType) {
      conditions.push({ DBName: 'TriggerTypeCode', Value: this.filters.triggerType, DataType: DataType.Text, Operator: Operator.EqualTo });
    }
    if (this.filters.recordStatus) {
      conditions.push({ DBName: 'RecordStatus', Value: this.filters.recordStatus, DataType: DataType.Text, Operator: Operator.EqualTo });
    }

    return conditions;
  }

  onViewClick(obj: IMaintenancePlan): void {
    this.router.navigate(['/maintenance-insurance/maintenance/plans/view', obj.Id]);
  }

  onEditClick(obj: IMaintenancePlan): void {
    if (this.permission.CanUpdate && this.isEditable(obj)) {
      this.router.navigate(['/maintenance-insurance/maintenance/plans/edit', obj.Id]);
    }
  }

  isEditable(obj: IMaintenancePlan): boolean {
    return !/(inactive|deleted|closed)/.test((obj.RecordStatus || '').toLowerCase());
  }

  getMaintenanceTypeName(obj: IMaintenancePlan): string {
    return obj.MaintenanceTypeDisplayName || this.getLookupText(this.maintenanceTypeOptions, obj.MaintenanceTypeId) || '—';
  }

  getAssetCategoryName(obj: IMaintenancePlan): string {
    return obj.AssetCategoryDisplayName || this.getLookupText(this.assetCategoryOptions, obj.AssetCategoryId) || '—';
  }

  getTriggerTypeLabel(code: string | null | undefined): string {
    return this.triggerTypeOptions.find(option => option.Value === code)?.Text || code || '—';
  }

  getMaintenanceInterval(obj: IMaintenancePlan): string {
    const parts: string[] = [];
    if (Number(obj.IntervalDays) > 0) {
      const days = Number(obj.IntervalDays);
      parts.push(`${days.toLocaleString('en-US')} ${days === 1 ? 'day' : 'days'}`);
    }
    if (Number(obj.IntervalMeasureValue) > 0) {
      const unit = obj.MeasureDefinitionDisplayName || this.getLookupText(this.measureDefinitionOptions, obj.MeasureDefinitionId) || 'units';
      parts.push(`${Number(obj.IntervalMeasureValue).toLocaleString('en-US', { maximumFractionDigits: 2 })} ${unit}`);
    }
    return parts.join(' · ') || 'Not configured';
  }

  private getLookupText(options: ISelectItem[], id: number): string {
    return options.find(option => Number(option.Value) === Number(id) || option.Id === id)?.Text || '';
  }

  private loadLookupOptions(): void {
    this.lookupSubscription = forkJoin({
      maintenanceTypes: this.loggedInUserService.getEntityLookupOptions('maintenance-types').pipe(catchError(() => of([]))),
      assetCategories: this.loggedInUserService.getEntityLookupOptions('asset-categories').pipe(catchError(() => of([]))),
      measureDefinitions: this.loggedInUserService.getEntityLookupOptions('asset-measure-definitions').pipe(catchError(() => of([])))
    }).subscribe(options => {
      this.maintenanceTypeOptions = options.maintenanceTypes;
      this.assetCategoryOptions = options.assetCategories;
      this.measureDefinitionOptions = options.measureDefinitions;
    });
  }

  private createEmptyFilters(): MaintenancePlanFilters {
    return { planCode: '', planName: '', maintenanceTypeId: null, assetCategoryId: null, triggerType: null, recordStatus: null };
  }

  private resetToFirstPage(): void {
    this.pgEvent = { ...this.pgEvent, first: 0, page: 0 };
  }

  private setListData(data: IMaintenancePlan[] | null | undefined, totalrecords: number): void {
    this.lstMain = data || [];
    this.totalNoOfRecords = totalrecords || 0;
  }

  private getSafeSortOption(): ListSortOption {
    const requestedOption = this.sortOptions.find(option => option.key === this.selectedSortKey);
    if (requestedOption && this.sortOptions.some(option => option.field === requestedOption.field)) return requestedOption;
    return this.sortOptions[0];
  }

  private captureListState(): MaintenancePlanListState {
    return {
      toolbar: { searchTerm: this.searchTerm, selectedSortKey: this.getSafeSortOption().key, filtersVisible: this.filterControlsVisible, activeFilterCount: this.activeFilterCount },
      filters: { ...this.filters },
      pagination: { ...this.pgEvent }
    };
  }

  private restoreListState(): void {
    const state = this.maintenancePlanService.CacheData.stateData as MaintenancePlanListState | undefined;
    if (!state?.toolbar || !state.pagination) return;

    this.searchTerm = state.toolbar.searchTerm || '';
    this.selectedSortKey = this.sortOptions.some(option => option.key === state.toolbar.selectedSortKey) ? state.toolbar.selectedSortKey : this.sortOptions[0].key;
    this.filterControlsVisible = !!state.toolbar.filtersVisible;
    this.filters = { ...this.createEmptyFilters(), ...state.filters };
    this.pgEvent = {
      first: state.pagination.first ?? 0,
      rows: state.pagination.rows ?? 20,
      page: state.pagination.page ?? 0,
      pageCount: state.pagination.pageCount ?? 0
    };
  }

  private canReuseCachedResult(): boolean {
    const state = this.maintenancePlanService.CacheData.stateData as MaintenancePlanListState | undefined;
    return !!this.maintenancePlanService.CacheData.IsLoaded && !!state?.toolbar && !!state?.pagination;
  }

  private persistState(): void {
    this.maintenancePlanService.CacheData.stateData = this.captureListState();
  }

  onOptionItemClicked(key: string): void {
    if (key === 'Create') {
      this.router.navigate(['/maintenance-insurance/maintenance/plans/create']);
    } else if (key === 'Refresh') {
      this.searchData(this.pgEvent, true, true);
    }
  }
}




