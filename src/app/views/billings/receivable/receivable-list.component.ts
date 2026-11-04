import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, of, Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';

import { ISelectItem } from '@/shared/ISelectItem';
import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { ListPageController } from '@/shared/list-page.controller';
import { ListEmptyState, ListFilterCondition, ListSortOption } from '@/shared/list-page.models';
import { MessageComponent } from '@/shared/message.component';
import { PermissionService } from '@/shared/security/permission.service';
import { IOpenReceivablesSummary, IReceivableList } from './receivable';
import { ReceivableService } from './receivable.service';
import { downloadXlsx } from '@/views/reports/assets/utilization/xlsx-exporter';

interface ReceivableFilters {
    customerPartyId: number | null;
    receivableStatus: string | null;
    dueDateRange: Date[] | null;
    billingOrganisationId: number | null;
    currencyCode: string | null;
    leaseContractId: number | null;
    assetCategoryId: number | null;
    openStatus: string | null;
    ageingBucket: string | null;
    overdueOnly: boolean;
}

@Component({
    selector: 'app-receivable-list',
    standalone: false,
    templateUrl: './receivable-list.component.html',
    styleUrls: ['./receivable-list.component.css']
})
export class ReceivableListComponent extends ListPageController<IReceivableList, ReceivableFilters> implements OnInit, AfterViewInit, OnDestroy {
    override readonly sortOptions: ListSortOption[] = [
        { key: 'recent', label: 'Recently Created', field: 'CreatedDateTime', descending: true },
        { key: 'document-date-desc', label: 'Document Date — Newest First', field: 'DocumentDate', descending: true },
        { key: 'document-date-asc', label: 'Document Date — Oldest First', field: 'DocumentDate', descending: false },
        { key: 'due-date-asc', label: 'Due Date — Earliest First', field: 'DueDate', descending: false },
        { key: 'due-date-desc', label: 'Due Date — Latest First', field: 'DueDate', descending: true },
        { key: 'customer-asc', label: 'Customer — A to Z', field: 'CustomerDisplayName', descending: false },
        { key: 'contract-asc', label: 'Lease Contract — A to Z', field: 'LeaseContractNumber', descending: false },
        { key: 'outstanding-desc', label: 'Outstanding — High to Low', field: 'OutstandingAmount', descending: true },
        { key: 'outstanding-asc', label: 'Outstanding — Low to High', field: 'OutstandingAmount', descending: false },
        { key: 'days-overdue-desc', label: 'Days Overdue — Oldest First', field: 'DaysOverdue', descending: true },
        { key: 'days-overdue-asc', label: 'Days Overdue — Newest First', field: 'DaysOverdue', descending: false },
        { key: 'status-asc', label: 'Status — A to Z', field: 'ReceivableStatus', descending: false }
    ];
    override selectedSortKey = 'recent';

    customerOptions: ISelectItem[] = [];
    organisationOptions: ISelectItem[] = [];
    receivableStatusOptions: ISelectItem[] = [];
    currencyOptions: ISelectItem[] = [];
    contractOptions: ISelectItem[] = [];
    assetCategoryOptions: ISelectItem[] = [];
    readonly openStatusOptions: ISelectItem[] = [
        { Text: 'Open', Value: 'OPEN' },
        { Text: 'Partially Paid', Value: 'PARTIALLY_PAID' },
        { Text: 'Overdue', Value: 'OVERDUE' }
    ];
    readonly ageingBucketOptions: ISelectItem[] = [
        { Text: '1–30 days', Value: '1_30' },
        { Text: '31–60 days', Value: '31_60' },
        { Text: '61–90 days', Value: '61_90' },
        { Text: '90+ days', Value: '90_PLUS' }
    ];
    readonly isOpenReceivablesMode: boolean;
    readonly isOverdueReceivablesMode: boolean;
    openSummary: IOpenReceivablesSummary | null = null;
    openActionItems: MenuItem[] = [];
    isExporting = false;
    isReconciling = false;
    reconciliationSummary = '';

    private lookupSubscription?: Subscription;
    private openSummarySubscription?: Subscription;

    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private readonly receivableService: ReceivableService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly loggedInUserService: LoggedInUserService,
        private readonly permissionService: PermissionService
    ) {
        super(receivableService);
        this.isOpenReceivablesMode = this.route.snapshot.data['openReceivables'] === true;
        this.isOverdueReceivablesMode = this.route.snapshot.data['overdueReceivables'] === true;
        this.filters = this.createEmptyFilters();
        this.selectedSortKey = this.isOverdueReceivablesMode ? 'days-overdue-desc' : 'recent';
    }

    ngOnInit(): void {
        this.receivableStatusOptions = this.loggedInUserService.getPicklistOptions('ReceivableStatus');
        this.currencyOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
        this.restoreListState();
        this.loadLookupOptions();
        if (this.isReceivablesWorklistMode) {
            this.openSummarySubscription = this.receivableService.openReceivablesSummary$.subscribe(summary => this.openSummary = summary);
        }
    }

    ngAfterViewInit(): void {
        this.initializeList();
    }

    ngOnDestroy(): void {
        this.destroyListController();
        this.lookupSubscription?.unsubscribe();
        this.openSummarySubscription?.unsubscribe();
    }

    get isReceivablesWorklistMode(): boolean {
        return this.isOpenReceivablesMode || this.isOverdueReceivablesMode;
    }

    get worklistCaption(): string {
        return this.isOverdueReceivablesMode ? 'Overdue Receivables' : 'Open Receivables';
    }

    get exportCaption(): string {
        return this.isOverdueReceivablesMode ? 'Overdue Receivables' : 'Open Receivables';
    }

    get worklistSearchPlaceholder(): string {
        return this.isOverdueReceivablesMode ? 'Search overdue invoice, customer or contract...' : 'Search invoice, customer or contract...';
    }

    onViewClick(obj: IReceivableList): void {
        this.router.navigate(['/billing-finance/receivables/view', obj.Id]);
    }

    onInvoiceClick(obj: IReceivableList): void {
        if (this.hasCustomerInvoice(obj)) {
            this.router.navigate(['/billing-finance/invoices/view', obj.SourceDocumentId]);
            return;
        }
        this.onViewClick(obj);
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

    openStatusName(obj: IReceivableList): string {
        if (this.isOverdueReceivablesMode) {
            return Number(obj.AllocatedAmount || 0) > 0 ? 'Partially Paid' : 'Overdue';
        }
        if (this.daysOverdue(obj) > 0) return 'Overdue';
        return Number(obj.AllocatedAmount || 0) > 0 ? 'Partially Paid' : 'Open';
    }

    openStatusClass(obj: IReceivableList): string {
        const status = this.openStatusName(obj).toLowerCase();
        return status === 'overdue' ? 'open-status--overdue' : status.includes('partial') ? 'open-status--partial' : 'open-status--open';
    }

    ageingBucketName(obj: IReceivableList): string {
        const days = this.daysOverdue(obj);
        if (days > 90) return '90+';
        if (days > 60) return '61–90';
        if (days > 30) return '31–60';
        return '1–30';
    }

    ageingBucketClass(obj: IReceivableList): string {
        const days = this.daysOverdue(obj);
        if (days > 90) return 'ageing-bucket--critical';
        if (days > 60) return 'ageing-bucket--high';
        if (days > 30) return 'ageing-bucket--medium';
        return 'ageing-bucket--low';
    }

    daysOverdue(obj: IReceivableList): number {
        if (Number.isFinite(Number(obj.DaysOverdue))) return Math.max(0, Number(obj.DaysOverdue));
        const dueDate = obj.DueDate ? new Date(obj.DueDate) : null;
        if (!dueDate || Number.isNaN(dueDate.getTime())) return 0;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today ? Math.floor((today.getTime() - dueDate.getTime()) / 86400000) : 0;
    }

    openActionMenu(menu: any, event: Event, obj: IReceivableList): void {
        this.openActionItems = [
            { label: 'View Receivable', icon: 'pi pi-eye', command: () => this.onViewClick(obj) },
            { label: 'View Invoice', icon: 'pi pi-file', disabled: !this.hasCustomerInvoice(obj), command: () => this.onInvoiceClick(obj) },
            { separator: true },
            { label: 'Record / Allocate Payment', icon: 'pi pi-credit-card', disabled: !this.canRecordPayment, command: () => this.recordOrAllocatePayment(obj) }
        ];
        menu.toggle(event);
    }

    exportOpenReceivables(): void {
        if (!this.isReceivablesWorklistMode || this.isExporting) return;

        const sort = this.sortOptions.find(option => option.key === this.selectedSortKey) || this.sortOptions[0];
        this.isExporting = true;
        this.receivableService.exportOpenReceivables({
            ...this.openReceivablesRequest(),
            SortBy: sort.field,
            IsDescending: sort.descending,
            Conditions: []
        }).subscribe({
            next: response => {
                const result = response?.data;
                const rows = result?.Records || [];
                const summary = result?.Summary || this.openSummary;
                downloadXlsx({
                    title: this.exportCaption,
                    reportingDate: new Date().toLocaleDateString(),
                    filters: this.openFiltersLabel(),
                    summary: this.openExportSummary(summary),
                    headers: ['Invoice Number', 'Customer', 'Lease Contract', 'Invoice Date', 'Due Date', 'Currency', 'Invoice Amount', 'Received Amount', 'Outstanding Amount', 'Days Overdue', ...(this.isOverdueReceivablesMode ? ['Ageing Bucket'] : []), 'Status'],
                    rows: rows.map((item: IReceivableList) => [
                        item.DocumentNo || '—', this.customerName(item), item.LeaseContractNumber || '—', this.formatDate(item.DocumentDate), this.formatDate(item.DueDate), item.CurrencyCode || '—',
                        Number(item.OriginalAmount || 0), Number(item.AllocatedAmount || 0), Number(item.OutstandingAmount || 0), this.daysOverdue(item), ...(this.isOverdueReceivablesMode ? [this.ageingBucketName(item)] : []), this.openStatusName(item)
                    ]),
                    fileName: `${this.isOverdueReceivablesMode ? 'overdue' : 'open'}-receivables-${this.fileDate(new Date())}.xlsx`,
                    sheetName: this.exportCaption
                });
                this.messageService.showSuccess(`${rows.length} ${this.isOverdueReceivablesMode ? 'overdue' : 'open'} receivable${rows.length === 1 ? '' : 's'} exported.`);
            },
            error: error => this.messageService.showError(error),
            complete: () => (this.isExporting = false)
        });
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
        return {
            customerPartyId: null,
            receivableStatus: null,
            dueDateRange: null,
            billingOrganisationId: null,
            currencyCode: null,
            leaseContractId: null,
            assetCategoryId: null,
            openStatus: null,
            ageingBucket: null,
            overdueOnly: this.isOverdueReceivablesMode === true
        };
    }

    protected override countActiveFilters(): number {
        const baseFilters = [
            this.filters.customerPartyId,
            this.filters.receivableStatus,
            this.filters.dueDateRange?.some(Boolean) ? 1 : 0,
            this.filters.billingOrganisationId,
            this.filters.currencyCode
        ];
        if (this.isReceivablesWorklistMode) {
            baseFilters.push(this.filters.leaseContractId, this.filters.assetCategoryId, this.filters.ageingBucket);
            if (!this.isOverdueReceivablesMode) baseFilters.push(this.filters.openStatus, this.filters.overdueOnly ? 1 : 0);
        }
        return baseFilters.filter((value) => !!value).length;
    }

    protected override createEmptyState(hasQueryOrFilters: boolean): ListEmptyState {
        if (this.isOverdueReceivablesMode) {
            return hasQueryOrFilters
                ? { icon: 'pi pi-search', title: 'No Matching Overdue Receivables', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
                : { icon: 'pi pi-check-circle', title: 'No Overdue Receivables', description: 'There are no unpaid receivables past their due date.' };
        }
        if (this.isOpenReceivablesMode) {
            return hasQueryOrFilters
                ? { icon: 'pi pi-search', title: 'No Matching Open Receivables', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
                : { icon: 'pi pi-check-circle', title: 'No Open Receivables', description: 'All eligible receivables are settled or no invoices are currently outstanding.' };
        }
        return hasQueryOrFilters
            ? { icon: 'pi pi-search', title: 'No Matching Receivables', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
            : { icon: 'pi pi-inbox', title: 'No Receivables Yet', description: 'Receivables will appear here once they are created.', actionLabel: 'Create Receivable' };
    }

    protected override getSearchParams(): ListFilterCondition[] {
        if (this.isReceivablesWorklistMode) return [];
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

    protected override getAdditionalSearchParameters(): Record<string, unknown> {
        return this.isReceivablesWorklistMode ? this.openReceivablesRequest() : {};
    }

    protected override getListContextKey(): string {
        return `${this.getTenantId()}:${this.isOverdueReceivablesMode ? 'overdue' : this.isOpenReceivablesMode ? 'open' : 'all'}`;
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
            dueDateRange: this.deserializeDateRange(filters?.dueDateRange),
            overdueOnly: this.isOverdueReceivablesMode || !!filters?.overdueOnly
        };
    }

    private loadLookupOptions(): void {
        this.lookupSubscription = forkJoin({
            customers: this.loggedInUserService.getEntityLookupOptions('parties').pipe(catchError(() => of([]))),
            organisations: this.loggedInUserService.getEntityLookupOptions('organisations').pipe(catchError(() => of([]))),
            contracts: this.isReceivablesWorklistMode ? this.loggedInUserService.getEntityLookupOptions('lease-contracts').pipe(catchError(() => of([]))) : of([]),
            assetCategories: this.isReceivablesWorklistMode ? this.loggedInUserService.getEntityLookupOptions('asset-categories').pipe(catchError(() => of([]))) : of([])
        }).subscribe((options) => {
            this.customerOptions = options.customers;
            this.organisationOptions = options.organisations;
            this.contractOptions = options.contracts;
            this.assetCategoryOptions = options.assetCategories;
        });
    }

    private openReceivablesRequest(): Record<string, unknown> {
        const [from, to] = this.filters.dueDateRange || [];
        return {
            OpenReceivables: true,
            SearchTerm: this.searchTerm.trim() || null,
            BillingOrganisationId: this.filters.billingOrganisationId,
            CustomerPartyId: this.filters.customerPartyId,
            LeaseContractId: this.filters.leaseContractId,
            AssetCategoryId: this.filters.assetCategoryId,
            OpenStatus: this.filters.openStatus,
            AgeingBucket: this.filters.ageingBucket,
            DueDateFrom: from ? this.loggedInUserService.formatDate(from) : null,
            DueDateTo: to ? this.loggedInUserService.formatDate(to) : null,
            OverdueOnly: this.isOverdueReceivablesMode || this.filters.overdueOnly
        };
    }

    private recordOrAllocatePayment(obj: IReceivableList): void {
        this.router.navigate(['/billing-finance/payments/receipts/create'], {
            queryParams: {
                customerPartyId: obj.CustomerPartyId,
                receivingOrganisationId: obj.BillingOrganisationId,
                currencyCode: obj.CurrencyCode,
                receivableId: obj.Id,
                returnUrl: this.isOverdueReceivablesMode ? '/billing-finance/receivables/overdue' : '/billing-finance/receivables/open'
            }
        });
    }

    private get canRecordPayment(): boolean {
        return this.permissionService.hasPermission('finance.paymentreceipt.create');
    }

    private hasCustomerInvoice(obj: IReceivableList): boolean {
        return String(obj.SourceDocumentType || '').replace(/[\s_-]/g, '').toUpperCase() === 'CUSTOMERINVOICE' && Number(obj.SourceDocumentId) > 0;
    }

    private openFiltersLabel(): string {
        const labels: string[] = [];
        if (this.searchTerm.trim()) labels.push(`Search: ${this.searchTerm.trim()}`);
        if (this.filters.billingOrganisationId) labels.push(`Organisation: ${this.lookupText(this.organisationOptions, this.filters.billingOrganisationId) || this.filters.billingOrganisationId}`);
        if (this.filters.customerPartyId) labels.push(`Customer: ${this.customerName({ CustomerPartyId: this.filters.customerPartyId } as IReceivableList)}`);
        if (this.filters.leaseContractId) labels.push(`Lease contract: ${this.lookupText(this.contractOptions, this.filters.leaseContractId) || this.filters.leaseContractId}`);
        if (this.filters.assetCategoryId) labels.push(`Asset category: ${this.lookupText(this.assetCategoryOptions, this.filters.assetCategoryId) || this.filters.assetCategoryId}`);
        if (this.filters.openStatus) labels.push(`Status: ${this.openStatusOptions.find(option => option.Value === this.filters.openStatus)?.Text || this.filters.openStatus}`);
        if (this.filters.ageingBucket) labels.push(`Ageing bucket: ${this.filters.ageingBucket.replace('_', '–').replace('PLUS', '+')}`);
        if (this.filters.dueDateRange?.length) labels.push(`Due date: ${this.filters.dueDateRange.map(value => this.formatDate(value)).join(' – ')}`);
        if (this.isOverdueReceivablesMode) labels.push('Overdue only');
        else if (this.filters.overdueOnly) labels.push('Overdue only');
        return labels.join('; ') || 'None';
    }

    private openExportSummary(summary: IOpenReceivablesSummary | null): Array<[string, string | number]> {
        if (!summary) return [];
        const currencyTotals: Array<[string, string | number]> = (summary.CurrencyTotals || []).flatMap(total => [
            [`Outstanding (${total.CurrencyCode || 'N/A'})`, Number(total.TotalOutstandingAmount || 0)] as [string, string | number],
            [`Overdue (${total.CurrencyCode || 'N/A'})`, Number(total.TotalOverdueAmount || 0)] as [string, string | number],
            [`Overdue 90+ (${total.CurrencyCode || 'N/A'})`, Number(total.Overdue90PlusAmount || 0)] as [string, string | number]
        ]);
        return [
            [this.isOverdueReceivablesMode ? 'Overdue receivables' : 'Open receivables', summary.OpenReceivablesCount || 0],
            ['Partially paid', summary.PartiallyPaidCount || 0],
            ['Customers with overdue payments', summary.OverdueCustomers || 0],
            ...currencyTotals
        ];
    }

    private formatDate(value: Date | string | null | undefined): string {
        if (!value) return '—';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
    }

    private fileDate(value: Date): string {
        return value.toISOString().slice(0, 10);
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
