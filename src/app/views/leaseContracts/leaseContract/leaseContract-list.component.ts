import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of, Subscription } from 'rxjs';

import { ISelectItem } from '@/shared/ISelectItem';
import { CombineCriteriaType, DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { ListPageController } from '@/shared/list-page.controller';
import { ListEmptyState, ListFilterCondition, ListSortOption } from '@/shared/list-page.models';
import { MessageComponent } from '@/shared/message.component';
import { ILeaseContract } from './leaseContract';
import { LeaseContractService } from './leaseContract.service';

interface LeaseContractFilters {
    customerPartyId: number | null;
    leaseContractStatusId: number | null;
    lessorOrganisationId: number | null;
    commencementRange: Date[] | null;
    maturityRange: Date[] | null;
}

interface LeaseContractListItem extends ILeaseContract {
    CustomerPartyDisplayName?: string;
    CustomerPartyName?: string;
    CustomerName?: string;
    LeaseContractStatusName?: string;
    LessorOrganisationDisplayName?: string;
    LessorOrganisationName?: string;
}

@Component({
    selector: 'app-lease-contract-list',
    standalone: false,
    templateUrl: './leaseContract-list.component.html'
})
export class LeaseContractListComponent extends ListPageController<LeaseContractListItem, LeaseContractFilters> implements OnInit, AfterViewInit, OnDestroy {
    override readonly sortOptions: ListSortOption[] = [
        { key: 'recent', label: 'Recently Created', field: 'CreatedDateTime', descending: true },
        { key: 'contract-asc', label: 'Contract No. — Ascending', field: 'ContractNo', descending: false },
        { key: 'contract-desc', label: 'Contract No. — Descending', field: 'ContractNo', descending: true },
        { key: 'customer-asc', label: 'Customer — A to Z', field: 'CustomerPartyDisplayName', descending: false },
        { key: 'commencement-desc', label: 'Commencement — Newest First', field: 'CommencementDate', descending: true },
        { key: 'commencement-asc', label: 'Commencement — Oldest First', field: 'CommencementDate', descending: false },
        { key: 'maturity-asc', label: 'Maturity — Earliest First', field: 'MaturityDate', descending: false },
        { key: 'maturity-desc', label: 'Maturity — Latest First', field: 'MaturityDate', descending: true },
        { key: 'status-asc', label: 'Status — A to Z', field: 'LeaseContractStatusName', descending: false }
    ];
    override selectedSortKey = 'recent';

    customerOptions: ISelectItem[] = [];
    contractStatusOptions: ISelectItem[] = [];
    organisationOptions: ISelectItem[] = [];

    private lookupSubscription?: Subscription;

    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        leaseContractService: LeaseContractService,
        private readonly router: Router,
        private readonly loggedInUserService: LoggedInUserService
    ) {
        super(leaseContractService);
    }

    ngOnInit(): void {
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

    onViewClick(obj: LeaseContractListItem): void {
        this.router.navigate(['/contracts/view', obj.Id]);
    }

    onEditClick(obj: LeaseContractListItem): void {
        if (this.permission.CanUpdate && this.isEditable(obj)) {
            this.router.navigate(['/contracts/edit', obj.Id]);
        }
    }

    onOptionItemClicked(key: string): void {
        if (key === 'Create') {
            this.router.navigate(['/contracts/create']);
        } else if (key === 'Refresh') {
            this.refreshList();
        }
    }

    contractNumber(obj: LeaseContractListItem): string {
        return obj.ContractNo || obj.LeaseContractId || '—';
    }

    customerName(obj: LeaseContractListItem): string {
        return obj.CustomerPartyDisplayName || obj.CustomerPartyName || obj.CustomerName || this.lookupText(this.customerOptions, obj.CustomerPartyId) || '—';
    }

    organisationName(obj: LeaseContractListItem): string {
        return obj.LessorOrganisationDisplayName || obj.LessorOrganisationName || this.lookupText(this.organisationOptions, obj.LessorOrganisationId) || '—';
    }

    statusName(obj: LeaseContractListItem): string {
        return obj.LeaseContractStatusName || this.lookupText(this.contractStatusOptions, obj.LeaseContractStatusId) || '—';
    }

    getStatusClass(obj: LeaseContractListItem): string {
        const status = this.statusName(obj).toLowerCase();
        if (status.includes('active') || status.includes('execut') || status.includes('complete')) return 'status-active';
        if (status.includes('cancel') || status.includes('terminat') || status.includes('reject') || status.includes('expire')) return 'status-closed';
        return 'status-pending';
    }

    isEditable(obj: LeaseContractListItem): boolean {
        const status = this.statusName(obj).toLowerCase();
        return !['executed', 'active', 'terminated', 'cancelled', 'closed', 'expired'].some((lockedStatus) => status.includes(lockedStatus));
    }

    protected override createEmptyFilters(): LeaseContractFilters {
        return { customerPartyId: null, leaseContractStatusId: null, lessorOrganisationId: null, commencementRange: null, maturityRange: null };
    }

    protected override countActiveFilters(): number {
        return [
            this.filters.customerPartyId,
            this.filters.leaseContractStatusId,
            this.filters.lessorOrganisationId,
            this.filters.commencementRange?.some(Boolean) ? 1 : 0,
            this.filters.maturityRange?.some(Boolean) ? 1 : 0
        ].filter((value) => !!value).length;
    }

    protected override createEmptyState(hasQueryOrFilters: boolean): ListEmptyState {
        return hasQueryOrFilters
            ? { icon: 'pi pi-search', title: 'No Matching Contracts', description: 'Try adjusting your search or filter criteria.', actionLabel: 'Clear Search & Filters' }
            : { icon: 'pi pi-inbox', title: 'No Lease Contracts Yet', description: 'Lease contracts will appear here once they are created.', actionLabel: 'Create Contract' };
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
            conditions.push({ DBName: 'ContractNo', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'ContractSearch' });
            conditions.push({ DBName: 'ContractTitle', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'ContractSearch' });
            conditions.push({ DBName: 'CustomerPartyDisplayName', Value: searchTerm, DataType: DataType.Text, Operator: Operator.Contains, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'ContractSearch' });
            this.customerOptions
                .filter((option) => option.Text?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
                .forEach((option) => conditions.push({ DBName: 'CustomerPartyId', Value: String(option.Id), DataType: DataType.Int, Operator: Operator.EqualTo, CombineCriteria: CombineCriteriaType.CombineOR, GroupName: 'ContractSearch' }));
        }

        if (this.filters.customerPartyId) {
            conditions.push({ DBName: 'CustomerPartyId', Value: String(this.filters.customerPartyId), DataType: DataType.Int, Operator: Operator.EqualTo });
        }
        if (this.filters.leaseContractStatusId) {
            conditions.push({ DBName: 'LeaseContractStatusId', Value: String(this.filters.leaseContractStatusId), DataType: DataType.Int, Operator: Operator.EqualTo });
        }
        if (this.filters.lessorOrganisationId) {
            conditions.push({ DBName: 'LessorOrganisationId', Value: String(this.filters.lessorOrganisationId), DataType: DataType.Int, Operator: Operator.EqualTo });
        }

        this.addDateRangeConditions(conditions, 'CommencementDate', this.filters.commencementRange);
        this.addDateRangeConditions(conditions, 'MaturityDate', this.filters.maturityRange);
        return conditions;
    }

    protected override getListContextKey(): string {
        return this.getTenantId();
    }

    protected override reportListError(error: unknown): void {
        this.messageService.showError(error);
    }

    protected override cloneFilters(filters: LeaseContractFilters): LeaseContractFilters {
        return {
            ...filters,
            commencementRange: filters.commencementRange ? [...filters.commencementRange] : null,
            maturityRange: filters.maturityRange ? [...filters.maturityRange] : null
        };
    }

    protected override restoreFilters(filters: LeaseContractFilters | null | undefined): LeaseContractFilters {
        return {
            ...this.createEmptyFilters(),
            ...filters,
            commencementRange: this.deserializeDateRange(filters?.commencementRange),
            maturityRange: this.deserializeDateRange(filters?.maturityRange)
        };
    }

    private loadLookupOptions(): void {
        this.lookupSubscription = forkJoin({
            customers: this.loggedInUserService.getEntityLookupOptions('parties').pipe(catchError(() => of([]))),
            statuses: this.loggedInUserService.getEntityLookupOptions('lease-contract-statuses').pipe(catchError(() => of([]))),
            organisations: this.loggedInUserService.getEntityLookupOptions('organisations').pipe(catchError(() => of([])))
        }).subscribe((options) => {
            this.customerOptions = options.customers;
            this.contractStatusOptions = options.statuses;
            this.organisationOptions = options.organisations;
        });
    }

    private addDateRangeConditions(conditions: ListFilterCondition[], field: string, range: Date[] | null): void {
        const [from, to] = range || [];
        if (from) {
            conditions.push({ DBName: field, Value: String(this.loggedInUserService.formatDate(from)), DataType: DataType.Date, Operator: Operator.GreaterThanEqualTo });
        }
        if (to) {
            conditions.push({ DBName: field, Value: String(this.loggedInUserService.formatDate(to)), DataType: DataType.Date, Operator: Operator.LessThanEqualTo });
        }
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
