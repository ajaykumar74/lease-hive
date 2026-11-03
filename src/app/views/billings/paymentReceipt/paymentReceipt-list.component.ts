import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of, Subscription } from 'rxjs';

import { ISelectItem } from '@/shared/ISelectItem';
import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { ListPageController } from '@/shared/list-page.controller';
import { ListEmptyState, ListFilterCondition, ListSortOption } from '@/shared/list-page.models';
import { MessageComponent } from '@/shared/message.component';
import { IPaymentReceiptList } from './paymentReceipt';
import { PaymentReceiptService } from './paymentReceipt.service';

interface PaymentReceiptFilters {
    customerPartyId: number | null;
    receiptStatusId: number | null;
    receiptDateRange: Date[] | null;
    paymentMethod: string | null;
    currencyCode: string | null;
}

@Component({
    selector: 'app-payment-receipt-list',
    standalone: false,
    templateUrl: './paymentReceipt-list.component.html'
})
export class PaymentReceiptListComponent extends ListPageController<IPaymentReceiptList, PaymentReceiptFilters> implements OnInit, AfterViewInit, OnDestroy {
    override readonly sortOptions: ListSortOption[] = [
        { key: 'recent', label: 'Recently Created', field: 'CreatedDateTime', descending: true },
        { key: 'receipt-date-desc', label: 'Receipt Date — Newest First', field: 'ReceiptDate', descending: true },
        { key: 'receipt-date-asc', label: 'Receipt Date — Oldest First', field: 'ReceiptDate', descending: false },
        { key: 'receipt-asc', label: 'Receipt No. — Ascending', field: 'ReceiptNo', descending: false },
        { key: 'receipt-desc', label: 'Receipt No. — Descending', field: 'ReceiptNo', descending: true },
        { key: 'customer-asc', label: 'Customer — A to Z', field: 'CustomerDisplayName', descending: false },
        { key: 'amount-desc', label: 'Amount — High to Low', field: 'ReceiptAmount', descending: true },
        { key: 'amount-asc', label: 'Amount — Low to High', field: 'ReceiptAmount', descending: false },
        { key: 'status-asc', label: 'Status — A to Z', field: 'ReceiptStatusDisplayName', descending: false }
    ];
    override selectedSortKey = 'recent';

    customerOptions: ISelectItem[] = [];
    receiptStatusOptions: ISelectItem[] = [];
    paymentMethodOptions: ISelectItem[] = [];
    currencyOptions: ISelectItem[] = [];

    private lookupSubscription?: Subscription;

    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        paymentReceiptService: PaymentReceiptService,
        private readonly router: Router,
        private readonly loggedInUserService: LoggedInUserService
    ) {
        super(paymentReceiptService);
    }

    ngOnInit(): void {
        this.paymentMethodOptions = this.loggedInUserService.getPicklistOptions('PaymentMethod');
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

    onViewClick(obj: IPaymentReceiptList): void {
        this.router.navigate(['/billing-finance/payments/receipts/view', obj.Id]);
    }

    onEditClick(obj: IPaymentReceiptList): void {
        if (this.permission.CanUpdate) {
            this.router.navigate(['/billing-finance/payments/receipts/edit', obj.Id]);
        }
    }

    onOptionItemClicked(key: string): void {
        if (key === 'Create') {
            this.router.navigate(['/billing-finance/payments/receipts/create']);
        } else if (key === 'Refresh') {
            this.refreshList();
        }
    }

    customerName(obj: IPaymentReceiptList): string {
        return obj.CustomerDisplayName || this.lookupText(this.customerOptions, obj.CustomerPartyId) || '—';
    }

    statusName(obj: IPaymentReceiptList): string {
        return obj.ReceiptStatusDisplayName || this.lookupText(this.receiptStatusOptions, obj.ReceiptStatusId) || '—';
    }

    paymentMethodName(obj: IPaymentReceiptList): string {
        return this.paymentMethodOptions.find((option) => option.Value === obj.PaymentMethod)?.Text || obj.PaymentMethod || '—';
    }

    getStatusClass(obj: IPaymentReceiptList): string {
        const status = this.statusName(obj).toLowerCase();
        if (status.includes('confirm') || status.includes('allocat') || status.includes('applied')) return 'status-active';
        if (status.includes('cancel') || status.includes('reverse') || status.includes('reject')) return 'status-closed';
        return 'status-pending';
    }

    protected override createEmptyFilters(): PaymentReceiptFilters {
        return { customerPartyId: null, receiptStatusId: null, receiptDateRange: null, paymentMethod: null, currencyCode: null };
    }

    protected override countActiveFilters(): number {
        return [
            this.filters.customerPartyId,
            this.filters.receiptStatusId,
            this.filters.receiptDateRange?.some(Boolean) ? 1 : 0,
            this.filters.paymentMethod,
            this.filters.currencyCode
        ].filter((value) => !!value).length;
    }

    protected override createEmptyState(hasQueryOrFilters: boolean): ListEmptyState {
        return hasQueryOrFilters
            ? { icon: 'pi pi-search', title: 'No Matching Receipts', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
            : { icon: 'pi pi-inbox', title: 'No Payment Receipts Yet', description: 'Payment receipts will appear here once they are created.', actionLabel: 'Create Receipt' };
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
            conditions.push({ DBName: 'ReceiptNo', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'ReceiptSearch' });
            conditions.push({ DBName: 'CustomerDisplayName', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'ReceiptSearch' });
            conditions.push({ DBName: 'ExternalTransactionRef', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'ReceiptSearch' });
        }

        if (this.filters.customerPartyId) {
            conditions.push({ DBName: 'CustomerPartyId', Value: String(this.filters.customerPartyId), DataType: DataType.Int, Operator: Operator.EqualTo });
        }
        if (this.filters.receiptStatusId) {
            conditions.push({ DBName: 'ReceiptStatusId', Value: String(this.filters.receiptStatusId), DataType: DataType.Int, Operator: Operator.EqualTo });
        }
        if (this.filters.paymentMethod) {
            conditions.push({ DBName: 'PaymentMethod', Value: this.filters.paymentMethod, DataType: DataType.Text, Operator: Operator.EqualTo });
        }
        if (this.filters.currencyCode) {
            conditions.push({ DBName: 'CurrencyCode', Value: this.filters.currencyCode, DataType: DataType.Text, Operator: Operator.EqualTo });
        }

        const [from, to] = this.filters.receiptDateRange || [];
        if (from) {
            conditions.push({ DBName: 'ReceiptDate', Value: String(this.loggedInUserService.formatDate(from)), DataType: DataType.Date, Operator: Operator.GreaterThanEqualTo });
        }
        if (to) {
            conditions.push({ DBName: 'ReceiptDate', Value: String(this.loggedInUserService.formatDate(to)), DataType: DataType.Date, Operator: Operator.LessThanEqualTo });
        }
        return conditions;
    }

    protected override getListContextKey(): string {
        return this.getTenantId();
    }

    protected override reportListError(error: unknown): void {
        this.messageService.showError(error);
    }

    protected override cloneFilters(filters: PaymentReceiptFilters): PaymentReceiptFilters {
        return { ...filters, receiptDateRange: filters.receiptDateRange ? [...filters.receiptDateRange] : null };
    }

    protected override restoreFilters(filters: PaymentReceiptFilters | null | undefined): PaymentReceiptFilters {
        return {
            ...this.createEmptyFilters(),
            ...filters,
            receiptDateRange: this.deserializeDateRange(filters?.receiptDateRange)
        };
    }

    private loadLookupOptions(): void {
        this.lookupSubscription = forkJoin({
            customers: this.loggedInUserService.getEntityLookupOptions('parties').pipe(catchError(() => of([]))),
            statuses: this.loggedInUserService.getEntityLookupOptions('receipt-statuses').pipe(catchError(() => of([])))
        }).subscribe((options) => {
            this.customerOptions = options.customers;
            this.receiptStatusOptions = options.statuses;
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
