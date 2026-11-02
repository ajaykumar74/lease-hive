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
import { LocationService } from '@/views/organisations/location/location.service';
import { PartyService } from '@/views/parties/party/party.service';
import { downloadXlsx } from '../utilization/xlsx-exporter';

type AssetStatus = 'Leased' | 'Available' | 'Reserved' | 'Maintenance' | 'Other';
type AllocationStatus = 'Allocated' | 'Unallocated' | 'Reserved';

interface StatusAllocationRow {
    asset: any;
    assetNumber: string;
    assetName: string;
    category: string;
    type: string;
    organisation: string;
    status: AssetStatus;
    allocationStatus: AllocationStatus;
    customerId: number | null;
    customer: string;
    contractId: number | null;
    contract: string;
    allocationDate: Date | null;
    location: string;
    isRetiredOrDisposed: boolean;
}

@Component({
    selector: 'app-asset-status-allocation',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ChartModule, DatePickerModule, InputTextModule, PaginatorModule, SelectModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './asset-status-allocation.component.html',
    styleUrl: './asset-status-allocation.component.scss'
})
export class AssetStatusAllocationComponent implements OnInit {
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
    private readonly locationService = inject(LocationService);
    private readonly partyService = inject(PartyService);
    private readonly router = inject(Router);

    readonly statusOptions = [
        { label: 'All active statuses', value: 'all' },
        { label: 'Leased', value: 'Leased' },
        { label: 'Available', value: 'Available' },
        { label: 'Reserved', value: 'Reserved' },
        { label: 'Under maintenance', value: 'Maintenance' },
        { label: 'Other / retired', value: 'Other' }
    ];
    readonly allocationOptions = [
        { label: 'All allocations', value: 'all' },
        { label: 'Allocated', value: 'Allocated' },
        { label: 'Unallocated', value: 'Unallocated' },
        { label: 'Reserved', value: 'Reserved' }
    ];
    readonly sortOptions = [
        { label: 'Asset number: A to Z', value: 'asset-asc' },
        { label: 'Asset number: Z to A', value: 'asset-desc' },
        { label: 'Status', value: 'status-asc' },
        { label: 'Allocation status', value: 'allocation-asc' },
        { label: 'Category', value: 'category-asc' },
        { label: 'Organisation', value: 'organisation-asc' },
        { label: 'Allocation date: newest first', value: 'allocation-date-desc' }
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
    selectedAllocationStatus = 'all';
    selectedCustomerId: number | null = null;
    selectedContractId: number | null = null;
    selectedLocationId: number | null = null;
    reportingDate = this.today();
    selectedSort = 'asset-asc';
    first = 0;
    rows = 20;

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
    locations: any[] = [];
    parties: any[] = [];
    statusChartData: any;
    statusChartOptions: any;
    allocationChartData: any;
    allocationChartOptions: any;

    ngOnInit(): void { this.loadReport(); }

    get organisationOptions(): any[] { return this.organisations.filter(item => this.isActive(item)).map(item => ({ label: item.TradeName || item.LegalName || item.OrganisationCode || `Organisation ${item.Id}`, value: Number(item.Id) })).sort(this.byLabel); }
    get organisationUnitOptions(): any[] { return this.organisationUnits.filter(item => this.isActive(item) && (this.selectedOrganisationId === null || Number(item.OrganisationId) === this.selectedOrganisationId)).map(item => ({ label: item.UnitName || item.UnitCode || `Unit ${item.Id}`, value: Number(item.Id) })).sort(this.byLabel); }
    get categoryOptions(): any[] { return this.categories.filter(item => this.isActive(item)).map(item => ({ label: item.CategoryName || item.CategoryCode || `Category ${item.Id}`, value: Number(item.Id) })).sort(this.byLabel); }
    get typeOptions(): any[] { return this.types.filter(item => this.isActive(item) && (this.selectedCategoryId === null || Number(item.AssetCategoryId) === this.selectedCategoryId)).map(item => ({ label: item.AssetTypeName || item.AssetTypeCode || `Type ${item.Id}`, value: Number(item.Id) })).sort(this.byLabel); }
    get customerOptions(): any[] { return this.parties.filter(item => this.isActive(item)).map(item => ({ label: this.partyLabel(item.Id), value: Number(item.Id) })).sort(this.byLabel); }
    get contractOptions(): any[] { return this.contracts.filter(item => this.isActive(item)).map(item => ({ label: this.contractLabel(item.Id), value: Number(item.Id) })).sort(this.byLabel); }
    get locationOptions(): any[] { return this.locations.filter(item => this.isActive(item)).map(item => ({ label: item.LocationName || item.LocationCode || `Location ${item.Id}`, value: Number(item.Id) })).sort(this.byLabel); }

    get reportRows(): StatusAllocationRow[] {
        const asOf = this.endOfDay(this.reportingDate);
        return this.assets.filter(asset => this.isActive(asset) && this.isCurrentAt(asset, asOf)).map(asset => this.buildRow(asset, asOf)).filter(row => this.rowMatchesFilters(row));
    }

    get sortedRows(): StatusAllocationRow[] {
        const rows = [...this.reportRows];
        const compare = (left: string, right: string) => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
        if (this.selectedSort === 'asset-desc') return rows.sort((left, right) => compare(right.assetNumber, left.assetNumber));
        if (this.selectedSort === 'status-asc') return rows.sort((left, right) => compare(left.status, right.status) || compare(left.assetNumber, right.assetNumber));
        if (this.selectedSort === 'allocation-asc') return rows.sort((left, right) => compare(left.allocationStatus, right.allocationStatus) || compare(left.assetNumber, right.assetNumber));
        if (this.selectedSort === 'category-asc') return rows.sort((left, right) => compare(left.category, right.category) || compare(left.assetNumber, right.assetNumber));
        if (this.selectedSort === 'organisation-asc') return rows.sort((left, right) => compare(left.organisation, right.organisation) || compare(left.assetNumber, right.assetNumber));
        if (this.selectedSort === 'allocation-date-desc') return rows.sort((left, right) => this.timeOf(right.allocationDate) - this.timeOf(left.allocationDate) || compare(left.assetNumber, right.assetNumber));
        return rows.sort((left, right) => compare(left.assetNumber, right.assetNumber));
    }

    get pagedRows(): StatusAllocationRow[] { return this.sortedRows.slice(this.first, this.first + this.rows); }
    get totalAssets(): number { return this.reportRows.length; }
    get leasedAssets(): number { return this.reportRows.filter(row => row.status === 'Leased').length; }
    get availableAssets(): number { return this.reportRows.filter(row => row.status === 'Available').length; }
    get reservedAssets(): number { return this.reportRows.filter(row => row.status === 'Reserved').length; }
    get maintenanceAssets(): number { return this.reportRows.filter(row => row.status === 'Maintenance').length; }
    get unallocatedAssets(): number { return this.reportRows.filter(row => row.allocationStatus === 'Unallocated').length; }

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
            organisationUnits: this.unitService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            locations: this.locationService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            parties: this.partyService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.assets = this.recordsOf(result.assets); this.assignments = this.recordsOf(result.assignments); this.categories = this.recordsOf(result.categories); this.types = this.recordsOf(result.types); this.statuses = this.recordsOf(result.statuses); this.statusHistory = this.recordsOf(result.statusHistory); this.contracts = this.recordsOf(result.contracts); this.contractAssets = this.recordsOf(result.contractAssets); this.workOrders = this.recordsOf(result.workOrders); this.downtimes = this.recordsOf(result.downtimes); this.organisations = this.recordsOf(result.organisations); this.organisationUnits = this.recordsOf(result.organisationUnits); this.locations = this.recordsOf(result.locations); this.parties = this.recordsOf(result.parties);
            this.refreshReport();
        });
    }

    onOrganisationChange(): void { this.selectedOrganisationUnitId = null; this.refreshReport(); }
    onCategoryChange(): void { this.selectedTypeId = null; this.refreshReport(); }
    onPageChange(event: { first?: number; rows?: number }): void { this.first = event.first ?? 0; this.rows = event.rows ?? this.rows; }
    onSortChange(): void { this.first = 0; }
    refreshReport(): void { this.appliedSearchTerm = this.searchTerm.trim(); this.first = 0; this.rebuildCharts(); }

    clearFilters(): void {
        this.searchTerm = ''; this.appliedSearchTerm = ''; this.selectedOrganisationId = null; this.selectedOrganisationUnitId = null; this.selectedCategoryId = null; this.selectedTypeId = null; this.selectedStatus = 'all'; this.selectedAllocationStatus = 'all'; this.selectedCustomerId = null; this.selectedContractId = null; this.selectedLocationId = null; this.reportingDate = this.today(); this.selectedSort = 'asset-asc'; this.first = 0;
        this.rebuildCharts();
    }

    openAsset(row: StatusAllocationRow): void { this.router.navigate(['/business/assets/view', row.asset.Id]); }
    openContract(row: StatusAllocationRow): void { if (row.contractId) this.router.navigate(['/contracts/view', row.contractId]); }

    exportToExcel(): void {
        downloadXlsx({
            title: 'Asset Status & Allocation Report', reportingDate: this.formatDate(this.reportingDate), filters: this.appliedFiltersLabel(),
            summary: [['Total Assets', this.totalAssets], ['Leased Assets', this.leasedAssets], ['Available Assets', this.availableAssets], ['Reserved Assets', this.reservedAssets], ['Under Maintenance', this.maintenanceAssets], ['Unallocated Assets', this.unallocatedAssets]],
            headers: ['Asset Number', 'Asset Name', 'Category', 'Asset Type', 'Organisation', 'Current Status', 'Allocation Status', 'Customer', 'Lease Contract', 'Allocation Date', 'Location'],
            rows: this.sortedRows.map(row => [row.assetNumber, row.assetName, row.category, row.type, row.organisation, row.status, row.allocationStatus, row.customer, row.contract, this.formatDate(row.allocationDate), row.location]),
            fileName: `asset-status-allocation-${this.fileDate(this.reportingDate)}.xlsx`, sheetName: 'Status & Allocation'
        });
    }

    formatDate(value: Date | null): string { return value ? new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(value) : '—'; }
    statusSeverity(status: AssetStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' { return status === 'Available' ? 'success' : status === 'Leased' ? 'info' : status === 'Maintenance' ? 'warn' : status === 'Reserved' ? 'secondary' : 'danger'; }
    allocationSeverity(status: AllocationStatus): 'success' | 'info' | 'warn' { return status === 'Allocated' ? 'info' : status === 'Reserved' ? 'warn' : 'success'; }
    today(): Date { const value = new Date(); return new Date(value.getFullYear(), value.getMonth(), value.getDate()); }

    private buildRow(asset: any, asOf: Date): StatusAllocationRow {
        const assetId = Number(asset.Id);
        const currentContractAsset = this.currentContractAsset(assetId, asOf);
        const currentAssignment = this.currentAssignment(assetId, asOf);
        const contractId = currentContractAsset ? Number(currentContractAsset.LeaseContractId) : this.assignmentContractId(currentAssignment);
        const contract = contractId ? this.contractById(contractId) : undefined;
        const lifecycleStatus = this.assetStatusAt(asset, asOf);
        const reserved = this.isReservedStatus(lifecycleStatus) || this.isReservedAllocation(currentContractAsset, currentAssignment);
        const status: AssetStatus = this.isMaintenance(asset, asOf, lifecycleStatus) ? 'Maintenance' : this.hasActiveLeaseContract(currentContractAsset, contract, asOf) || this.isLeasedStatus(lifecycleStatus) ? 'Leased' : reserved ? 'Reserved' : this.isLeaseable(asset, lifecycleStatus) ? 'Available' : 'Other';
        const allocationStatus: AllocationStatus = reserved ? 'Reserved' : currentContractAsset || currentAssignment ? 'Allocated' : 'Unallocated';
        const customerId = Number(currentAssignment?.PartyId || contract?.CustomerPartyId || 0) || null;
        return {
            asset, assetNumber: asset.AssetNo || asset.AssetId || `Asset ${assetId}`, assetName: asset.AssetName || asset.AssetDescription || asset.PrimarySerialNo || 'Not recorded', category: this.categoryLabel(asset), type: this.typeLabel(asset), organisation: this.organisationLabel(asset.OwningOrganisationId), status, allocationStatus,
            customerId, customer: currentAssignment?.PartyDisplayName || currentAssignment?.CurrentPartyDisplayName || (customerId ? this.partyLabel(customerId) : '—'), contractId: contractId || null, contract: contractId ? this.contractLabel(contractId) : '—', allocationDate: this.asDate(currentContractAsset?.EffectiveFrom || currentContractAsset?.AllocatedAt || currentAssignment?.AssignedFrom || currentAssignment?.EffectiveFrom), location: this.locationLabel(asset.CurrentLocationId), isRetiredOrDisposed: this.isIneligibleStatus(lifecycleStatus)
        };
    }

    private rowMatchesFilters(row: StatusAllocationRow): boolean {
        if (row.isRetiredOrDisposed && this.selectedStatus === 'all') return false;
        if (this.selectedStatus !== 'all' && row.status !== this.selectedStatus) return false;
        if (this.selectedAllocationStatus !== 'all' && row.allocationStatus !== this.selectedAllocationStatus) return false;
        if (this.selectedCustomerId !== null && row.customerId !== this.selectedCustomerId) return false;
        if (this.selectedContractId !== null && row.contractId !== this.selectedContractId) return false;
        if (this.selectedLocationId !== null && Number(row.asset.CurrentLocationId) !== this.selectedLocationId) return false;
        const term = this.appliedSearchTerm.toLowerCase();
        return !term || [row.assetNumber, row.assetName, row.category, row.type, row.organisation, row.status, row.allocationStatus, row.customer, row.contract, row.location].some(value => value.toLowerCase().includes(term));
    }

    private currentContractAsset(assetId: number, asOf: Date): any | undefined {
        return this.contractAssets.filter(item => Number(item.AssetId) === assetId && this.isActive(item) && this.isCurrentAt(item, asOf) && this.allocationIsActive(item)).sort((left, right) => this.timeOf(this.asDate(right.EffectiveFrom)) - this.timeOf(this.asDate(left.EffectiveFrom)))[0];
    }
    private currentAssignment(assetId: number, asOf: Date): any | undefined {
        return this.assignments.filter(item => Number(item.AssetId) === assetId && this.isActive(item) && this.isCurrentAt({ EffectiveFrom: item.AssignedFrom || item.EffectiveFrom, EffectiveTo: item.AssignedTo || item.EffectiveTo }, asOf)).sort((left, right) => Number(right.IsPrimary) - Number(left.IsPrimary) || this.timeOf(this.asDate(right.AssignedFrom || right.EffectiveFrom)) - this.timeOf(this.asDate(left.AssignedFrom || left.EffectiveFrom)))[0];
    }
    private assignmentContractId(assignment: any): number { return assignment && /lease|contract/.test(`${assignment.AssignmentType || ''} ${assignment.ReferenceType || ''}`.toLowerCase()) ? Number(assignment.ReferenceId || 0) : 0; }
    private hasActiveLeaseContract(contractAsset: any, contract: any, asOf: Date): boolean { return !!contractAsset && this.contractIsActive(contract, asOf); }
    private isReservedAllocation(...items: any[]): boolean { return items.some(item => /reserv|hold/.test(`${item?.AllocationStatusCode || ''} ${item?.AssignmentType || ''} ${item?.ReferenceType || ''}`.toLowerCase())); }
    private isMaintenance(asset: any, asOf: Date, status: string): boolean { const id = Number(asset.Id); return /maintenance|repair|service/.test(status.toLowerCase()) || this.workOrders.some(item => Number(item.AssetId) === id && this.isActive(item) && !this.isClosedStatus(item.WorkOrderStatusCode) && (!this.asDate(item.PlannedStartAt || item.ActualStartAt) || this.asDate(item.PlannedStartAt || item.ActualStartAt)! <= asOf)) || this.downtimes.some(item => Number(item.AssetId) === id && this.isActive(item) && this.isCurrentAt({ EffectiveFrom: item.DowntimeStartAt, EffectiveTo: item.DowntimeEndAt }, asOf)); }
    private assetStatusAt(asset: any, asOf: Date): string { const history = this.statusHistory.filter(item => Number(item.AssetId) === Number(asset.Id) && this.isActive(item) && this.isCurrentAt(item, asOf)).sort((left, right) => this.timeOf(this.asDate(right.EffectiveFrom)) - this.timeOf(this.asDate(left.EffectiveFrom)))[0]; return history ? this.statuses.find(item => Number(item.Id) === Number(history.ToStatusId))?.StatusName || history.ToStatusDisplayName || '' : this.statuses.find(item => Number(item.Id) === Number(asset.AssetStatusId))?.StatusName || asset.AssetStatusDisplayName || asset.AssetStatusName || ''; }
    private contractIsActive(contract: any, asOf: Date): boolean { if (!contract || !this.isActive(contract)) return false; const status = String(contract.LeaseContractStatusName || contract.StatusName || contract.StatusCode || '').toLowerCase(); return !/cancel|terminate|expired|reject|closed/.test(status) && this.isCurrentAt({ EffectiveFrom: contract.CommencementDate, EffectiveTo: contract.MaturityDate }, asOf); }
    private allocationIsActive(item: any): boolean { return !/unallocat|release|return|cancel|reject/.test(String(item.AllocationStatusCode || '').toLowerCase()); }
    private isLeaseable(asset: any, status: string): boolean { return this.asBoolean(asset.IsLeaseable) && !/retired|disposed|lost|inactive|write.?off/.test(status.toLowerCase()); }
    private isIneligibleStatus(status: string): boolean { return /retired|disposed|lost|inactive|write.?off/.test(status.toLowerCase()); }
    private isLeasedStatus(status: string): boolean { return /leased|allocated|deployed|on rent/.test(status.toLowerCase()); }
    private isReservedStatus(status: string): boolean { return /reserv|hold/.test(status.toLowerCase()); }
    private isClosedStatus(status: any): boolean { return /complete|closed|cancel|resolved|released|expired/.test(String(status || '').toLowerCase()); }

    private rebuildCharts(): void {
        const rows = this.reportRows;
        const styles = getComputedStyle(document.documentElement);
        const statusLabels: AssetStatus[] = ['Leased', 'Available', 'Reserved', 'Maintenance', 'Other'];
        this.statusChartData = { labels: ['Leased', 'Available', 'Reserved', 'Under Maintenance', 'Other'], datasets: [{ data: statusLabels.map(status => rows.filter(row => row.status === status).length), backgroundColor: [this.cssColor('--p-blue-500', '#3b82f6'), this.cssColor('--p-green-500', '#22c55e'), this.cssColor('--p-purple-500', '#a855f7'), this.cssColor('--p-orange-500', '#f97316'), this.cssColor('--p-surface-500', '#64748b')], borderWidth: 0 }] };
        this.statusChartOptions = { responsive: true, maintainAspectRatio: false, cutout: '64%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, color: styles.getPropertyValue('--p-text-color').trim() } } } };
        const categories = [...new Set(rows.map(row => row.category))].sort((left, right) => left.localeCompare(right));
        this.allocationChartData = { labels: categories, datasets: [{ label: 'Allocated', data: categories.map(category => rows.filter(row => row.category === category && row.allocationStatus === 'Allocated').length), backgroundColor: this.cssColor('--p-primary-color', '#0f766e'), borderRadius: 5, maxBarThickness: 38 }, { label: 'Unallocated', data: categories.map(category => rows.filter(row => row.category === category && row.allocationStatus === 'Unallocated').length), backgroundColor: this.cssColor('--p-orange-400', '#fb923c'), borderRadius: 5, maxBarThickness: 38 }] };
        this.allocationChartOptions = { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: false, ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim(), maxRotation: 35 }, grid: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0, color: styles.getPropertyValue('--p-text-muted-color').trim() }, grid: { color: styles.getPropertyValue('--p-content-border-color').trim() } } }, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } } };
    }

    private categoryLabel(asset: any): string { return this.categories.find(item => Number(item.Id) === Number(asset.AssetCategoryId))?.CategoryName || asset.AssetCategoryDisplayName || 'Unclassified'; }
    private typeLabel(asset: any): string { return this.types.find(item => Number(item.Id) === Number(asset.AssetTypeId))?.AssetTypeName || asset.AssetTypeDisplayName || 'Not recorded'; }
    private organisationLabel(id: any): string { const item = this.organisations.find(organisation => Number(organisation.Id) === Number(id)); return item?.TradeName || item?.LegalName || item?.OrganisationCode || 'Not recorded'; }
    private partyLabel(id: any): string { const item = this.parties.find(party => Number(party.Id) === Number(id)); return item?.TradeName || item?.LegalName || item?.PartyCode || `Customer ${id}`; }
    private locationLabel(id: any): string { const item = this.locations.find(location => Number(location.Id) === Number(id)); return item?.LocationName || item?.LocationCode || 'Not recorded'; }
    private contractLabel(id: any): string { const item = this.contractById(id); return item?.ContractNo || item?.ContractTitle || `Contract ${id}`; }
    private contractById(id: any): any | undefined { return this.contracts.find(item => Number(item.Id) === Number(id)); }
    private appliedFiltersLabel(): string { return [this.selectedOrganisationId === null ? 'All organisations' : this.organisationLabel(this.selectedOrganisationId), this.selectedOrganisationUnitId === null ? 'All units' : this.organisationUnitOptions.find(item => item.value === this.selectedOrganisationUnitId)?.label || 'Selected unit', this.selectedCategoryId === null ? 'All categories' : this.categoryOptions.find(item => item.value === this.selectedCategoryId)?.label || 'Selected category', this.selectedTypeId === null ? 'All types' : this.typeOptions.find(item => item.value === this.selectedTypeId)?.label || 'Selected type', this.statusOptions.find(item => item.value === this.selectedStatus)?.label || 'All statuses', this.allocationOptions.find(item => item.value === this.selectedAllocationStatus)?.label || 'All allocations', this.selectedCustomerId === null ? 'All customers' : this.partyLabel(this.selectedCustomerId), this.selectedContractId === null ? 'All contracts' : this.contractLabel(this.selectedContractId), this.selectedLocationId === null ? 'All locations' : this.locationLabel(this.selectedLocationId)].join(' | '); }
    private isActive(item: any): boolean { const status = String(item?.RecordStatus || item?.Status || '').toLowerCase(); return !['inactive', 'deleted', 'cancelled'].includes(status); }
    private isCurrentAt(item: any, asOf: Date): boolean { const from = this.asDate(item.EffectiveFrom || item.InServiceDate || item.AcquisitionDate); const to = this.asDate(item.EffectiveTo); return (!from || from <= asOf) && (!to || to >= asOf); }
    private endOfDay(date: Date): Date { return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999); }
    private asDate(value: any): Date | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
    private timeOf(value: Date | null): number { return value?.getTime() || 0; }
    private asBoolean(value: any): boolean { return value === true || value === 1 || String(value).toLowerCase() === 'true'; }
    private fileDate(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
    private cssColor(variable: string, fallback: string): string { return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback; }
    private byLabel = (left: { label: string }, right: { label: string }) => left.label.localeCompare(right.label);
    private failedFeed() { this.hasLoadError = true; return of([]); }
    private recordsOf(response: any): any[] { const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response; return Array.isArray(records) ? records : []; }
}
