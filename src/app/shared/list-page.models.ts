import { CombineCriteriaType, DataType, Operator } from './LoggedInUserService';

/** Lightweight contracts shared by list pages without imposing a new UI framework. */
export interface ListSortOption {
    key: string;
    label: string;
    field: string;
    descending: boolean;
}

export interface ListToolbarState {
    searchTerm: string;
    selectedSortKey: string;
    filtersVisible: boolean;
    activeFilterCount: number;
}

export interface ListPaginationState {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

export interface ListPageState<TFilters> {
    toolbar: ListToolbarState;
    filters: TFilters;
    pagination: ListPaginationState;
}

/** State stored with a module's local list cache. */
export interface ListPageCachedState<TFilters> extends ListPageState<TFilters> {
    contextKey: string;
}

export interface ListEmptyState {
    icon: string;
    title: string;
    description: string;
    actionLabel?: string;
}

export interface ListFilterCondition {
    DBName: string;
    Value: string;
    DataType: DataType;
    Operator: Operator;
    CombineCriteria?: CombineCriteriaType;
    GroupName?: string;
}

export interface ListQueryParameters {
    Skip: number;
    Take: number;
    SortBy: string;
    IsDescending: boolean;
    Conditions: ListFilterCondition[];
    [key: string]: unknown;
}
