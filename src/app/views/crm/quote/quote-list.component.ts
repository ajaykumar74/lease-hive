import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of, Subscription } from 'rxjs';

import { ISelectItem } from '@/shared/ISelectItem';
import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { ListPageController } from '@/shared/list-page.controller';
import { ListEmptyState, ListFilterCondition, ListSortOption } from '@/shared/list-page.models';
import { MessageComponent } from '@/shared/message.component';
import { IQuoteList } from './quote';
import { QuoteService } from './quote.service';

interface QuoteFilters {
    partyId: number | null;
    opportunityId: number | null;
    quoteStatusId: number | null;
    validUntilRange: Date[] | null;
    minimumValue: number | null;
    maximumValue: number | null;
    currencyCode: string | null;
}

@Component({
    selector: 'app-quote-list',
    standalone: false,
    templateUrl: './quote-list.component.html'
})
export class QuoteListComponent extends ListPageController<IQuoteList, QuoteFilters> implements OnInit, AfterViewInit, OnDestroy {
    override readonly sortOptions: ListSortOption[] = [
        { key: 'latest', label: 'Latest Quotes First', field: 'QuoteDate', descending: true },
        { key: 'oldest', label: 'Oldest Quotes First', field: 'QuoteDate', descending: false },
        { key: 'quote-asc', label: 'Quote No. — Ascending', field: 'QuoteId', descending: false },
        { key: 'quote-desc', label: 'Quote No. — Descending', field: 'QuoteId', descending: true },
        { key: 'customer-asc', label: 'Customer — A to Z', field: 'PartyDisplayName', descending: false },
        { key: 'value-desc', label: 'Value — High to Low', field: 'TotalAmount', descending: true },
        { key: 'value-asc', label: 'Value — Low to High', field: 'TotalAmount', descending: false },
        { key: 'valid-until-asc', label: 'Valid Until — Earliest First', field: 'ValidUntil', descending: false },
        { key: 'valid-until-desc', label: 'Valid Until — Latest First', field: 'ValidUntil', descending: true }
    ];
    override selectedSortKey = 'latest';

    partyOptions: ISelectItem[] = [];
    opportunityOptions: ISelectItem[] = [];
    quoteStatusOptions: ISelectItem[] = [];
    currencyOptions: ISelectItem[] = [];

    private lookupSubscription?: Subscription;
    private opportunityLookupSubscription?: Subscription;

    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        quoteService: QuoteService,
        private readonly router: Router,
        private readonly loggedInUserService: LoggedInUserService
    ) {
        super(quoteService);
    }

    ngOnInit(): void {
        this.currencyOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
        this.restoreListState();
        this.loadLookupOptions();
        this.loadOpportunityOptions();
    }

    ngAfterViewInit(): void {
        this.initializeList();
    }

    ngOnDestroy(): void {
        this.destroyListController();
        this.lookupSubscription?.unsubscribe();
        this.opportunityLookupSubscription?.unsubscribe();
    }

    onCustomerChanged(): void {
        this.filters.opportunityId = null;
        this.loadOpportunityOptions();
        this.onFiltersChanged();
    }

    onReviewClick(obj: IQuoteList): void {
        this.router.navigate(['/business/origination/quotes/review', obj.Id]);
    }

    onEditClick(obj: IQuoteList): void {
        if (this.permission.CanUpdate && this.isEditable(obj)) {
            this.router.navigate(['/business/origination/quotes/edit', obj.Id]);
        }
    }

    isEditable(obj: IQuoteList): boolean {
        return obj.IsEditable === true;
    }

    getStatusClass(status: string): string {
        const value = (status || '').toLowerCase();
        if (value.includes('accepted')) return 'status-active';
        if (value.includes('issued') || value.includes('draft')) return 'status-pending';
        if (value.includes('rejected') || value.includes('expired') || value.includes('withdrawn') || value.includes('superseded')) return 'status-closed';
        return 'status-pending';
    }

    onOptionItemClicked(key: string): void {
        if (key === 'Create') {
            this.router.navigate(['/business/origination/quotes/create']);
        } else if (key === 'Refresh') {
            this.refreshList();
        }
    }

    protected override createEmptyFilters(): QuoteFilters {
        return { partyId: null, opportunityId: null, quoteStatusId: null, validUntilRange: null, minimumValue: null, maximumValue: null, currencyCode: null };
    }

    protected override countActiveFilters(): number {
        return [
            this.filters.partyId,
            this.filters.opportunityId,
            this.filters.quoteStatusId,
            this.filters.validUntilRange?.some(Boolean) ? 1 : 0,
            this.filters.minimumValue !== null || this.filters.maximumValue !== null ? 1 : 0,
            this.filters.currencyCode
        ].filter((value) => !!value).length;
    }

    protected override createEmptyState(hasQueryOrFilters: boolean): ListEmptyState {
        return hasQueryOrFilters
            ? { icon: 'pi pi-search', title: 'No Matching Quotations', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
            : { icon: 'pi pi-inbox', title: 'No Quotations Yet', description: 'Quotations will appear here once they are created.', actionLabel: 'Create Quote' };
    }

    protected override getSearchParams(): ListFilterCondition[] {
        const conditions: ListFilterCondition[] = [];
        const tenantId = this.getTenantId();
        if (tenantId) {
            conditions.push({ DBName: 'TenantId', Value: tenantId, DataType: DataType.Int, Operator: Operator.EqualTo });
        }

        const searchTerm = this.searchTerm.trim();
        if (searchTerm) {
            conditions.push({ DBName: 'QuoteId', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'QuoteSearch' });
            conditions.push({ DBName: 'PartyDisplayName', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'QuoteSearch' });
        }
        if (this.filters.partyId) {
            conditions.push({ DBName: 'PartyId', Value: String(this.filters.partyId), DataType: DataType.Int, Operator: Operator.EqualTo });
        }
        if (this.filters.opportunityId) {
            conditions.push({ DBName: 'OpportunityId', Value: String(this.filters.opportunityId), DataType: DataType.Int, Operator: Operator.EqualTo });
        }
        if (this.filters.quoteStatusId) {
            conditions.push({ DBName: 'QuoteStatusId', Value: String(this.filters.quoteStatusId), DataType: DataType.Int, Operator: Operator.EqualTo });
        }
        const [validFrom, validTo] = this.filters.validUntilRange || [];
        if (validFrom) {
            conditions.push({ DBName: 'ValidUntil', Value: String(this.loggedInUserService.formatDate(validFrom)), DataType: DataType.Date, Operator: Operator.GreaterThanEqualTo });
        }
        if (validTo) {
            conditions.push({ DBName: 'ValidUntil', Value: String(this.loggedInUserService.formatDate(validTo)), DataType: DataType.Date, Operator: Operator.LessThanEqualTo });
        }
        if (this.filters.minimumValue !== null && this.filters.minimumValue !== undefined) {
            conditions.push({ DBName: 'TotalAmount', Value: String(this.filters.minimumValue), DataType: DataType.Amount, Operator: Operator.GreaterThanEqualTo });
        }
        if (this.filters.maximumValue !== null && this.filters.maximumValue !== undefined) {
            conditions.push({ DBName: 'TotalAmount', Value: String(this.filters.maximumValue), DataType: DataType.Amount, Operator: Operator.LessThanEqualTo });
        }
        if (this.filters.currencyCode) {
            conditions.push({ DBName: 'CurrencyCode', Value: this.filters.currencyCode, DataType: DataType.Text, Operator: Operator.EqualTo });
        }
        return conditions;
    }

    protected override getListContextKey(): string {
        return this.getTenantId();
    }

    protected override reportListError(error: unknown): void {
        this.messageService.showError(error);
    }

    protected override cloneFilters(filters: QuoteFilters): QuoteFilters {
        return {
            ...filters,
            validUntilRange: filters.validUntilRange ? [...filters.validUntilRange] : null
        };
    }

    protected override restoreFilters(filters: QuoteFilters | null | undefined): QuoteFilters {
        return {
            ...this.createEmptyFilters(),
            ...filters,
            validUntilRange: this.deserializeDateRange(filters?.validUntilRange)
        };
    }

    protected override onFiltersCleared(): void {
        this.loadOpportunityOptions();
    }

    private loadLookupOptions(): void {
        this.lookupSubscription = forkJoin({
            parties: this.loggedInUserService.getEntityLookupOptions('parties').pipe(catchError(() => of([]))),
            quoteStatuses: this.loggedInUserService.getEntityLookupOptions('quote-statuses').pipe(catchError(() => of([])))
        }).subscribe((options) => {
            this.partyOptions = options.parties;
            this.quoteStatusOptions = options.quoteStatuses;
        });
    }

    private loadOpportunityOptions(): void {
        this.opportunityLookupSubscription?.unsubscribe();
        const filters = this.filters.partyId ? { PartyId: this.filters.partyId } : {};
        this.opportunityLookupSubscription = this.loggedInUserService
            .getEntityLookupOptions('opportunities', undefined, filters)
            .pipe(catchError(() => of([])))
            .subscribe((options) => (this.opportunityOptions = options));
    }

    private deserializeDateRange(value: Date[] | null | undefined): Date[] | null {
        if (!value?.length) return null;
        const dates = value.map((date) => (date instanceof Date ? date : new Date(date))).filter((date) => !Number.isNaN(date.getTime()));
        return dates.length ? dates : null;
    }

    private getTenantId(): string {
        const tenant = this.loggedInUserService.loggedInUser?.Tenant;
        return String(tenant?.Id ?? tenant?.TenantId ?? '');
    }
}
