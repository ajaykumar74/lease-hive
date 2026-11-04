import { Observable, Subscription } from 'rxjs';

import { PageEvent } from './IBase';
import { ICacheData } from './ICacheData';
import { IPermission } from './IPermission';
import { ListEmptyState, ListFilterCondition, ListPageCachedState, ListPageState, ListQueryParameters, ListSortOption } from './list-page.models';

export interface ListPageSearchResult<TRecord> {
    data: {
        Records: TRecord[];
        TotalRecords: number;
    };
    permission: IPermission;
}

/**
 * The minimal service surface a list needs for server queries and its local
 * result cache. Entity services retain ownership of their API endpoints.
 */
export interface ListPageDataSource<TRecord> {
    CacheData: ICacheData;
    search(searchParam: ListQueryParameters): Observable<ListPageSearchResult<TRecord>>;
    setCache<TFilters>(result: ListPageSearchResult<TRecord>['data'], permission: IPermission, state: ListPageState<TFilters>, requestSignature: string): void;
    invalidateListCache(): void;
}

/**
 * Shared list lifecycle for LeaseHive's server-paged PrimeNG pages.
 * Components provide their entity-specific conditions, filters, lookups,
 * routes and row presentation while this controller owns query/cache state.
 */
export abstract class ListPageController<TRecord, TFilters extends object> {
    pgEvent: PageEvent = { first: 0, rows: 20, page: 0, pageCount: 0 } as PageEvent;
    lstMain: TRecord[] = [];
    totalNoOfRecords = 0;
    isLoading = false;
    hasLoadError = false;
    permission = {} as IPermission;
    searchTerm = '';
    filterControlsVisible = false;
    filters: TFilters;
    selectedSortKey = '';

    private searchSubscription?: Subscription;
    private lastRequestSignature = '';
    private requestSequence = 0;

    protected constructor(protected readonly listDataSource: ListPageDataSource<TRecord>) {
        this.filters = this.createEmptyFilters();
    }

    protected abstract readonly sortOptions: readonly ListSortOption[];

    protected abstract createEmptyFilters(): TFilters;
    protected abstract getSearchParams(): ListFilterCondition[];
    protected abstract countActiveFilters(): number;
    protected abstract createEmptyState(hasQueryOrFilters: boolean): ListEmptyState;
    protected abstract getListContextKey(): string;
    protected abstract reportListError(error: unknown): void;

    get activeFilterCount(): number {
        return this.countActiveFilters();
    }

    get hasActiveFilters(): boolean {
        return this.activeFilterCount > 0;
    }

    get emptyState(): ListEmptyState | null {
        if (this.isLoading || this.hasLoadError || this.totalNoOfRecords !== 0) return null;
        return this.createEmptyState(!!this.searchTerm.trim() || this.hasActiveFilters);
    }

    initializeList(): void {
        if (this.canReuseCachedResult(this.getRequestSignature())) {
            this.permission = this.listDataSource.CacheData.permission;
            this.setListData(this.listDataSource.CacheData.Data, this.listDataSource.CacheData.TotalRecords);
            return;
        }

        this.searchData(this.pgEvent, false);
    }

    destroyListController(): void {
        this.requestSequence++;
        this.searchSubscription?.unsubscribe();
    }

    onSearch(): void {
        this.resetToFirstPage();
        this.invalidateAndSearch();
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.resetToFirstPage();
        this.invalidateAndSearch();
    }

    clearFilters(): void {
        if (!this.hasActiveFilters) return;
        this.filters = this.createEmptyFilters();
        this.onFiltersCleared();
        this.resetToFirstPage();
        this.invalidateAndSearch();
    }

    clearSearchAndFilters(): void {
        this.searchTerm = '';
        this.filters = this.createEmptyFilters();
        this.onFiltersCleared();
        this.resetToFirstPage();
        this.invalidateAndSearch();
    }

    toggleFilterControls(): void {
        this.filterControlsVisible = !this.filterControlsVisible;
        this.persistState();
    }

    onFiltersChanged(): void {
        this.resetToFirstPage();
        this.invalidateAndSearch();
    }

    onSortChanged(): void {
        this.selectedSortKey = this.getSafeSortOption().key;
        this.resetToFirstPage();
        this.invalidateAndSearch();
    }

    pageChanged(event: Partial<PageEvent>): void {
        this.pgEvent = {
            first: event.first ?? 0,
            rows: event.rows ?? 20,
            page: event.page ?? 0,
            pageCount: event.pageCount ?? 0
        };
        this.invalidateAndSearch();
    }

    refreshList(): void {
        this.invalidateAndSearch();
    }

    searchData(pgEvent: PageEvent, isReload: boolean, forceReload = false): void {
        this.pgEvent = {
            first: pgEvent.first ?? 0,
            rows: pgEvent.rows ?? 20,
            page: pgEvent.page ?? 0,
            pageCount: pgEvent.pageCount ?? 0
        };

        const searchParam = this.getSearchRequest();
        const requestSignature = JSON.stringify(searchParam);

        if (!isReload && this.canReuseCachedResult(requestSignature)) {
            this.permission = this.listDataSource.CacheData.permission;
            this.setListData(this.listDataSource.CacheData.Data, this.listDataSource.CacheData.TotalRecords);
            return;
        }

        if (!forceReload && requestSignature === this.lastRequestSignature && !this.hasLoadError) {
            this.persistState();
            return;
        }

        this.searchSubscription?.unsubscribe();
        this.lastRequestSignature = requestSignature;
        const requestId = ++this.requestSequence;
        const requestContextKey = this.getListContextKey();
        this.isLoading = true;
        this.hasLoadError = false;
        this.searchSubscription = this.listDataSource.search(searchParam).subscribe({
            next: (res) => {
                if (requestId !== this.requestSequence || requestContextKey !== this.getListContextKey()) return;
                this.permission = res.permission;
                this.setListData(res.data.Records, res.data.TotalRecords);
                this.listDataSource.setCache(res.data, this.permission, this.captureListState(), requestSignature);
            },
            error: (error) => {
                if (requestId !== this.requestSequence || requestContextKey !== this.getListContextKey()) return;
                this.lstMain = [];
                this.totalNoOfRecords = 0;
                this.hasLoadError = true;
                this.reportListError(error);
                this.isLoading = false;
            },
            complete: () => {
                if (requestId === this.requestSequence) this.isLoading = false;
            }
        });
    }

    restoreListState(): void {
        const state = this.listDataSource.CacheData.stateData as ListPageCachedState<TFilters> | undefined;
        if (!state?.toolbar || !state.pagination || state.contextKey !== this.getListContextKey()) return;

        this.searchTerm = state.toolbar.searchTerm || '';
        this.selectedSortKey = this.sortOptions.some((option) => option.key === state.toolbar.selectedSortKey) ? state.toolbar.selectedSortKey : this.sortOptions[0]?.key || '';
        this.filterControlsVisible = !!state.toolbar.filtersVisible;
        this.filters = this.restoreFilters(state.filters);
        this.pgEvent = {
            first: state.pagination.first ?? 0,
            rows: state.pagination.rows ?? 20,
            page: state.pagination.page ?? 0,
            pageCount: state.pagination.pageCount ?? 0
        };
        this.onStateRestored();
    }

    protected onFiltersCleared(): void {}

    protected onStateRestored(): void {}

    /** Allows a specialised list mode to add typed endpoint parameters. */
    protected getAdditionalSearchParameters(): Record<string, unknown> { return {}; }

    protected cloneFilters(filters: TFilters): TFilters {
        return { ...filters };
    }

    protected restoreFilters(filters: TFilters | null | undefined): TFilters {
        return { ...this.createEmptyFilters(), ...(filters || {}) };
    }

    private getSearchRequest(): ListQueryParameters {
        const sort = this.getSafeSortOption();
        return {
            Skip: this.pgEvent.first,
            Take: this.pgEvent.rows,
            SortBy: sort.field,
            IsDescending: sort.descending,
            Conditions: this.getSearchParams(),
            ...this.getAdditionalSearchParameters()
        };
    }

    private getRequestSignature(): string {
        return JSON.stringify(this.getSearchRequest());
    }

    private invalidateAndSearch(): void {
        this.listDataSource.invalidateListCache();
        this.lastRequestSignature = '';
        this.searchData(this.pgEvent, true);
    }

    private resetToFirstPage(): void {
        this.pgEvent = { ...this.pgEvent, first: 0, page: 0 };
    }

    private setListData(data: TRecord[] | null | undefined, totalrecords: number): void {
        this.lstMain = data || [];
        this.totalNoOfRecords = totalrecords || 0;
    }

    private getSafeSortOption(): ListSortOption {
        return this.sortOptions.find((option) => option.key === this.selectedSortKey) || this.sortOptions[0];
    }

    private captureListState(): ListPageCachedState<TFilters> {
        return {
            contextKey: this.getListContextKey(),
            toolbar: {
                searchTerm: this.searchTerm,
                selectedSortKey: this.getSafeSortOption().key,
                filtersVisible: this.filterControlsVisible,
                activeFilterCount: this.activeFilterCount
            },
            filters: this.cloneFilters(this.filters),
            pagination: { ...this.pgEvent }
        };
    }

    private canReuseCachedResult(requestSignature: string): boolean {
        const state = this.listDataSource.CacheData.stateData as ListPageCachedState<TFilters> | undefined;
        return !!this.listDataSource.CacheData.IsLoaded && !!state?.toolbar && !!state?.pagination && state.contextKey === this.getListContextKey() && this.listDataSource.CacheData.SearchParams === requestSignature;
    }

    private persistState(): void {
        this.listDataSource.CacheData.stateData = this.captureListState();
    }
}
