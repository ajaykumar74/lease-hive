import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, forkJoin, of, Subscription } from 'rxjs';
import { PageEvent } from '@/shared/IBase';
import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { ReceivableService } from './receivable.service';
import {
    IReceivablesAgeingCustomer,
    IReceivablesAgeingInvoice,
    IReceivablesAgeingResult,
    IReceivablesAgeingSummary
} from './receivable';
import { downloadXlsx } from '@/views/reports/assets/utilization/xlsx-exporter';

interface AgeingFilters {
    billingOrganisationId: number | null;
    asOfDate: Date;
    customerPartyId: number | null;
    leaseContractId: number | null;
    assetCategoryId: number | null;
    overdueOnly: boolean;
}

interface AgeingSortOption {
    key: string;
    label: string;
    field: string;
    descending: boolean;
}

@Component({
    selector: 'app-receivables-ageing',
    standalone: false,
    templateUrl: './receivables-ageing.component.html',
    styleUrls: ['./receivables-ageing.component.css']
})
export class ReceivablesAgeingComponent implements OnInit, OnDestroy {
    readonly sortOptions: AgeingSortOption[] = [
        { key: 'outstanding-desc', label: 'Outstanding — High to Low', field: 'TotalOutstandingAmount', descending: true },
        { key: 'outstanding-asc', label: 'Outstanding — Low to High', field: 'TotalOutstandingAmount', descending: false },
        { key: 'customer-asc', label: 'Customer — A to Z', field: 'CustomerDisplayName', descending: false },
        { key: 'customer-desc', label: 'Customer — Z to A', field: 'CustomerDisplayName', descending: true },
        { key: 'not-due-desc', label: 'Not Due — High to Low', field: 'NotDueAmount', descending: true },
        { key: 'one-to-thirty-desc', label: '1–30 Days — High to Low', field: 'Days1To30Amount', descending: true },
        { key: 'thirty-one-to-sixty-desc', label: '31–60 Days — High to Low', field: 'Days31To60Amount', descending: true },
        { key: 'sixty-one-to-ninety-desc', label: '61–90 Days — High to Low', field: 'Days61To90Amount', descending: true },
        { key: 'ninety-plus-desc', label: '90+ Days — High to Low', field: 'Days90PlusAmount', descending: true }
    ];

    filters: AgeingFilters = this.createDefaultFilters();
    readonly maxAsOfDate = new Date();
    searchTerm = '';
    selectedSortKey = 'outstanding-desc';
    filterControlsVisible = false;
    isLoading = false;
    hasLoadError = false;
    isExporting = false;
    permission = {} as IPermission;
    records: IReceivablesAgeingCustomer[] = [];
    totalRecords = 0;
    summary: IReceivablesAgeingSummary | null = null;
    pgEvent: PageEvent = { first: 0, rows: 20, page: 0, pageCount: 0 } as PageEvent;
    customerOptions: ISelectItem[] = [];
    organisationOptions: ISelectItem[] = [];
    contractOptions: ISelectItem[] = [];
    assetCategoryOptions: ISelectItem[] = [];
    expandedCustomerKeys = new Set<string>();
    ageingChartData: any;
    ageingChartOptions: any;

    private reportSubscription?: Subscription;
    private lookupsSubscription?: Subscription;

    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private readonly receivableService: ReceivableService,
        private readonly loggedInUserService: LoggedInUserService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.loadLookupOptions();
        this.loadReport();
    }

    ngOnDestroy(): void {
        this.reportSubscription?.unsubscribe();
        this.lookupsSubscription?.unsubscribe();
    }

    get hasActiveFilters(): boolean {
        return !!(this.filters.billingOrganisationId || this.filters.customerPartyId || this.filters.leaseContractId || this.filters.assetCategoryId || this.filters.overdueOnly);
    }

    get activeFilterCount(): number {
        return [this.filters.billingOrganisationId, this.filters.customerPartyId, this.filters.leaseContractId, this.filters.assetCategoryId, this.filters.overdueOnly ? 1 : 0]
            .filter(value => !!value).length;
    }

    get hasChartData(): boolean {
        return (this.summary?.BucketTotals || []).some(total =>
            Number(total.NotDueAmount || 0) + Number(total.Days1To30Amount || 0) + Number(total.Days31To60Amount || 0) + Number(total.Days61To90Amount || 0) + Number(total.Days90PlusAmount || 0) > 0);
    }

    onToolbarItemClicked(key: string): void {
        if (key === 'Refresh') this.loadReport(true);
    }

    onSearch(): void {
        this.resetToFirstPage();
        this.loadReport();
    }

    clearSearch(): void {
        if (!this.searchTerm) return;
        this.searchTerm = '';
        this.resetToFirstPage();
        this.loadReport();
    }

    clearFilters(): void {
        this.filters = this.createDefaultFilters();
        this.resetToFirstPage();
        this.loadReport();
    }

    clearSearchAndFilters(): void {
        this.searchTerm = '';
        this.filters = this.createDefaultFilters();
        this.resetToFirstPage();
        this.loadReport();
    }

    toggleFilterControls(): void {
        this.filterControlsVisible = !this.filterControlsVisible;
    }

    onFiltersChanged(): void {
        this.resetToFirstPage();
        this.loadReport();
    }

    resetAsOfDate(): void {
        this.filters.asOfDate = this.createDefaultFilters().asOfDate;
        this.onFiltersChanged();
    }

    onSortChanged(): void {
        this.resetToFirstPage();
        this.loadReport();
    }

    pageChanged(event: Partial<PageEvent>): void {
        this.pgEvent = {
            first: event.first ?? 0,
            rows: event.rows ?? 20,
            page: event.page ?? 0,
            pageCount: event.pageCount ?? 0
        };
        this.loadReport();
    }

    toggleCustomer(customer: IReceivablesAgeingCustomer): void {
        const key = this.customerKey(customer);
        const next = new Set(this.expandedCustomerKeys);
        next.has(key) ? next.delete(key) : next.add(key);
        this.expandedCustomerKeys = next;
    }

    isCustomerExpanded(customer: IReceivablesAgeingCustomer): boolean {
        return this.expandedCustomerKeys.has(this.customerKey(customer));
    }

    onInvoiceClick(invoice: IReceivablesAgeingInvoice): void {
        if (this.isCustomerInvoice(invoice)) {
            this.router.navigate(['/billing-finance/invoices/view', invoice.SourceDocumentId]);
        }
    }

    exportAgeing(): void {
        if (this.isExporting) return;

        this.isExporting = true;
        this.receivableService.exportReceivablesAgeing(this.requestParameters()).pipe(finalize(() => (this.isExporting = false))).subscribe({
            next: response => {
                const result = response?.data as IReceivablesAgeingResult;
                const rows = result?.Records || [];
                downloadXlsx({
                    title: 'Receivables Ageing Analysis',
                    reportingDate: `As of ${this.formatDate(this.filters.asOfDate)}`,
                    filters: this.filterSummary(),
                    summary: this.exportSummary(result?.Summary),
                    headers: ['Customer', 'Currency', 'Not Due', '1–30', '31–60', '61–90', '90+', 'Total Outstanding', 'Invoice Count'],
                    rows: rows.map(row => [
                        row.CustomerDisplayName || '—', row.CurrencyCode || 'N/A', Number(row.NotDueAmount || 0), Number(row.Days1To30Amount || 0),
                        Number(row.Days31To60Amount || 0), Number(row.Days61To90Amount || 0), Number(row.Days90PlusAmount || 0),
                        Number(row.TotalOutstandingAmount || 0), Number(row.InvoiceCount || 0)
                    ]),
                    fileName: `receivables-ageing-${this.fileDate(this.filters.asOfDate)}.xlsx`,
                    sheetName: 'Ageing Analysis'
                });
                this.messageService.showSuccess(`${rows.length} customer ageing row${rows.length === 1 ? '' : 's'} exported.`);
            },
            error: error => this.messageService.showError(error)
        });
    }

    customerLabel(customer: IReceivablesAgeingCustomer): string {
        return customer.CustomerDisplayName || (customer.CustomerPartyId ? `Customer #${customer.CustomerPartyId}` : 'Unassigned customer');
    }

    formatAmount(value: number | null | undefined, currencyCode: string): string {
        const amount = Number(value || 0);
        const currency = (currencyCode || 'N/A').trim().toUpperCase();
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
        } catch {
            return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
        }
    }

    formatDate(value: Date | string | null | undefined): string {
        if (!value) return '—';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
    }

    loadReport(forceReload = false): void {
        if (this.isLoading && !forceReload) return;
        this.reportSubscription?.unsubscribe();
        this.isLoading = true;
        this.hasLoadError = false;
        this.expandedCustomerKeys = new Set();

        this.reportSubscription = this.receivableService.getReceivablesAgeing(this.requestParameters()).pipe(finalize(() => (this.isLoading = false))).subscribe({
            next: response => {
                const result = (response?.data || {}) as IReceivablesAgeingResult;
                this.records = result.Records || [];
                this.totalRecords = result.TotalRecords || 0;
                this.summary = result.Summary || { OverdueCustomers: 0, CurrencyTotals: [], BucketTotals: [] };
                this.permission = response?.permission || ({} as IPermission);
                this.rebuildChart();
            },
            error: error => {
                this.records = [];
                this.totalRecords = 0;
                this.summary = null;
                this.hasLoadError = true;
                this.messageService.showError(error);
            }
        });
    }

    private loadLookupOptions(): void {
        this.lookupsSubscription = forkJoin({
            customers: this.loggedInUserService.getEntityLookupOptions('parties').pipe(catchError(() => of([]))),
            organisations: this.loggedInUserService.getEntityLookupOptions('organisations').pipe(catchError(() => of([]))),
            contracts: this.loggedInUserService.getEntityLookupOptions('lease-contracts').pipe(catchError(() => of([]))),
            assetCategories: this.loggedInUserService.getEntityLookupOptions('asset-categories').pipe(catchError(() => of([])))
        }).subscribe(options => {
            this.customerOptions = options.customers;
            this.organisationOptions = options.organisations;
            this.contractOptions = options.contracts;
            this.assetCategoryOptions = options.assetCategories;
        });
    }

    private requestParameters(): Record<string, unknown> {
        const sort = this.sortOptions.find(option => option.key === this.selectedSortKey) || this.sortOptions[0];
        return {
            SearchTerm: this.searchTerm.trim() || null,
            BillingOrganisationId: this.filters.billingOrganisationId,
            CustomerPartyId: this.filters.customerPartyId,
            LeaseContractId: this.filters.leaseContractId,
            AssetCategoryId: this.filters.assetCategoryId,
            AsOfDate: this.loggedInUserService.formatDate(this.filters.asOfDate),
            OverdueOnly: this.filters.overdueOnly,
            Skip: this.pgEvent.first,
            Take: this.pgEvent.rows,
            SortBy: sort.field,
            IsDescending: sort.descending,
            Conditions: []
        };
    }

    private rebuildChart(): void {
        const bucketTotals = this.summary?.BucketTotals || [];
        const labels = ['Not Due', '1–30', '31–60', '61–90', '90+'];
        const styles = getComputedStyle(document.documentElement);
        const colors = [
            styles.getPropertyValue('--p-primary-color').trim() || '#0f766e',
            '#0ea5e9', '#f59e0b', '#f97316', '#dc2626'
        ];

        this.ageingChartData = bucketTotals.length === 1
            ? {
                labels,
                datasets: [{
                    label: bucketTotals[0].CurrencyCode || 'Currency',
                    data: this.bucketValues(bucketTotals[0]),
                    backgroundColor: colors,
                    borderRadius: 5,
                    maxBarThickness: 48
                }]
            }
            : {
                labels,
                datasets: bucketTotals.map((total, index) => ({
                    label: total.CurrencyCode || 'N/A',
                    data: this.bucketValues(total),
                    backgroundColor: colors[index % colors.length],
                    borderRadius: 4,
                    maxBarThickness: 36
                }))
            };

        this.ageingChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim() }, grid: { display: false } },
                y: { beginAtZero: true, ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim() }, grid: { color: styles.getPropertyValue('--p-content-border-color').trim() } }
            },
            plugins: {
                legend: { display: bucketTotals.length > 1, position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: (context: any) => this.formatAmount(Number(context.raw || 0), context.dataset.label || 'N/A')
                    }
                }
            }
        };
    }

    private bucketValues(total: IReceivablesAgeingSummary['BucketTotals'][number]): number[] {
        return [total.NotDueAmount, total.Days1To30Amount, total.Days31To60Amount, total.Days61To90Amount, total.Days90PlusAmount].map(value => Number(value || 0));
    }

    private createDefaultFilters(): AgeingFilters {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return { billingOrganisationId: null, asOfDate: today, customerPartyId: null, leaseContractId: null, assetCategoryId: null, overdueOnly: false };
    }

    private resetToFirstPage(): void {
        this.pgEvent = { ...this.pgEvent, first: 0, page: 0 };
    }

    private customerKey(customer: IReceivablesAgeingCustomer): string {
        return `${customer.CustomerPartyId}:${customer.CurrencyCode || 'N/A'}`;
    }

    isCustomerInvoice(invoice: IReceivablesAgeingInvoice): boolean {
        return String(invoice.SourceDocumentType || '').replace(/[\s_-]/g, '').toUpperCase() === 'CUSTOMERINVOICE' && Number(invoice.SourceDocumentId) > 0;
    }

    private filterSummary(): string {
        const labels: string[] = [`As of: ${this.formatDate(this.filters.asOfDate)}`];
        if (this.searchTerm.trim()) labels.push(`Search: ${this.searchTerm.trim()}`);
        if (this.filters.billingOrganisationId) labels.push(`Organisation: ${this.lookupText(this.organisationOptions, this.filters.billingOrganisationId) || this.filters.billingOrganisationId}`);
        if (this.filters.customerPartyId) labels.push(`Customer: ${this.lookupText(this.customerOptions, this.filters.customerPartyId) || this.filters.customerPartyId}`);
        if (this.filters.leaseContractId) labels.push(`Lease contract: ${this.lookupText(this.contractOptions, this.filters.leaseContractId) || this.filters.leaseContractId}`);
        if (this.filters.assetCategoryId) labels.push(`Asset category: ${this.lookupText(this.assetCategoryOptions, this.filters.assetCategoryId) || this.filters.assetCategoryId}`);
        if (this.filters.overdueOnly) labels.push('Overdue only');
        return labels.join('; ');
    }

    private exportSummary(summary: IReceivablesAgeingSummary | null | undefined): Array<[string, string | number]> {
        const totals = summary?.CurrencyTotals || [];
        return [
            ['Overdue customers', Number(summary?.OverdueCustomers || 0)],
            ...totals.flatMap(total => [
                [`Total outstanding (${total.CurrencyCode || 'N/A'})`, Number(total.TotalOutstandingAmount || 0)] as [string, string | number],
                [`Total overdue (${total.CurrencyCode || 'N/A'})`, Number(total.TotalOverdueAmount || 0)] as [string, string | number],
                [`Overdue 90+ (${total.CurrencyCode || 'N/A'})`, Number(total.Overdue90PlusAmount || 0)] as [string, string | number]
            ])
        ];
    }

    private lookupText(options: ISelectItem[], id: number): string | undefined {
        const option = options.find(item => Number((item as any).Id ?? (item as any).Value) === Number(id));
        return option ? String((option as any).Text ?? (option as any).Label ?? '') : undefined;
    }

    private fileDate(value: Date): string {
        return value.toISOString().slice(0, 10);
    }
}
