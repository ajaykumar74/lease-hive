import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { BillingRunService } from './billingRun.service';
import { IBillingRun } from './billingRun';
import { PageEvent } from '@/shared/IBase';
import { BillingRunStatusService } from '../billingRunStatus/billingRunStatus.service';

type BillingRunView = 'cards' | 'list';

@Component({
    selector: 'app-billing-run-list',
    standalone: false,
    templateUrl: './billingRun-list.component.html',
    styleUrls: ['./billingRun-list.component.css']
})
export class BillingRunListComponent implements OnInit {
    constructor(
        private billingRunService: BillingRunService,
        private billingRunStatusService: BillingRunStatusService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    pgEvent: PageEvent = { page: 0, first: 0, rows: 10 } as PageEvent;
    lstMain: IBillingRun[] = [];
    totalNoOfRecords = 0;
    sortBy = 'BillingDate';
    IsDescending = true;
    isLoading = false;
    isTriggeringRecurringBilling = false;
    permission = {} as IPermission;
    leaseContractId: number | null = null;
    view: BillingRunView = 'cards';
    actionMenuItems: MenuItem[] = [];
    readonly skeletonCards = [1, 2, 3];

    objSearch: {
        SearchTerm: string;
        BillingDateRange: Date[] | null;
        RunType: string | null;
        BillingRunStatusId: number | null;
    } = this.emptySearch();

    readonly runTypeOptions = [
        { label: 'All run types', value: null },
        { label: 'Scheduled', value: 'SCHEDULED' },
        { label: 'Ad hoc', value: 'ADHOC' }
    ];
    billingRunStatusOptions: Array<{ label: string; value: number | null }> = [{ label: 'All statuses', value: null }];
    readonly sortOptions = [
        { label: 'Billing date: Latest first', value: 'latest' },
        { label: 'Billing date: Oldest first', value: 'oldest' }
    ];

    @ViewChild(SpinnerComponent) spinner!: SpinnerComponent;
    @ViewChild(MessageComponent) messageService!: MessageComponent;

    ngOnInit(): void {
        const contractId = Number(this.activatedRoute.snapshot.queryParamMap.get('leaseContractId'));
        this.leaseContractId = Number.isInteger(contractId) && contractId > 0 ? contractId : null;

        if (!this.leaseContractId && this.billingRunService.CacheData.IsLoaded) {
            this.objSearch = this.billingRunService.CacheData.objSearch || this.emptySearch();
            this.permission = this.billingRunService.CacheData.permission || this.permission;
        }

        this.loadBillingRunStatusOptions();
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.searchData(this.pgEvent, !!this.leaseContractId || !this.billingRunService.CacheData.IsLoaded), 0);
    }

    get sortDirection(): string {
        return this.IsDescending ? 'latest' : 'oldest';
    }

    setView(view: BillingRunView): void {
        this.view = view;
    }

    applyFilters(): void {
        this.resetToFirstPage();
        this.searchData(this.pgEvent, true);
    }

    clearSearch(): void {
        this.objSearch = this.emptySearch();
        this.resetToFirstPage();
        this.searchData(this.pgEvent, true);
    }

    onSortChanged(value: string): void {
        this.IsDescending = value !== 'oldest';
        this.resetToFirstPage();
        this.searchData(this.pgEvent, true);
    }

    pageChanged(event: { page?: number; first?: number; rows?: number }): void {
        this.pgEvent = {
            page: event.page ?? 0,
            first: event.first ?? 0,
            rows: event.rows ?? this.pgEvent.rows ?? 10
        } as PageEvent;
        this.searchData(this.pgEvent, true);
    }

    searchData(pgEvent: PageEvent, isReload: boolean): void {
        const page = Number.isInteger(pgEvent?.page) ? pgEvent.page : 0;
        const rows = pgEvent?.rows || 10;
        const first = Number.isInteger(pgEvent?.first) ? pgEvent.first : page * rows;
        this.pgEvent = { page, first, rows } as PageEvent;

        if (!isReload && this.billingRunService.CacheData.IsLoaded && this.billingRunService.CacheData.CurrentPage === page) {
            this.setListData(this.billingRunService.CacheData.Data, this.billingRunService.CacheData.TotalRecords);
            return;
        }

        const [billingDateFrom, billingDateTo] = this.billingDateRange();
        const searchParam = {
            Skip: first,
            Take: rows,
            SortBy: this.sortBy,
            IsDescending: this.IsDescending,
            LeaseContractId: this.leaseContractId,
            SearchTerm: this.objSearch.SearchTerm,
            BillingDateFrom: billingDateFrom,
            BillingDateTo: billingDateTo,
            RunType: this.objSearch.RunType,
            BillingRunStatusId: this.objSearch.BillingRunStatusId
        };

        this.isLoading = true;
        this.billingRunService.search(searchParam).subscribe({
            next: (res) => {
                this.permission = res.permission || this.permission;
                this.setListData(res.data?.Records || [], res.data?.TotalRecords || 0);
                this.billingRunService.setCache(res.data || { Records: [], TotalRecords: 0 }, this.permission, this.objSearch, page);
            },
            error: (err) => {
                this.lstMain = [];
                this.totalNoOfRecords = 0;
                this.messageService?.showError(err);
                this.isLoading = false;
            },
            complete: () => (this.isLoading = false)
        });
    }

    triggerRecurringBilling(): void {
        if (this.isTriggeringRecurringBilling) return;

        this.isTriggeringRecurringBilling = true;
        this.billingRunService.triggerAutoRecurringBilling().subscribe({
            next: (response) => {
                const result = response?.data || {};
                const message =
                    response?.Message || response?.message || 'Recurring billing completed. ' + (result.RunsCreated ?? result.runsCreated ?? 0) + ' run(s) created and ' + (result.RunsValidated ?? result.runsValidated ?? 0) + ' validated.';
                this.messageService?.showSuccess(message);
                this.resetToFirstPage();
                this.searchData(this.pgEvent, true);
            },
            error: (err) => {
                this.messageService?.showError(err);
                this.isTriggeringRecurringBilling = false;
            },
            complete: () => (this.isTriggeringRecurringBilling = false)
        });
    }

    viewDetails(obj: IBillingRun): void {
        this.router.navigate(['/billing-finance/billing/runs/view', obj.Id]);
    }

    edit(obj: IBillingRun): void {
        this.router.navigate(['/billing-finance/billing/runs/edit', obj.Id]);
    }

    viewInvoices(obj: IBillingRun): void {
        this.router.navigate(['/billing-finance/invoices'], { queryParams: { billingRunId: obj.Id } });
    }

    createBillingRun(): void {
        this.router.navigate(['/billing-finance/billing/runs/create']);
    }

    openActions(menu: Menu, event: Event, obj: IBillingRun): void {
        this.actionMenuItems = [
            { label: 'View details', icon: 'pi pi-eye', command: () => this.viewDetails(obj) },
            { label: 'View invoices', icon: 'pi pi-file', command: () => this.viewInvoices(obj) }
        ];
        menu.toggle(event);
    }

    billingRunNumber(obj: IBillingRun): string {
        return obj.BillingRunId || obj.BillingRunNo || 'Billing run #' + obj.Id;
    }

    organisationName(obj: IBillingRun): string {
        return obj.BillingOrganisationName || 'Organisation #' + obj.BillingOrganisationId;
    }

    approvedBy(obj: IBillingRun): string {
        if (obj.ApprovedByUserName) return obj.ApprovedByUserName;
        return obj.ApprovedByUserId > 0 ? 'User #' + obj.ApprovedByUserId : 'Not approved';
    }

    workflowStatus(obj: IBillingRun): string {
        return obj.BillingRunStatusCode || 'Status #' + obj.BillingRunStatusId;
    }

    statusClass(obj: IBillingRun): string {
        switch ((obj.BillingRunStatusCode || '').toUpperCase()) {
            case 'APPROVED':
                return 'is-approved';
            case 'EXECUTED':
            case 'ISSUED':
                return 'is-executed';
            case 'VALIDATED':
                return 'is-validated';
            case 'DRAFT':
                return 'is-draft';
            default:
                return 'is-default';
        }
    }

    trackById(_: number, obj: IBillingRun): number {
        return obj.Id;
    }

    private loadBillingRunStatusOptions(): void {
        this.billingRunStatusService.GetAll(false).subscribe({
            next: (response) => {
                const statuses = response?.data || response || [];
                this.billingRunStatusOptions = [
                    { label: 'All statuses', value: null },
                    ...statuses
                        .filter((status: any) => status?.Id > 0)
                        .map((status: any) => ({
                            label: status.StatusName || status.StatusCode || 'Status #' + status.Id,
                            value: status.Id
                        }))
                ];
            }
        });
    }

    private setListData(data: IBillingRun[], totalRecords: number): void {
        this.lstMain = data || [];
        this.totalNoOfRecords = totalRecords || 0;
    }

    private resetToFirstPage(): void {
        this.pgEvent = { page: 0, first: 0, rows: this.pgEvent.rows || 10 } as PageEvent;
    }

    private billingDateRange(): [string | null, string | null] {
        const dates = this.objSearch.BillingDateRange || [];
        return [this.toDateOnly(dates[0]), this.toDateOnly(dates[1])];
    }

    private toDateOnly(value?: Date): string | null {
        if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    private emptySearch() {
        return { SearchTerm: '', BillingDateRange: null, RunType: null, BillingRunStatusId: null };
    }
}
