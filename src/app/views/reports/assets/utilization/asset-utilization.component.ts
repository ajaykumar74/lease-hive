import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AssetService } from '@/views/assets/asset/asset.service';
import { AssetAssignmentService } from '@/views/assets/assetAssignment/assetAssignment.service';
import { AssetCategoryService } from '@/views/assets/assetCategory/assetCategory.service';
import { AssetStatusService } from '@/views/assets/assetStatus/assetStatus.service';
import { AssetStatusHistoryService } from '@/views/assets/assetStatusHistory/assetStatusHistory.service';
import { AssetTypeService } from '@/views/assets/assetType/assetType.service';
import { LeaseContractService } from '@/views/leaseContracts/leaseContract/leaseContract.service';
import { LeaseContractAssetService } from '@/views/leaseContracts/leaseContractAsset/leaseContractAsset.service';
import { MaintenanceWorkOrderService } from '@/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder.service';
import { AssetDowntimeService } from '@/views/maintenanceInsurances/assetDowntime/assetDowntime.service';
import { OrganisationService } from '@/views/organisations/organisation/organisation.service';
import { OrganisationUnitService } from '@/views/organisations/organisationUnit/organisationUnit.service';
import { downloadXlsx } from './xlsx-exporter';

type DerivedStatus = 'Leased' | 'Available' | 'Reserved' | 'Maintenance' | 'Other';

interface CurrencyTotals { [currency: string]: number; }

interface UtilizationRow {
    asset: any;
    assetNumber: string;
    assetName: string;
    category: string;
    organisation: string;
    status: DerivedStatus;
    customer: string;
    contract: string;
    lastLeaseEnd: Date | null;
    idleDays: number | null;
    eligible: boolean;
    acquisitionValue: number;
    currency: string;
}

@Component({
    selector: 'app-asset-utilization',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ChartModule, DatePickerModule, InputTextModule, PaginatorModule, SelectModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './asset-utilization.component.html',
    styleUrl: './asset-utilization.component.scss'
})
export class AssetUtilizationComponent implements OnInit {
    private readonly assetService = inject(AssetService);
    private readonly assignmentService = inject(AssetAssignmentService);
    private readonly categoryService = inject(AssetCategoryService);
    private readonly typeService = inject(AssetTypeService);
    private readonly statusService = inject(AssetStatusService);
    private readonly statusHistoryService = inject(AssetStatusHistoryService);
    private readonly contractService = inject(LeaseContractService);
    private readonly contractAssetService = inject(LeaseContractAssetService);
    private readonly workOrderService = inject(MaintenanceWorkOrderService);
    private readonly downtimeService = inject(AssetDowntimeService);
    private readonly organisationService = inject(OrganisationService);
    private readonly unitService = inject(OrganisationUnitService);
    private readonly router = inject(Router);

    readonly statusOptions = [
        { label: 'All statuses', value: 'all' },
        { label: 'Leased', value: 'Leased' },
        { label: 'Available', value: 'Available' },
        { label: 'Reserved', value: 'Reserved' },
        { label: 'Under maintenance', value: 'Maintenance' }
    ];
    readonly agingOptions = [
        { label: 'All idle ages', value: 'all' },
        { label: '0–30 days', value: '0-30' },
        { label: '31–60 days', value: '31-60' },
        { label: '61–90 days', value: '61-90' },
        { label: 'Over 90 days', value: '90+' }
    ];
    readonly sortOptions = [
        { label: 'Idle days: highest first', value: 'idle-desc' },
        { label: 'Asset number: A to Z', value: 'asset-asc' },
        { label: 'Asset number: Z to A', value: 'asset-desc' },
        { label: 'Acquisition value: highest first', value: 'value-desc' },
        { label: 'Last lease end: newest first', value: 'lease-end-desc' }
    ];

    isLoading = true;
    hasLoadError = false;
    filtersVisible = true;
    searchTerm = '';
    appliedSearchTerm = '';
    selectedOrganisationId: number | null = null;
    selectedOrganisationUnitId: number | null = null;
    selectedCategoryId: number | null = null;
    selectedTypeId: number | null = null;
    selectedStatus = 'all';
    selectedIdleAging = 'all';
    reportingDate = this.today();
    selectedSort = 'idle-desc';
    first = 0;
    rows = 10;

    assets: any[] = [];
    assignments: any[] = [];
    categories: any[] = [];
    types: any[] = [];
    statuses: any[] = [];
    statusHistory: any[] = [];
    contracts: any[] = [];
    contractAssets: any[] = [];
    workOrders: any[] = [];
    downtimes: any[] = [];
    organisations: any[] = [];
    organisationUnits: any[] = [];
    utilizationChartData: any;
    utilizationChartOptions: any;
    agingChartData: any;
    agingChartOptions: any;

    ngOnInit(): void {
        this.loadReport();
    }

    get organisationOptions(): any[] {
        return this.organisations.filter(item => this.isActive(item)).map(item => ({
            label: item.TradeName || item.LegalName || item.OrganisationCode || `Organisation ${item.Id}`,
            value: Number(item.Id)
        })).sort((left, right) => left.label.localeCompare(right.label));
    }

    get organisationUnitOptions(): any[] {
        return this.organisationUnits.filter(item => this.isActive(item) && (this.selectedOrganisationId === null || Number(item.OrganisationId) === this.selectedOrganisationId)).map(item => ({
            label: item.UnitName || item.UnitCode || `Unit ${item.Id}`,
            value: Number(item.Id)
        })).sort((left, right) => left.label.localeCompare(right.label));
    }

    get categoryOptions(): any[] {
        return this.categories.filter(item => this.isActive(item)).map(item => ({
            label: item.CategoryName || item.CategoryCode || `Category ${item.Id}`,
            value: Number(item.Id)
        })).sort((left, right) => left.label.localeCompare(right.label));
    }

    get typeOptions(): any[] {
        return this.types.filter(item => this.isActive(item) && (this.selectedCategoryId === null || Number(item.AssetCategoryId) === this.selectedCategoryId)).map(item => ({
            label: item.AssetTypeName || item.AssetTypeCode || `Type ${item.Id}`,
            value: Number(item.Id)
        })).sort((left, right) => left.label.localeCompare(right.label));
    }

    get reportRows(): UtilizationRow[] {
        return this.assets.filter(asset => this.assetMatchesFilters(asset)).map(asset => this.buildRow(asset)).filter(row => {
            const statusMatches = this.selectedStatus === 'all' || row.status === this.selectedStatus;
            return statusMatches && this.idleAgingMatches(row) && this.searchMatches(row);
        });
    }

    get sortedRows(): UtilizationRow[] {
        const rows = [...this.reportRows];
        const compareText = (left: string, right: string) => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
        if (this.selectedSort === 'asset-asc') return rows.sort((left, right) => compareText(left.assetNumber, right.assetNumber));
        if (this.selectedSort === 'asset-desc') return rows.sort((left, right) => compareText(right.assetNumber, left.assetNumber));
        if (this.selectedSort === 'value-desc') return rows.sort((left, right) => right.acquisitionValue - left.acquisitionValue);
        if (this.selectedSort === 'lease-end-desc') return rows.sort((left, right) => this.timeOf(right.lastLeaseEnd) - this.timeOf(left.lastLeaseEnd));
        return rows.sort((left, right) => (right.idleDays ?? -1) - (left.idleDays ?? -1) || compareText(left.assetNumber, right.assetNumber));
    }

    get pagedRows(): UtilizationRow[] {
        return this.sortedRows.slice(this.first, this.first + this.rows);
    }

    get totalEligibleAssets(): number {
        return this.reportRows.filter(row => row.eligible).length;
    }

    get leasedRows(): UtilizationRow[] {
        return this.reportRows.filter(row => row.eligible && row.status === 'Leased');
    }

    get idleRows(): UtilizationRow[] {
        return this.reportRows.filter(row => row.status === 'Available' && row.idleDays !== null);
    }

    get utilizationRate(): number {
        return this.totalEligibleAssets ? this.leasedRows.length / this.totalEligibleAssets * 100 : 0;
    }

    get averageIdleDays(): number {
        return this.idleRows.length ? this.idleRows.reduce((total, row) => total + (row.idleDays || 0), 0) / this.idleRows.length : 0;
    }

    get idleValueTotals(): CurrencyTotals {
        return this.currencyTotals(this.idleRows);
    }

    loadReport(): void {
        this.isLoading = true;
        this.hasLoadError = false;
        forkJoin({
            assets: this.assetService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            assignments: this.assignmentService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            categories: this.categoryService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            types: this.typeService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            statuses: this.statusService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            statusHistory: this.statusHistoryService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            contracts: this.contractService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            contractAssets: this.contractAssetService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            workOrders: this.workOrderService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            downtimes: this.downtimeService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            organisations: this.organisationService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            organisationUnits: this.unitService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.assets = this.recordsOf(result.assets);
            this.assignments = this.recordsOf(result.assignments);
            this.categories = this.recordsOf(result.categories);
            this.types = this.recordsOf(result.types);
            this.statuses = this.recordsOf(result.statuses);
            this.statusHistory = this.recordsOf(result.statusHistory);
            this.contracts = this.recordsOf(result.contracts);
            this.contractAssets = this.recordsOf(result.contractAssets);
            this.workOrders = this.recordsOf(result.workOrders);
            this.downtimes = this.recordsOf(result.downtimes);
            this.organisations = this.recordsOf(result.organisations);
            this.organisationUnits = this.recordsOf(result.organisationUnits);
            this.refreshReport();
        });
    }

    onOrganisationChange(): void {
        this.selectedOrganisationUnitId = null;
        this.refreshReport();
    }

    onCategoryChange(): void {
        this.selectedTypeId = null;
        this.refreshReport();
    }

    refreshReport(): void {
        this.appliedSearchTerm = this.searchTerm.trim();
        this.first = 0;
        this.rebuildCharts();
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.appliedSearchTerm = '';
        this.selectedOrganisationId = null;
        this.selectedOrganisationUnitId = null;
        this.selectedCategoryId = null;
        this.selectedTypeId = null;
        this.selectedStatus = 'all';
        this.selectedIdleAging = 'all';
        this.reportingDate = this.today();
        this.selectedSort = 'idle-desc';
        this.first = 0;
        this.rebuildCharts();
    }

    onPageChange(event: { first?: number; rows?: number }): void {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? this.rows;
    }

    onSortChange(): void {
        this.first = 0;
    }

    openAsset(row: UtilizationRow): void {
        this.router.navigate(['/business/assets/view', row.asset.Id]);
    }

    exportToExcel(): void {
        const reportingDate = this.formatDate(this.reportingDate);
        downloadXlsx({
            title: 'Asset Utilization & Idle Aging Report',
            reportingDate,
            filters: this.appliedFiltersLabel(),
            headers: ['Asset Number', 'Asset Name', 'Category', 'Organisation', 'Current Status', 'Customer', 'Lease Contract', 'Last Lease End / Return Date', 'Idle Days', 'Acquisition Value'],
            rows: this.sortedRows.map(row => [
                row.assetNumber,
                row.assetName,
                row.category,
                row.organisation,
                row.status,
                row.customer,
                row.contract,
                this.formatDate(row.lastLeaseEnd),
                row.idleDays ?? '—',
                this.formatAssetValue(row)
            ]),
            fileName: `asset-utilization-idle-aging-${this.fileDate(this.reportingDate)}.xlsx`,
            sheetName: 'Utilization & Idle Aging'
        });
    }

    formatCurrencyTotals(totals: CurrencyTotals): string {
        const entries = Object.entries(totals).filter(([, amount]) => amount !== 0);
        return entries.length ? entries.sort(([left], [right]) => left.localeCompare(right)).map(([currency, amount]) => this.formatCurrency(amount, currency)).join(' · ') : '—';
    }

    formatAssetValue(row: UtilizationRow): string {
        return row.acquisitionValue ? this.formatCurrency(row.acquisitionValue, row.currency) : '—';
    }

    statusSeverity(status: DerivedStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        if (status === 'Available') return 'success';
        if (status === 'Leased') return 'info';
        if (status === 'Maintenance') return 'warn';
        if (status === 'Reserved') return 'secondary';
        return 'danger';
    }

    private rebuildCharts(): void {
        const categoryMap = new Map<string, { eligible: number; leased: number }>();
        this.reportRows.forEach(row => {
            if (!row.eligible) return;
            const current = categoryMap.get(row.category) || { eligible: 0, leased: 0 };
            current.eligible++;
            if (row.status === 'Leased') current.leased++;
            categoryMap.set(row.category, current);
        });
        const categoryGroups = [...categoryMap.entries()].sort((left, right) => left[0].localeCompare(right[0]));
        const aging = this.agingGroups();
        const styles = getComputedStyle(document.documentElement);
        this.utilizationChartData = {
            labels: categoryGroups.map(([category]) => category),
            datasets: [{ label: 'Utilization', data: categoryGroups.map(([, values]) => values.eligible ? Number((values.leased / values.eligible * 100).toFixed(1)) : 0), backgroundColor: this.cssColor('--p-primary-color', '#0f766e'), borderRadius: 6, maxBarThickness: 42 }]
        };
        this.utilizationChartOptions = {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim(), maxRotation: 35 }, grid: { display: false } },
                y: { beginAtZero: true, max: 100, ticks: { callback: (value: string | number) => `${value}%`, color: styles.getPropertyValue('--p-text-muted-color').trim() }, grid: { color: styles.getPropertyValue('--p-content-border-color').trim() } }
            },
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context: any) => `${context.raw}% utilized` } } }
        };
        this.agingChartData = {
            labels: aging.map(item => item.label),
            datasets: [{ data: aging.map(item => item.count), backgroundColor: [this.cssColor('--p-cyan-500', '#06b6d4'), this.cssColor('--p-blue-500', '#3b82f6'), this.cssColor('--p-orange-500', '#f97316'), this.cssColor('--p-red-500', '#ef4444')], borderWidth: 0 }]
        };
        this.agingChartOptions = { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, color: styles.getPropertyValue('--p-text-color').trim() } } } };
    }

    private assetMatchesFilters(asset: any): boolean {
        const asOf = this.endOfDay(this.reportingDate);
        return this.isActive(asset)
            && this.isCurrentAt(asset, asOf)
            && (this.selectedOrganisationId === null || Number(asset.OwningOrganisationId) === this.selectedOrganisationId)
            && (this.selectedOrganisationUnitId === null || Number(asset.ResponsibleOrganisationUnitId) === this.selectedOrganisationUnitId)
            && (this.selectedCategoryId === null || Number(asset.AssetCategoryId) === this.selectedCategoryId)
            && (this.selectedTypeId === null || Number(asset.AssetTypeId) === this.selectedTypeId);
    }

    private buildRow(asset: any): UtilizationRow {
        const asOf = this.endOfDay(this.reportingDate);
        const assetId = Number(asset.Id);
        const statusAtDate = this.assetStatusAt(asset, asOf);
        const eligible = this.asBoolean(asset.IsLeaseable) && !this.isIneligibleStatus(statusAtDate);
        const maintenance = this.isMaintenance(asset, asOf, statusAtDate);
        const contractAsset = this.currentContractAsset(assetId, asOf);
        const assignment = this.currentLeaseAssignment(assetId, asOf);
        const isLeased = !!contractAsset || !!assignment || this.isLeasedStatus(statusAtDate);
        const status: DerivedStatus = maintenance ? 'Maintenance' : isLeased ? 'Leased' : this.isReservedStatus(statusAtDate) ? 'Reserved' : eligible ? 'Available' : 'Other';
        const contract = contractAsset ? this.contractLabel(contractAsset.LeaseContractId) : assignment ? this.contractLabel(assignment.ReferenceId) : '—';
        const customer = assignment?.PartyDisplayName || assignment?.CurrentPartyDisplayName || (assignment?.PartyId ? `Customer ${assignment.PartyId}` : '—');
        const lastLeaseEnd = this.lastLeaseEnd(assetId, asOf);
        const idleDays = status === 'Available' ? this.idleDays(asset, lastLeaseEnd, asOf) : null;
        return {
            asset,
            assetNumber: asset.AssetNo || asset.AssetId || `Asset ${assetId}`,
            assetName: asset.AssetName || asset.AssetDescription || asset.PrimarySerialNo || 'Not recorded',
            category: this.categoryLabel(asset),
            organisation: this.organisationLabel(asset.OwningOrganisationId),
            status,
            customer,
            contract,
            lastLeaseEnd,
            idleDays,
            eligible,
            acquisitionValue: Number(asset.AcquisitionCost || 0),
            currency: asset.AcquisitionCurrencyCode || 'Unspecified'
        };
    }

    private currentContractAsset(assetId: number, asOf: Date): any | undefined {
        return this.contractAssets.find(item => Number(item.AssetId) === assetId && this.isActive(item) && this.isCurrentAt(item, asOf) && this.allocationIsActive(item) && this.contractIsActive(this.contractById(item.LeaseContractId), asOf));
    }

    private currentLeaseAssignment(assetId: number, asOf: Date): any | undefined {
        return this.assignments.find(item => Number(item.AssetId) === assetId && this.isActive(item) && this.isCurrentAt({ EffectiveFrom: item.AssignedFrom || item.EffectiveFrom, EffectiveTo: item.AssignedTo || item.EffectiveTo }, asOf) && this.isLeaseAssignment(item));
    }

    private lastLeaseEnd(assetId: number, asOf: Date): Date | null {
        const dates = [
            ...this.contractAssets.filter(item => Number(item.AssetId) === assetId).map(item => this.asDate(item.EffectiveTo)),
            ...this.assignments.filter(item => Number(item.AssetId) === assetId).map(item => this.asDate(item.AssignedTo || item.EffectiveTo))
        ].filter((date): date is Date => !!date && date <= asOf);
        return dates.sort((left, right) => right.getTime() - left.getTime())[0] || null;
    }

    private idleDays(asset: any, lastLeaseEnd: Date | null, asOf: Date): number {
        const availableFrom = lastLeaseEnd || this.asDate(asset.EffectiveFrom || asset.InServiceDate || asset.AcquisitionDate || asset.CreatedDateTime);
        return availableFrom ? Math.max(0, Math.floor((asOf.getTime() - availableFrom.getTime()) / 86_400_000)) : 0;
    }

    private idleAgingMatches(row: UtilizationRow): boolean {
        if (this.selectedIdleAging === 'all') return true;
        const days = row.idleDays;
        if (days === null) return false;
        if (this.selectedIdleAging === '0-30') return days <= 30;
        if (this.selectedIdleAging === '31-60') return days >= 31 && days <= 60;
        if (this.selectedIdleAging === '61-90') return days >= 61 && days <= 90;
        return days > 90;
    }

    private searchMatches(row: UtilizationRow): boolean {
        const term = this.appliedSearchTerm.toLowerCase();
        return !term || [row.assetNumber, row.assetName, row.category, row.organisation, row.status, row.customer, row.contract].some(value => value.toLowerCase().includes(term));
    }

    private agingGroups(): Array<{ label: string; count: number }> {
        const days = this.idleRows.map(row => row.idleDays || 0);
        return [
            { label: '0–30 days', count: days.filter(value => value <= 30).length },
            { label: '31–60 days', count: days.filter(value => value >= 31 && value <= 60).length },
            { label: '61–90 days', count: days.filter(value => value >= 61 && value <= 90).length },
            { label: 'Over 90 days', count: days.filter(value => value > 90).length }
        ];
    }

    private isMaintenance(asset: any, asOf: Date, status: string): boolean {
        const id = Number(asset.Id);
        return /maintenance|repair|service/.test(status.toLowerCase())
            || this.workOrders.some(item => Number(item.AssetId) === id && this.isActive(item) && !this.isClosedStatus(item.WorkOrderStatusCode) && (!this.asDate(item.PlannedStartAt || item.ActualStartAt) || this.asDate(item.PlannedStartAt || item.ActualStartAt)! <= asOf))
            || this.downtimes.some(item => Number(item.AssetId) === id && this.isActive(item) && this.isCurrentAt({ EffectiveFrom: item.DowntimeStartAt, EffectiveTo: item.DowntimeEndAt }, asOf));
    }

    private assetStatusAt(asset: any, asOf: Date): string {
        const history = this.statusHistory.filter(item => Number(item.AssetId) === Number(asset.Id) && this.isActive(item) && this.isCurrentAt(item, asOf)).sort((left, right) => this.timeOf(right.EffectiveFrom) - this.timeOf(left.EffectiveFrom))[0];
        if (history) return this.statuses.find(item => Number(item.Id) === Number(history.ToStatusId))?.StatusName || history.ToStatusDisplayName || '';
        return this.statuses.find(item => Number(item.Id) === Number(asset.AssetStatusId))?.StatusName || asset.AssetStatusDisplayName || asset.AssetStatusName || '';
    }

    private contractIsActive(contract: any, asOf: Date): boolean {
        if (!contract || !this.isActive(contract)) return false;
        const status = String(contract.LeaseContractStatusName || contract.StatusName || contract.StatusCode || '').toLowerCase();
        return !/cancel|terminate|expired|reject/.test(status) && this.isCurrentAt({ EffectiveFrom: contract.CommencementDate, EffectiveTo: contract.MaturityDate }, asOf);
    }

    private allocationIsActive(item: any): boolean {
        return !/unallocat|release|return|cancel|reject/.test(String(item.AllocationStatusCode || '').toLowerCase());
    }

    private isLeaseAssignment(item: any): boolean {
        return /lease|contract|customer/.test(`${item.AssignmentType || ''} ${item.ReferenceType || ''}`.toLowerCase());
    }

    private isLeasedStatus(status: string): boolean { return /leased|allocated|deployed|on rent/.test(status.toLowerCase()); }
    private isReservedStatus(status: string): boolean { return /reserv|hold/.test(status.toLowerCase()); }
    private isIneligibleStatus(status: string): boolean { return /retired|disposed|lost|inactive|write.?off/.test(status.toLowerCase()); }
    private isClosedStatus(status: any): boolean { return /complete|closed|cancel|resolved|released|expired/.test(String(status || '').toLowerCase()); }

    private currencyTotals(rows: UtilizationRow[]): CurrencyTotals {
        return rows.reduce((totals, row) => {
            if (row.acquisitionValue) totals[row.currency] = (totals[row.currency] || 0) + row.acquisitionValue;
            return totals;
        }, {} as CurrencyTotals);
    }

    private categoryLabel(asset: any): string {
        return this.categories.find(item => Number(item.Id) === Number(asset.AssetCategoryId))?.CategoryName || asset.AssetCategoryDisplayName || 'Unclassified';
    }

    private organisationLabel(organisationId: any): string {
        const organisation = this.organisations.find(item => Number(item.Id) === Number(organisationId));
        return organisation?.TradeName || organisation?.LegalName || organisation?.OrganisationCode || 'Not recorded';
    }

    private contractLabel(contractId: any): string {
        const contract = this.contractById(contractId);
        return contract?.ContractNo || contract?.ContractTitle || '—';
    }

    private contractById(contractId: any): any | undefined {
        return this.contracts.find(item => Number(item.Id) === Number(contractId));
    }

    private appliedFiltersLabel(): string {
        const values = [
            this.selectedOrganisationId === null ? 'All organisations' : this.organisationLabel(this.selectedOrganisationId),
            this.selectedOrganisationUnitId === null ? 'All units' : this.organisationUnitOptions.find(item => item.value === this.selectedOrganisationUnitId)?.label || 'Selected unit',
            this.selectedCategoryId === null ? 'All categories' : this.categoryOptions.find(item => item.value === this.selectedCategoryId)?.label || 'Selected category',
            this.selectedTypeId === null ? 'All types' : this.typeOptions.find(item => item.value === this.selectedTypeId)?.label || 'Selected type',
            this.statusOptions.find(item => item.value === this.selectedStatus)?.label || 'All statuses',
            this.agingOptions.find(item => item.value === this.selectedIdleAging)?.label || 'All idle ages'
        ];
        return values.join(' | ');
    }

    private isActive(item: any): boolean {
        const status = String(item?.RecordStatus || item?.Status || '').toLowerCase();
        return !['inactive', 'deleted', 'cancelled'].includes(status);
    }

    private isCurrentAt(item: any, asOf: Date): boolean {
        const from = this.asDate(item.EffectiveFrom || item.InServiceDate || item.AcquisitionDate);
        const to = this.asDate(item.EffectiveTo);
        return (!from || from <= asOf) && (!to || to >= asOf);
    }

    private endOfDay(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    }

    today(): Date {
        const value = new Date();
        return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    private fileDate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    formatDate(value: Date | null): string {
        return value ? new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(value) : '—';
    }

    private formatCurrency(amount: number, currency: string): string {
        if (currency.toLowerCase() === 'unspecified') return `${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} (currency not set)`;
        try { return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount); }
        catch { return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`; }
    }

    private cssColor(variable: string, fallback: string): string {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback;
    }

    private asBoolean(value: any): boolean { return value === true || value === 1 || String(value).toLowerCase() === 'true'; }
    private asDate(value: any): Date | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
    private timeOf(value: Date | null): number { return value?.getTime() || 0; }
    private failedFeed() { this.hasLoadError = true; return of([]); }
    private recordsOf(response: any): any[] { const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response; return Array.isArray(records) ? records : []; }
}
