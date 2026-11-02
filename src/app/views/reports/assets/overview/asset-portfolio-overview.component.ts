import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AssetService } from '@/views/assets/asset/asset.service';
import { AssetAssignmentService } from '@/views/assets/assetAssignment/assetAssignment.service';
import { AssetCategoryService } from '@/views/assets/assetCategory/assetCategory.service';
import { AssetStatusService } from '@/views/assets/assetStatus/assetStatus.service';
import { LeaseContractService } from '@/views/leaseContracts/leaseContract/leaseContract.service';
import { LeaseContractAssetService } from '@/views/leaseContracts/leaseContractAsset/leaseContractAsset.service';
import { LeasePaymentScheduleService } from '@/views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule.service';
import { LeasePaymentScheduleLineService } from '@/views/leaseContracts/leasePaymentScheduleLine/leasePaymentScheduleLine.service';
import { MaintenanceWorkOrderService } from '@/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder.service';
import { AssetDowntimeService } from '@/views/maintenanceInsurances/assetDowntime/assetDowntime.service';
import { InsurancePolicyAssetService } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset.service';
import { OrganisationService } from '@/views/organisations/organisation/organisation.service';

interface CurrencyTotals {
    [currency: string]: number;
}

interface CategoryPortfolioRow {
    categoryId: number | null;
    category: string;
    totalAssets: number;
    leased: number;
    available: number;
    assetValue: CurrencyTotals;
    utilization: number;
}

interface StatusLegendItem {
    label: string;
    count: number;
    percentage: number;
    color: string;
}

@Component({
    selector: 'app-asset-portfolio-overview',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ChartModule, SelectModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './asset-portfolio-overview.component.html',
    styleUrl: './asset-portfolio-overview.component.scss'
})
export class AssetPortfolioOverviewComponent implements OnInit {
    private readonly assetService = inject(AssetService);
    private readonly assignmentService = inject(AssetAssignmentService);
    private readonly categoryService = inject(AssetCategoryService);
    private readonly statusService = inject(AssetStatusService);
    private readonly contractService = inject(LeaseContractService);
    private readonly contractAssetService = inject(LeaseContractAssetService);
    private readonly scheduleService = inject(LeasePaymentScheduleService);
    private readonly scheduleLineService = inject(LeasePaymentScheduleLineService);
    private readonly workOrderService = inject(MaintenanceWorkOrderService);
    private readonly downtimeService = inject(AssetDowntimeService);
    private readonly insuranceAssetService = inject(InsurancePolicyAssetService);
    private readonly organisationService = inject(OrganisationService);
    private readonly router = inject(Router);

    readonly periodOptions = [
        { label: 'Current month', value: 'current-month' },
        { label: 'Last 30 days', value: 'last-30-days' },
        { label: 'Last 90 days', value: 'last-90-days' },
        { label: 'Year to date', value: 'year-to-date' },
        { label: 'All time', value: 'all-time' }
    ];

    selectedPeriod = 'current-month';
    selectedOrganisationId: number | null = null;
    selectedCategoryId: number | null = null;
    isLoading = true;
    hasLoadError = false;

    assets: any[] = [];
    assignments: any[] = [];
    categories: any[] = [];
    statuses: any[] = [];
    contracts: any[] = [];
    contractAssets: any[] = [];
    schedules: any[] = [];
    scheduleLines: any[] = [];
    workOrders: any[] = [];
    downtimes: any[] = [];
    insuranceAssets: any[] = [];
    organisations: any[] = [];

    statusChartData: any;
    statusChartOptions: any;
    utilizationChartData: any;
    utilizationChartOptions: any;

    ngOnInit(): void {
        this.loadDashboard();
    }

    get organisationOptions(): any[] {
        return this.organisations
            .filter(item => this.isRecordActive(item))
            .map(item => ({ label: item.TradeName || item.LegalName || item.OrganisationCode || `Organisation ${item.Id}`, value: Number(item.Id) }))
            .sort((left, right) => left.label.localeCompare(right.label));
    }

    get categoryOptions(): any[] {
        return this.categories
            .filter(item => this.isRecordActive(item))
            .map(item => ({ label: item.CategoryName || item.CategoryCode || `Category ${item.Id}`, value: Number(item.Id) }))
            .sort((left, right) => left.label.localeCompare(right.label));
    }

    get scopedAssets(): any[] {
        const { end } = this.periodRange();
        return this.assets.filter(asset => {
            const matchesOrganisation = this.selectedOrganisationId === null || Number(asset.OwningOrganisationId) === this.selectedOrganisationId;
            const matchesCategory = this.selectedCategoryId === null || Number(asset.AssetCategoryId) === this.selectedCategoryId;
            return matchesOrganisation && matchesCategory && this.isRecordActive(asset) && this.isCurrentAt(asset, end);
        });
    }

    get leasedAssetIds(): Set<number> {
        const { end } = this.periodRange();
        const activeContractIds = new Set(this.contracts.filter(contract => this.isActiveContract(contract, end)).map(contract => Number(contract.Id)));
        const ids = new Set<number>();

        this.contractAssets.forEach(item => {
            const assetId = Number(item.AssetId);
            if (!assetId || !this.isRecordActive(item) || !this.isCurrentAt(item, end) || !this.isAllocationActive(item)) return;
            if (!activeContractIds.size || activeContractIds.has(Number(item.LeaseContractId))) ids.add(assetId);
        });

        this.assignments.filter(item => this.isCurrentAssignment(item, end) && this.isLeaseAssignment(item)).forEach(item => ids.add(Number(item.AssetId)));
        this.scopedAssets.filter(asset => this.isLeasedStatus(this.assetStatus(asset))).forEach(asset => ids.add(Number(asset.Id)));
        return ids;
    }

    get maintenanceAssetIds(): Set<number> {
        const { end } = this.periodRange();
        const ids = new Set<number>();
        this.workOrders.filter(item => this.isMaintenanceOpen(item, end)).forEach(item => ids.add(Number(item.AssetId)));
        this.downtimes.filter(item => this.isDowntimeActive(item, end)).forEach(item => ids.add(Number(item.AssetId)));
        this.scopedAssets.filter(asset => /maintenance|repair|service/.test(this.assetStatus(asset).toLowerCase())).forEach(asset => ids.add(Number(asset.Id)));
        return ids;
    }

    get leasedAssets(): any[] {
        const leasedIds = this.leasedAssetIds;
        return this.scopedAssets.filter(asset => leasedIds.has(Number(asset.Id)));
    }

    get maintainedAssets(): any[] {
        const maintenanceIds = this.maintenanceAssetIds;
        return this.scopedAssets.filter(asset => maintenanceIds.has(Number(asset.Id)));
    }

    get reservedAssets(): any[] {
        return this.scopedAssets.filter(asset => this.isReservedStatus(this.assetStatus(asset)) && !this.maintenanceAssetIds.has(Number(asset.Id)) && !this.leasedAssetIds.has(Number(asset.Id)));
    }

    get availableAssets(): any[] {
        const leasedIds = this.leasedAssetIds;
        const maintenanceIds = this.maintenanceAssetIds;
        return this.scopedAssets.filter(asset => this.asBoolean(asset.IsLeaseable)
            && !leasedIds.has(Number(asset.Id))
            && !maintenanceIds.has(Number(asset.Id))
            && !this.isReservedStatus(this.assetStatus(asset))
            && !this.isUnavailableStatus(this.assetStatus(asset)));
    }

    get utilizationRate(): number {
        const eligible = this.scopedAssets.filter(asset => this.asBoolean(asset.IsLeaseable) && !this.maintenanceAssetIds.has(Number(asset.Id)));
        return eligible.length ? this.leasedAssets.filter(asset => eligible.some(item => Number(item.Id) === Number(asset.Id))).length / eligible.length * 100 : 0;
    }

    get assetValueTotals(): CurrencyTotals {
        return this.totalByCurrency(this.scopedAssets, item => item.AcquisitionCost, item => item.AcquisitionCurrencyCode);
    }

    get rentalRevenueTotals(): CurrencyTotals {
        const { start, end } = this.periodRange();
        const scheduleById = new Map(this.schedules.map(item => [Number(item.Id), item]));
        const matchingContractIds = this.revenueContractIds();
        return this.totalByCurrency(
            this.scheduleLines.filter(line => {
                const dueDate = this.asDate(line.DueDate);
                const schedule = scheduleById.get(Number(line.LeasePaymentScheduleId));
                return !!dueDate && dueDate >= start && dueDate <= end && !!schedule && matchingContractIds.has(Number(schedule.LeaseContractId));
            }),
            item => item.RentalAmount,
            item => scheduleById.get(Number(item.LeasePaymentScheduleId))?.CurrencyCode
        );
    }

    get idleAssets(): any[] {
        return this.availableAssets.filter(asset => this.idleDays(asset) > 30);
    }

    get idleOver60Days(): any[] {
        return this.idleAssets.filter(asset => this.idleDays(asset) > 60);
    }

    get idleOver90Days(): any[] {
        return this.idleAssets.filter(asset => this.idleDays(asset) > 90);
    }

    get expiringContracts(): any[] {
        const { end } = this.periodRange();
        const limit = this.addDays(end, 30);
        return this.contracts.filter(contract => {
            const maturity = this.asDate(contract.MaturityDate);
            return this.isActiveContract(contract, end) && !!maturity && maturity >= end && maturity <= limit && this.contractMatchesFilters(contract);
        });
    }

    get expiringInsurance(): any[] {
        const { end } = this.periodRange();
        const limit = this.addDays(end, 30);
        const scopedIds = new Set(this.scopedAssets.map(item => Number(item.Id)));
        return this.insuranceAssets.filter(item => {
            const expiry = this.asDate(item.CoverageEndDate);
            return this.isRecordActive(item) && scopedIds.has(Number(item.AssetId)) && !!expiry && expiry >= end && expiry <= limit && !this.isClosedStatus(item.StatusCode);
        });
    }

    get categoryRows(): CategoryPortfolioRow[] {
        const categoryIds = new Set<number>(this.scopedAssets.map(asset => Number(asset.AssetCategoryId)).filter(Boolean));
        if (this.selectedCategoryId !== null) categoryIds.add(this.selectedCategoryId);
        const leasedIds = this.leasedAssetIds;
        const availableIds = new Set(this.availableAssets.map(item => Number(item.Id)));
        const rows = [...categoryIds].map(categoryId => {
            const assets = this.scopedAssets.filter(asset => Number(asset.AssetCategoryId) === categoryId);
            const eligible = assets.filter(asset => this.asBoolean(asset.IsLeaseable) && !this.maintenanceAssetIds.has(Number(asset.Id)));
            const leased = assets.filter(asset => leasedIds.has(Number(asset.Id)));
            return {
                categoryId,
                category: this.categoryNameById(categoryId),
                totalAssets: assets.length,
                leased: leased.length,
                available: assets.filter(asset => availableIds.has(Number(asset.Id))).length,
                assetValue: this.totalByCurrency(assets, item => item.AcquisitionCost, item => item.AcquisitionCurrencyCode),
                utilization: eligible.length ? leased.filter(asset => eligible.some(item => Number(item.Id) === Number(asset.Id))).length / eligible.length * 100 : 0
            };
        });
        return rows.sort((left, right) => right.totalAssets - left.totalAssets || left.category.localeCompare(right.category));
    }

    get statusLegend(): StatusLegendItem[] {
        const total = this.scopedAssets.length;
        const colors = this.statusColors();
        return this.statusGroups().map((group, index) => ({
            ...group,
            percentage: total ? group.count / total * 100 : 0,
            color: colors[index]
        }));
    }

    loadDashboard(): void {
        this.isLoading = true;
        this.hasLoadError = false;
        forkJoin({
            assets: this.assetService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            assignments: this.assignmentService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            categories: this.categoryService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            statuses: this.statusService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            contracts: this.contractService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            contractAssets: this.contractAssetService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            schedules: this.scheduleService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            scheduleLines: this.scheduleLineService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            workOrders: this.workOrderService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            downtimes: this.downtimeService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            insuranceAssets: this.insuranceAssetService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            organisations: this.organisationService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.assets = this.recordsOf(result.assets);
            this.assignments = this.recordsOf(result.assignments);
            this.categories = this.recordsOf(result.categories);
            this.statuses = this.recordsOf(result.statuses);
            this.contracts = this.recordsOf(result.contracts);
            this.contractAssets = this.recordsOf(result.contractAssets);
            this.schedules = this.recordsOf(result.schedules);
            this.scheduleLines = this.recordsOf(result.scheduleLines);
            this.workOrders = this.recordsOf(result.workOrders);
            this.downtimes = this.recordsOf(result.downtimes);
            this.insuranceAssets = this.recordsOf(result.insuranceAssets);
            this.organisations = this.recordsOf(result.organisations);
            this.rebuildCharts();
        });
    }

    applyFilters(): void {
        this.rebuildCharts();
    }

    clearFilters(): void {
        this.selectedPeriod = 'current-month';
        this.selectedOrganisationId = null;
        this.selectedCategoryId = null;
        this.rebuildCharts();
    }

    openAssetList(categoryId?: number | null): void {
        const queryParams = categoryId ? { categoryId } : undefined;
        this.router.navigate(['/business/assets'], { queryParams });
    }

    openContracts(): void {
        this.router.navigate(['/contracts']);
    }

    openAssignments(): void {
        this.router.navigate(['/business/assets/assignments']);
    }

    openMaintenance(): void {
        this.router.navigate(['/maintenance-insurance/maintenance/work-orders']);
    }

    openSchedules(): void {
        this.router.navigate(['/contracts/payment-schedules']);
    }

    openInsurance(): void {
        this.router.navigate(['/maintenance-insurance/insurance/policies']);
    }

    openAlert(alert: 'idle' | 'leases' | 'maintenance' | 'insurance'): void {
        const routes = {
            idle: () => this.openAssetList(),
            leases: () => this.openContracts(),
            maintenance: () => this.openMaintenance(),
            insurance: () => this.openInsurance()
        };
        routes[alert]();
    }

    exportToExcel(): void {
        const headings = ['Category', 'Total assets', 'Leased', 'Available', 'Asset value', 'Utilization %'];
        const rows = this.categoryRows.map(item => [
            item.category,
            item.totalAssets,
            item.leased,
            item.available,
            this.formatMoney(item.assetValue),
            `${item.utilization.toFixed(1)}%`
        ]);
        const csv = [headings, ...rows].map(row => row.map(value => this.csvCell(value)).join(',')).join('\r\n');
        const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `asset-portfolio-overview-${this.selectedPeriod}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
    }

    formatMoney(totals: CurrencyTotals): string {
        const entries = Object.entries(totals).filter(([, amount]) => Number.isFinite(amount) && amount !== 0);
        if (!entries.length) return '—';
        return entries.sort(([left], [right]) => left.localeCompare(right)).map(([currency, amount]) => this.formatCurrency(amount, currency)).join(' · ');
    }

    trackByCategory(_index: number, item: CategoryPortfolioRow): number | null {
        return item.categoryId;
    }

    private rebuildCharts(): void {
        this.buildStatusChart();
        this.buildUtilizationChart();
    }

    private buildStatusChart(): void {
        const groups = this.statusGroups();
        const styles = getComputedStyle(document.documentElement);
        this.statusChartData = {
            labels: groups.map(item => item.label),
            datasets: [{ data: groups.map(item => item.count), backgroundColor: this.statusColors(), borderWidth: 0, hoverOffset: 5 }]
        };
        this.statusChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '67%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const value = Number(context.raw || 0);
                            const total = this.scopedAssets.length;
                            return `${context.label}: ${value} (${total ? (value / total * 100).toFixed(1) : 0}%)`;
                        }
                    }
                }
            },
            color: styles.getPropertyValue('--p-text-color').trim()
        };
    }

    private buildUtilizationChart(): void {
        const rows = this.categoryRows;
        const styles = getComputedStyle(document.documentElement);
        this.utilizationChartData = {
            labels: rows.map(item => item.category),
            datasets: [{ label: 'Utilization', data: rows.map(item => Number(item.utilization.toFixed(1))), backgroundColor: this.cssColor('--p-primary-color', '#0f766e'), borderRadius: 6, maxBarThickness: 44 }]
        };
        this.utilizationChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim(), maxRotation: 35, minRotation: 0 }, grid: { display: false } },
                y: { beginAtZero: true, max: 100, ticks: { callback: (value: string | number) => `${value}%`, color: styles.getPropertyValue('--p-text-muted-color').trim() }, grid: { color: styles.getPropertyValue('--p-content-border-color').trim() } }
            },
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context: any) => `${context.raw}% utilized` } } }
        };
    }

    private statusGroups(): Array<{ label: string; count: number }> {
        const leasedIds = this.leasedAssetIds;
        const maintenanceIds = this.maintenanceAssetIds;
        const reservedIds = new Set(this.reservedAssets.map(item => Number(item.Id)));
        const availableIds = new Set(this.availableAssets.map(item => Number(item.Id)));
        const counts = { leased: 0, available: 0, reserved: 0, maintenance: 0, other: 0 };
        this.scopedAssets.forEach(asset => {
            const id = Number(asset.Id);
            if (maintenanceIds.has(id)) counts.maintenance++;
            else if (leasedIds.has(id)) counts.leased++;
            else if (reservedIds.has(id)) counts.reserved++;
            else if (availableIds.has(id)) counts.available++;
            else counts.other++;
        });
        return [
            { label: 'Leased', count: counts.leased },
            { label: 'Available', count: counts.available },
            { label: 'Reserved', count: counts.reserved },
            { label: 'Under Maintenance', count: counts.maintenance },
            { label: 'Other', count: counts.other }
        ];
    }

    private statusColors(): string[] {
        return [
            this.cssColor('--p-primary-color', '#0f766e'),
            this.cssColor('--p-cyan-500', '#06b6d4'),
            this.cssColor('--p-purple-500', '#8b5cf6'),
            this.cssColor('--p-orange-500', '#f97316'),
            this.cssColor('--p-surface-400', '#94a3b8')
        ];
    }

    private revenueContractIds(): Set<number> {
        const { end } = this.periodRange();
        const categoryMatches = this.selectedCategoryId === null
            ? null
            : new Set(this.contractAssets.filter(item => Number(item.AssetCategoryId) === this.selectedCategoryId).map(item => Number(item.LeaseContractId)));
        return new Set(this.contracts.filter(contract => {
            const organisationMatches = this.selectedOrganisationId === null || Number(contract.LessorOrganisationId) === this.selectedOrganisationId;
            return this.isRecordActive(contract) && organisationMatches && (!categoryMatches || categoryMatches.has(Number(contract.Id))) && this.isContractInScope(contract, end);
        }).map(contract => Number(contract.Id)));
    }

    private contractMatchesFilters(contract: any): boolean {
        if (this.selectedOrganisationId !== null && Number(contract.LessorOrganisationId) !== this.selectedOrganisationId) return false;
        if (this.selectedCategoryId === null) return true;
        return this.contractAssets.some(item => Number(item.LeaseContractId) === Number(contract.Id) && Number(item.AssetCategoryId) === this.selectedCategoryId);
    }

    private isActiveContract(contract: any, asOf: Date): boolean {
        const status = String(contract.LeaseContractStatusName || contract.StatusName || contract.StatusCode || '').toLowerCase();
        return this.isRecordActive(contract) && this.isContractInScope(contract, asOf) && !['cancel', 'terminate', 'expired', 'reject'].some(value => status.includes(value));
    }

    private isContractInScope(contract: any, asOf: Date): boolean {
        const commencement = this.asDate(contract.CommencementDate);
        const maturity = this.asDate(contract.MaturityDate);
        return (!commencement || commencement <= asOf) && (!maturity || maturity >= asOf);
    }

    private isAllocationActive(item: any): boolean {
        const status = String(item.AllocationStatusCode || '').toLowerCase();
        return !['unallocat', 'release', 'return', 'cancel', 'reject'].some(value => status.includes(value));
    }

    private isCurrentAssignment(item: any, asOf: Date): boolean {
        return this.isRecordActive(item) && this.isCurrentAt({ EffectiveFrom: item.AssignedFrom || item.EffectiveFrom, EffectiveTo: item.AssignedTo || item.EffectiveTo }, asOf);
    }

    private isLeaseAssignment(item: any): boolean {
        const reference = `${item.AssignmentType || ''} ${item.ReferenceType || ''}`.toLowerCase();
        return reference.includes('lease') || reference.includes('contract') || reference.includes('customer');
    }

    private isMaintenanceOpen(item: any, asOf: Date): boolean {
        const start = this.asDate(item.ActualStartAt || item.PlannedStartAt);
        return this.isRecordActive(item) && !this.isClosedStatus(item.WorkOrderStatusCode) && (!start || start <= asOf);
    }

    private isDowntimeActive(item: any, asOf: Date): boolean {
        const start = this.asDate(item.DowntimeStartAt);
        const end = this.asDate(item.DowntimeEndAt);
        return this.isRecordActive(item) && (!start || start <= asOf) && (!end || end >= asOf);
    }

    private isClosedStatus(value: any): boolean {
        const status = String(value || '').toLowerCase();
        return ['complete', 'closed', 'cancel', 'resolved', 'released', 'expired'].some(item => status.includes(item));
    }

    private isCurrentAt(item: any, asOf: Date): boolean {
        const from = this.asDate(item.EffectiveFrom || item.InServiceDate || item.AcquisitionDate);
        const to = this.asDate(item.EffectiveTo);
        return (!from || from <= asOf) && (!to || to >= asOf);
    }

    private isRecordActive(item: any): boolean {
        const status = String(item?.RecordStatus || '').toLowerCase();
        return !['inactive', 'deleted', 'cancelled'].includes(status);
    }

    private assetStatus(asset: any): string {
        return this.statuses.find(item => Number(item.Id) === Number(asset.AssetStatusId))?.StatusName
            || asset.AssetStatusDisplayName
            || asset.AssetStatusName
            || asset.StatusName
            || '';
    }

    private isLeasedStatus(value: string): boolean {
        return /leased|allocated|deployed|on rent/.test(value.toLowerCase());
    }

    private isReservedStatus(value: string): boolean {
        return /reserv|hold/.test(value.toLowerCase());
    }

    private isUnavailableStatus(value: string): boolean {
        return /retired|disposed|lost|inactive|write.?off/.test(value.toLowerCase());
    }

    private categoryNameById(categoryId: number): string {
        return this.categories.find(item => Number(item.Id) === categoryId)?.CategoryName
            || this.scopedAssets.find(item => Number(item.AssetCategoryId) === categoryId)?.AssetCategoryDisplayName
            || `Category ${categoryId}`;
    }

    private totalByCurrency(items: any[], amountSelector: (item: any) => any, currencySelector: (item: any) => any): CurrencyTotals {
        return items.reduce((totals, item) => {
            const amount = Number(amountSelector(item) || 0);
            if (!Number.isFinite(amount) || amount === 0) return totals;
            const currency = String(currencySelector(item) || 'Unspecified').toUpperCase();
            totals[currency] = (totals[currency] || 0) + amount;
            return totals;
        }, {} as CurrencyTotals);
    }

    private idleDays(asset: any): number {
        const { end } = this.periodRange();
        const assignmentDates = this.assignments.filter(item => Number(item.AssetId) === Number(asset.Id))
            .map(item => this.asDate(item.AssignedTo || item.EffectiveTo || item.AssignedFrom || item.EffectiveFrom))
            .filter((date): date is Date => !!date && date <= end);
        const activityDate = assignmentDates.sort((left, right) => right.getTime() - left.getTime())[0]
            || this.asDate(asset.InServiceDate || asset.AcquisitionDate || asset.CreatedDateTime);
        return activityDate ? Math.max(0, Math.floor((end.getTime() - activityDate.getTime()) / 86_400_000)) : 0;
    }

    private periodRange(): { start: Date; end: Date } {
        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        let start = new Date(end.getFullYear(), end.getMonth(), 1);
        if (this.selectedPeriod === 'last-30-days') start = this.addDays(end, -29);
        if (this.selectedPeriod === 'last-90-days') start = this.addDays(end, -89);
        if (this.selectedPeriod === 'year-to-date') start = new Date(end.getFullYear(), 0, 1);
        if (this.selectedPeriod === 'all-time') start = new Date(1970, 0, 1);
        return { start, end };
    }

    private addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    private formatCurrency(amount: number, currency: string): string {
        if (currency === 'UNSPECIFIED') return `${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} (currency not set)`;
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
        } catch {
            return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
        }
    }

    private csvCell(value: string | number): string {
        return `"${String(value).replace(/"/g, '""')}"`;
    }

    private cssColor(variable: string, fallback: string): string {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback;
    }

    private asBoolean(value: any): boolean {
        return value === true || value === 1 || String(value).toLowerCase() === 'true';
    }

    private asDate(value: any): Date | null {
        if (!value) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    private failedFeed() {
        this.hasLoadError = true;
        return of([]);
    }

    private recordsOf(response: any): any[] {
        const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response;
        return Array.isArray(records) ? records : [];
    }
}
