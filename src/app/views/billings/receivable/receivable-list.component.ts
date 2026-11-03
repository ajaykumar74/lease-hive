import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of, Subscription } from 'rxjs';

import { ISelectItem } from '@/shared/ISelectItem';
import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { ListPageController } from '@/shared/list-page.controller';
import { ListEmptyState, ListFilterCondition, ListSortOption } from '@/shared/list-page.models';
import { MessageComponent } from '@/shared/message.component';
import { IReceivableList } from './receivable';
import { ReceivableService } from './receivable.service';

interface ReceivableFilters {
    customerPartyId: number | null;
    receivableStatus: string | null;
    dueDateRange: Date[] | null;
    billingOrganisationId: number | null;
    currencyCode: string | null;
}

@Component({
    selector: 'app-receivable-list',
    standalone: false,
    templateUrl: './receivable-list.component.html'
})
export class ReceivableListComponent extends ListPageController<IReceivableList, ReceivableFilters> implements OnInit, AfterViewInit, OnDestroy {
    override readonly sortOptions: ListSortOption[] = [
        { key: 'recent', label: 'Recently Created', field: 'CreatedDateTime', descending: true },
        { key: 'document-date-desc', label: 'Document Date — Newest First', field: 'DocumentDate', descending: true },
        { key: 'document-date-asc', label: 'Document Date — Oldest First', field: 'DocumentDate', descending: false },
        { key: 'due-date-asc', label: 'Due Date — Earliest First', field: 'DueDate', descending: false },
        { key: 'due-date-desc', label: 'Due Date — Latest First', field: 'DueDate', descending: true },
        { key: 'customer-asc', label: 'Customer — A to Z', field: 'CustomerDisplayName', descending: false },
        { key: 'outstanding-desc', label: 'Outstanding — High to Low', field: 'OutstandingAmount', descending: true },
        { key: 'outstanding-asc', label: 'Outstanding — Low to High', field: 'OutstandingAmount', descending: false },
        { key: 'status-asc', label: 'Status — A to Z', field: 'ReceivableStatus', descending: false }
    ];
    override selectedSortKey = 'recent';

    customerOptions: ISelectItem[] = [];
    organisationOptions: ISelectItem[] = [];
    receivableStatusOptions: ISelectItem[] = [];
    currencyOptions: ISelectItem[] = [];
    isReconciling = false;
    reconciliationSummary = '';

    private lookupSubscription?: Subscription;

    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private readonly receivableService: ReceivableService,
        private readonly router: Router,
        private readonly loggedInUserService: LoggedInUserService
    ) {
        super(receivableService);
    }

    ngOnInit(): void {
        this.receivableStatusOptions = this.loggedInUserService.getPicklistOptions('ReceivableStatus');
        this.currencyOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
        this.restoreListState();
        this.loadLookupOptions();
    }

    ngAfterViewInit(): void {
        this.initializeList();
    }

    ngOnDestroy(): void {
        this.destroyListController();
        this.lookupSubscription?.unsubscribe();
    }

    onViewClick(obj: IReceivableList): void {
        this.router.navigate(['/billing-finance/receivables/view', obj.Id]);
    }

    onEditClick(obj: IReceivableList): void {
        if (this.permission.CanUpdate && this.isEditable(obj)) {
            this.router.navigate(['/billing-finance/receivables/edit', obj.Id]);
        }
    }

    onOptionItemClicked(key: string): void {
        if (key === 'Create') {
            this.router.navigate(['/billing-finance/receivables/create']);
        } else if (key === 'Refresh') {
            this.refreshList();
        }
    }

    reconcileMissingReceivables(): void {
        if (this.isReconciling || !this.permission.CanUpdate) return;

        this.isReconciling = true;
        this.receivableService.reconcileMissingReceivables().subscribe({
            next: (response) => {
                const result = response?.data || {};
                this.reconciliationSummary = `${result.CreatedCount || 0} created, ${result.SkippedCount || 0} skipped, ${result.FailedCount || 0} failed.`;
                this.messageService.showSuccess(`Receivable reconciliation complete: ${this.reconciliationSummary}`);
                this.refreshList();
            },
            error: (error) => this.messageService.showError(error?.error?.ErrorMessage || error?.message || 'Receivable reconciliation failed.'),
            complete: () => (this.isReconciling = false)
        });
    }

    customerName(obj: IReceivableList): string {
        return obj.CustomerDisplayName || this.lookupText(this.customerOptions, obj.CustomerPartyId) || '—';
    }

    statusName(obj: IReceivableList): string {
        return this.receivableStatusOptions.find((option) => option.Value === obj.ReceivableStatus)?.Text || obj.ReceivableStatus || '—';
    }

    getStatusClass(obj: IReceivableList): string {
        const status = this.statusName(obj).toLowerCase();
        if (status.includes('paid') || status.includes('settled') || status.includes('closed')) return 'status-active';
        if (status.includes('cancel') || status.includes('write') || status.includes('dispute')) return 'status-closed';
        return 'status-pending';
    }

    isEditable(obj: IReceivableList): boolean {
        const status = this.statusName(obj).toLowerCase();
        return !['paid', 'settled', 'closed', 'cancelled', 'written off'].some((lockedStatus) => status.includes(lockedStatus));
    }

    protected override createEmptyFilters(): ReceivableFilters {
        return { customerPartyId: null, receivableStatus: null, dueDateRange: null, billingOrganisationId: null, currencyCode: null };
    }

    protected override countActiveFilters(): number {
        return [
            this.filters.customerPartyId,
            this.filters.receivableStatus,
            this.filters.dueDateRange?.some(Boolean) ? 1 : 0,
            this.filters.billingOrganisationId,
            this.filters.currencyCode
        ].filter((value) => !!value).length;
    }

    protected override createEmptyState(hasQueryOrFilters: boolean): ListEmptyState {
        return hasQueryOrFilters
            ? { icon: 'pi pi-search', title: 'No Matching Receivables', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
            : { icon: 'pi pi-inbox', title: 'No Receivables Yet', description: 'Receivables will appear here once they are created.', actionLabel: 'Create Receivable' };
    }

    protected override getSearchParams(): ListFilterCondition[] {
        const conditions: ListFilterCondition[] = [];
        const tenantId = this.getTenantId();
        if (tenantId) {
            conditions.push({ DBName: 'TenantId', Value: tenantId, DataType: DataType.Int, Operator: Operator.EqualTo });
        }
        conditions.push({ DBName: 'RecordStatus', Value: 'Active', DataType: DataType.Text, Operator: Operator.EqualTo });

        const searchTerm = this.searchTerm.trim();
        if (searchTerm) {
            conditions.push({ DBName: 'DocumentNo', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'ReceivableSearch' });
            conditions.push({ DBName: 'CustomerDisplayName', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'ReceivableSearch' });
        }

        if (this.filters.customerPartyId) {
            conditions.push({ DBName: 'CustomerPartyId', Value: String(this.filters.customerPartyId), DataType: DataType.Int, Operator: Operator.EqualTo });
        }
        if (this.filters.receivableStatus) {
            conditions.push({ DBName: 'ReceivableStatus', Value: this.filters.receivableStatus, DataType: DataType.Text, Operator: Operator.EqualTo });
        }
        if (this.filters.billingOrganisationId) {
            conditions.push({ DBName: 'BillingOrganisationId', Value: String(this.filters.billingOrganisationId), DataType: DataType.Int, Operator: Operator.EqualTo });
        }
        if (this.filters.currencyCode) {
            conditions.push({ DBName: 'CurrencyCode', Value: this.filters.currencyCode, DataType: DataType.Text, Operator: Operator.EqualTo });
        }

        const [from, to] = this.filters.dueDateRange || [];
        if (from) {
            conditions.push({ DBName: 'DueDate', Value: String(this.loggedInUserService.formatDate(from)), DataType: DataType.Date, Operator: Operator.GreaterThanEqualTo });
        }
        if (to) {
            conditions.push({ DBName: 'DueDate', Value: String(this.loggedInUserService.formatDate(to)), DataType: DataType.Date, Operator: Operator.LessThanEqualTo });
        }
        return conditions;
    }

    protected override getListContextKey(): string {
        return this.getTenantId();
    }

    protected override reportListError(error: unknown): void {
        this.messageService.showError(error);
    }

    protected override cloneFilters(filters: ReceivableFilters): ReceivableFilters {
        return { ...filters, dueDateRange: filters.dueDateRange ? [...filters.dueDateRange] : null };
    }

    protected override restoreFilters(filters: ReceivableFilters | null | undefined): ReceivableFilters {
        return {
            ...this.createEmptyFilters(),
            ...filters,
            dueDateRange: this.deserializeDateRange(filters?.dueDateRange)
        };
    }

    private loadLookupOptions(): void {
        this.lookupSubscription = forkJoin({
            customers: this.loggedInUserService.getEntityLookupOptions('parties').pipe(catchError(() => of([]))),
            organisations: this.loggedInUserService.getEntityLookupOptions('organisations').pipe(catchError(() => of([])))
        }).subscribe((options) => {
            this.customerOptions = options.customers;
            this.organisationOptions = options.organisations;
        });
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

    private lookupText(options: ISelectItem[], id: number): string | undefined {
        return options.find((option) => Number(option.Id) === Number(id))?.Text;
    }
}
