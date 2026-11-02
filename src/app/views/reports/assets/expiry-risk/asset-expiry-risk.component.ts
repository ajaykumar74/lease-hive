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
import { AssetCategoryService } from '@/views/assets/assetCategory/assetCategory.service';
import { AssetComplianceRecordService } from '@/views/assets/assetComplianceRecord/assetComplianceRecord.service';
import { AssetStatusService } from '@/views/assets/assetStatus/assetStatus.service';
import { AssetStatusHistoryService } from '@/views/assets/assetStatusHistory/assetStatusHistory.service';
import { AssetTypeService } from '@/views/assets/assetType/assetType.service';
import { AssetReturnService } from '@/views/eolDisposals/assetReturn/assetReturn.service';
import { LeaseContractService } from '@/views/leaseContracts/leaseContract/leaseContract.service';
import { LeaseContractAssetService } from '@/views/leaseContracts/leaseContractAsset/leaseContractAsset.service';
import { InsurancePolicyAssetService } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset.service';
import { MaintenanceExceptionService } from '@/views/maintenanceInsurances/maintenanceException/maintenanceException.service';
import { MaintenanceInsuranceExceptionService } from '@/views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException.service';
import { MaintenanceWorkOrderService } from '@/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder.service';
import { OrganisationService } from '@/views/organisations/organisation/organisation.service';
import { OrganisationUnitService } from '@/views/organisations/organisationUnit/organisationUnit.service';
import { PartyService } from '@/views/parties/party/party.service';
import { downloadXlsx } from '../utilization/xlsx-exporter';

type LeaseStatus = 'Active' | 'Expired' | 'Pending Return' | 'Closed';
type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'None';

interface RiskRow {
    asset: any;
    contract: any | null;
    assetNumber: string;
    assetName: string;
    category: string;
    organisation: string;
    customer: string;
    contractLabel: string;
    contractEnd: Date | null;
    daysToExpiry: number | null;
    leaseStatus: LeaseStatus;
    returnStatus: 'Pending' | 'Returned' | 'Overdue' | 'Not applicable';
    insuranceExpiry: Date | null;
    riskTypes: string[];
    riskLevel: RiskLevel;
    operationalHighRisk: boolean;
}

@Component({
    selector: 'app-asset-expiry-risk',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ChartModule, DatePickerModule, InputTextModule, PaginatorModule, SelectModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './asset-expiry-risk.component.html',
    styleUrl: './asset-expiry-risk.component.scss'
})
export class AssetExpiryRiskComponent implements OnInit {
    private readonly assetService = inject(AssetService);
    private readonly categoryService = inject(AssetCategoryService);
    private readonly typeService = inject(AssetTypeService);
    private readonly statusService = inject(AssetStatusService);
    private readonly statusHistoryService = inject(AssetStatusHistoryService);
    private readonly contractService = inject(LeaseContractService);
    private readonly contractAssetService = inject(LeaseContractAssetService);
    private readonly returnService = inject(AssetReturnService);
    private readonly policyAssetService = inject(InsurancePolicyAssetService);
    private readonly workOrderService = inject(MaintenanceWorkOrderService);
    private readonly maintenanceExceptionService = inject(MaintenanceExceptionService);
    private readonly maintenanceInsuranceExceptionService = inject(MaintenanceInsuranceExceptionService);
    private readonly complianceService = inject(AssetComplianceRecordService);
    private readonly organisationService = inject(OrganisationService);
    private readonly unitService = inject(OrganisationUnitService);
    private readonly partyService = inject(PartyService);
    private readonly router = inject(Router);

    readonly expiryPeriodOptions = [
        { label: 'Next 30 days', value: '30' }, { label: 'Next 60 days', value: '60' }, { label: 'Next 90 days', value: '90' }, { label: 'Custom horizon', value: 'custom' }
    ];
    readonly leaseStatusOptions = [{ label: 'All lease statuses', value: 'all' }, { label: 'Active', value: 'Active' }, { label: 'Expired', value: 'Expired' }, { label: 'Pending return', value: 'Pending Return' }, { label: 'Closed', value: 'Closed' }];
    readonly riskTypeOptions = [{ label: 'All risk types', value: 'all' }, { label: 'Lease Expiry', value: 'Lease Expiry' }, { label: 'Overdue Return', value: 'Overdue Return' }, { label: 'Insurance', value: 'Insurance' }, { label: 'Maintenance', value: 'Maintenance' }, { label: 'Compliance', value: 'Compliance' }];
    readonly riskLevelOptions = [{ label: 'All risk levels', value: 'all' }, { label: 'Critical', value: 'Critical' }, { label: 'High', value: 'High' }, { label: 'Medium', value: 'Medium' }, { label: 'Low', value: 'Low' }];
    readonly sortOptions = [{ label: 'Days to expiry: soonest first', value: 'expiry-asc' }, { label: 'Risk level: highest first', value: 'risk-desc' }, { label: 'Asset number: A to Z', value: 'asset-asc' }, { label: 'Insurance expiry: soonest first', value: 'insurance-asc' }];

    isLoading = true;
    hasLoadError = false;
    filtersVisible = true;
    searchTerm = '';
    appliedSearchTerm = '';
    selectedOrganisationId: number | null = null;
    selectedOrganisationUnitId: number | null = null;
    selectedCategoryId: number | null = null;
    selectedTypeId: number | null = null;
    selectedCustomerId: number | null = null;
    selectedContractId: number | null = null;
    selectedExpiryPeriod = '90';
    customHorizonDate = this.addDays(this.today(), 90);
    selectedLeaseStatus = 'all';
    selectedRiskType = 'all';
    selectedRiskLevel = 'all';
    selectedSort = 'expiry-asc';
    first = 0;
    rows = 10;

    assets: any[] = [];
    categories: any[] = [];
    types: any[] = [];
    statuses: any[] = [];
    statusHistory: any[] = [];
    contracts: any[] = [];
    contractAssets: any[] = [];
    returns: any[] = [];
    policyAssets: any[] = [];
    workOrders: any[] = [];
    maintenanceExceptions: any[] = [];
    maintenanceInsuranceExceptions: any[] = [];
    complianceRecords: any[] = [];
    organisations: any[] = [];
    organisationUnits: any[] = [];
    parties: any[] = [];
    reportRows: RiskRow[] = [];
    expiryChartData: any;
    expiryChartOptions: any;
    riskChartData: any;
    riskChartOptions: any;

    ngOnInit(): void { this.loadReport(); }

    get organisationOptions(): any[] { return this.organisations.filter(item => this.isActive(item)).map(item => ({ label: item.TradeName || item.LegalName || item.OrganisationCode || `Organisation ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort); }
    get organisationUnitOptions(): any[] { return this.organisationUnits.filter(item => this.isActive(item) && (this.selectedOrganisationId === null || Number(item.OrganisationId) === this.selectedOrganisationId)).map(item => ({ label: item.UnitName || item.UnitCode || `Unit ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort); }
    get categoryOptions(): any[] { return this.categories.filter(item => this.isActive(item)).map(item => ({ label: item.CategoryName || item.CategoryCode || `Category ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort); }
    get typeOptions(): any[] { return this.types.filter(item => this.isActive(item) && (this.selectedCategoryId === null || Number(item.AssetCategoryId) === this.selectedCategoryId)).map(item => ({ label: item.AssetTypeName || item.AssetTypeCode || `Type ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort); }
    get customerOptions(): any[] { return this.parties.filter(item => this.isActive(item)).map(item => ({ label: item.TradeName || item.LegalName || item.PartyCode || `Customer ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort); }
    get contractOptions(): any[] { return this.contracts.filter(item => this.isActive(item) && (this.selectedOrganisationId === null || Number(item.LessorOrganisationId) === this.selectedOrganisationId) && (this.selectedCustomerId === null || Number(item.CustomerPartyId) === this.selectedCustomerId)).map(item => ({ label: item.ContractNo || item.ContractTitle || `Contract ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort); }

    get sortedRows(): RiskRow[] {
        const rows = [...this.reportRows];
        if (this.selectedSort === 'asset-asc') return rows.sort((left, right) => left.assetNumber.localeCompare(right.assetNumber, undefined, { numeric: true }));
        if (this.selectedSort === 'risk-desc') return rows.sort((left, right) => this.riskRank(right.riskLevel) - this.riskRank(left.riskLevel) || this.timeOf(left.contractEnd) - this.timeOf(right.contractEnd));
        if (this.selectedSort === 'insurance-asc') return rows.sort((left, right) => this.timeOf(left.insuranceExpiry) - this.timeOf(right.insuranceExpiry));
        return rows.sort((left, right) => (left.daysToExpiry ?? Number.MAX_SAFE_INTEGER) - (right.daysToExpiry ?? Number.MAX_SAFE_INTEGER));
    }
    get pagedRows(): RiskRow[] { return this.sortedRows.slice(this.first, this.first + this.rows); }
    get expiring30Assets(): number { return this.distinctAssetCount(row => row.daysToExpiry !== null && row.daysToExpiry >= 0 && row.daysToExpiry <= 30); }
    get expiring60Assets(): number { return this.distinctAssetCount(row => row.daysToExpiry !== null && row.daysToExpiry >= 31 && row.daysToExpiry <= 60); }
    get expiring90Assets(): number { return this.distinctAssetCount(row => row.daysToExpiry !== null && row.daysToExpiry >= 61 && row.daysToExpiry <= 90); }
    get overdueAssets(): number { return this.distinctAssetCount(row => row.returnStatus === 'Overdue'); }
    get insuranceExpiringAssets(): number { return this.distinctAssetCount(row => row.insuranceExpiry !== null && this.daysFromToday(row.insuranceExpiry) >= 0 && this.daysFromToday(row.insuranceExpiry) <= 30); }
    get highRiskAssets(): number { return this.distinctAssetCount(row => row.operationalHighRisk); }

    loadReport(): void {
        this.isLoading = true; this.hasLoadError = false;
        forkJoin({
            assets: this.assetService.GetAll(false).pipe(catchError(() => this.failedFeed())), categories: this.categoryService.GetAll(false).pipe(catchError(() => this.failedFeed())), types: this.typeService.GetAll(false).pipe(catchError(() => this.failedFeed())), statuses: this.statusService.GetAll(false).pipe(catchError(() => this.failedFeed())), statusHistory: this.statusHistoryService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            contracts: this.contractService.GetAll(false).pipe(catchError(() => this.failedFeed())), contractAssets: this.contractAssetService.GetAll(false).pipe(catchError(() => this.failedFeed())), returns: this.returnService.GetAll(false).pipe(catchError(() => this.failedFeed())), policyAssets: this.policyAssetService.GetAll(false).pipe(catchError(() => this.failedFeed())), workOrders: this.workOrderService.GetAll(false).pipe(catchError(() => this.failedFeed())), maintenanceExceptions: this.maintenanceExceptionService.GetAll(false).pipe(catchError(() => this.failedFeed())), maintenanceInsuranceExceptions: this.maintenanceInsuranceExceptionService.GetAll(false).pipe(catchError(() => this.failedFeed())), complianceRecords: this.complianceService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            organisations: this.organisationService.GetAll(false).pipe(catchError(() => this.failedFeed())), organisationUnits: this.unitService.GetAll(false).pipe(catchError(() => this.failedFeed())), parties: this.partyService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.assets = this.recordsOf(result.assets); this.categories = this.recordsOf(result.categories); this.types = this.recordsOf(result.types); this.statuses = this.recordsOf(result.statuses); this.statusHistory = this.recordsOf(result.statusHistory); this.contracts = this.recordsOf(result.contracts); this.contractAssets = this.recordsOf(result.contractAssets); this.returns = this.recordsOf(result.returns); this.policyAssets = this.recordsOf(result.policyAssets); this.workOrders = this.recordsOf(result.workOrders); this.maintenanceExceptions = this.recordsOf(result.maintenanceExceptions); this.maintenanceInsuranceExceptions = this.recordsOf(result.maintenanceInsuranceExceptions); this.complianceRecords = this.recordsOf(result.complianceRecords); this.organisations = this.recordsOf(result.organisations); this.organisationUnits = this.recordsOf(result.organisationUnits); this.parties = this.recordsOf(result.parties);
            this.refreshReport();
        });
    }

    onOrganisationChange(): void { this.selectedOrganisationUnitId = null; this.selectedContractId = null; this.refreshReport(); }
    onCategoryChange(): void { this.selectedTypeId = null; this.refreshReport(); }
    onCustomerChange(): void { this.selectedContractId = null; this.refreshReport(); }
    onExpiryPeriodChange(): void { if (this.selectedExpiryPeriod === 'custom' && this.customHorizonDate < this.today()) this.customHorizonDate = this.addDays(this.today(), 1); this.refreshReport(); }

    refreshReport(): void {
        this.appliedSearchTerm = this.searchTerm.trim();
        const rows: RiskRow[] = [];
        this.assets.filter(asset => this.assetIsInScope(asset)).forEach(asset => {
            const assetContracts = this.relevantContractAssets(asset);
            if (assetContracts.length) assetContracts.forEach(contractAsset => rows.push(this.buildRow(asset, this.contractById(contractAsset.LeaseContractId))));
            else if (this.hasNonLeaseRisk(asset)) rows.push(this.buildRow(asset, null));
        });
        this.reportRows = rows.filter(row => this.rowMatchesFilters(row));
        this.first = 0;
        this.rebuildCharts();
    }

    clearFilters(): void {
        this.searchTerm = ''; this.appliedSearchTerm = ''; this.selectedOrganisationId = null; this.selectedOrganisationUnitId = null; this.selectedCategoryId = null; this.selectedTypeId = null; this.selectedCustomerId = null; this.selectedContractId = null; this.selectedExpiryPeriod = '90'; this.customHorizonDate = this.addDays(this.today(), 90); this.selectedLeaseStatus = 'all'; this.selectedRiskType = 'all'; this.selectedRiskLevel = 'all'; this.selectedSort = 'expiry-asc'; this.refreshReport();
    }

    onPageChange(event: { first?: number; rows?: number }): void { this.first = event.first ?? 0; this.rows = event.rows ?? this.rows; }
    onSortChange(): void { this.first = 0; }
    openAsset(row: RiskRow): void { this.router.navigate(['/business/assets/view', row.asset.Id]); }
    openContract(row: RiskRow): void { if (row.contract) this.router.navigate(['/contracts/view', row.contract.Id]); }

    exportToExcel(): void {
        downloadXlsx({
            title: 'Asset Lease Expiry & Risk Report', reportingDate: this.formatDate(this.today()), filters: this.appliedFiltersLabel(), sheetName: 'Lease Expiry & Risk', fileName: `asset-lease-expiry-risk-${this.fileDate(this.today())}.xlsx`,
            summary: [['Expiring in 30 Days', this.expiring30Assets], ['Expiring in 60 Days', this.expiring60Assets], ['Expiring in 90 Days', this.expiring90Assets], ['Expired / Overdue', this.overdueAssets], ['Insurance Expiring', this.insuranceExpiringAssets], ['High-Risk Assets', this.highRiskAssets]],
            headers: ['Asset Number', 'Asset Name', 'Category', 'Organisation', 'Customer', 'Lease Contract', 'Contract End Date', 'Days to Expiry', 'Asset Return Status', 'Insurance Expiry', 'Risk Type', 'Risk Level'],
            rows: this.sortedRows.map(row => [row.assetNumber, row.assetName, row.category, row.organisation, row.customer, row.contractLabel, this.formatNullableDate(row.contractEnd), row.daysToExpiry ?? '—', row.returnStatus, this.formatNullableDate(row.insuranceExpiry), row.riskTypes.join(', ') || '—', row.riskLevel === 'None' ? '—' : row.riskLevel])
        });
    }

    riskSeverity(level: RiskLevel): 'danger' | 'warn' | 'info' | 'success' | 'secondary' { return level === 'Critical' ? 'danger' : level === 'High' ? 'danger' : level === 'Medium' ? 'warn' : level === 'Low' ? 'info' : 'secondary'; }
    leaseSeverity(status: LeaseStatus): 'danger' | 'warn' | 'info' | 'success' | 'secondary' { return status === 'Pending Return' ? 'danger' : status === 'Expired' ? 'warn' : status === 'Active' ? 'info' : 'success'; }
    today(): Date { const date = new Date(); return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
    formatNullableDate(value: Date | null): string { return value ? this.formatDate(value) : '—'; }
    formatDate(value: Date): string { return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(value); }

    private buildRow(asset: any, contract: any | null): RiskRow {
        const asOf = this.today();
        const contractEnd = contract ? this.asDate(contract.MaturityDate) : null;
        const returned = this.returnForAsset(asset.Id, contractEnd);
        const daysToExpiry = contractEnd ? this.daysBetween(asOf, contractEnd) : null;
        const returnStatus = returned ? 'Returned' : daysToExpiry !== null && daysToExpiry < 0 ? 'Overdue' : contract ? 'Pending' : 'Not applicable';
        const statusText = String(contract?.LeaseContractStatusName || contract?.StatusName || contract?.StatusCode || '').toLowerCase();
        const leaseStatus: LeaseStatus = returned ? 'Closed' : returnStatus === 'Overdue' ? 'Pending Return' : /expired|terminat/.test(statusText) ? 'Expired' : 'Active';
        const insuranceExpiry = this.insuranceExpiryForAsset(asset.Id);
        const risk = this.riskForAsset(asset, contract, daysToExpiry, returnStatus, insuranceExpiry);
        return { asset, contract, assetNumber: asset.AssetNo || asset.AssetId || `Asset ${asset.Id}`, assetName: asset.AssetName || asset.AssetDescription || asset.PrimarySerialNo || 'Not recorded', category: this.categoryLabel(asset), organisation: this.organisationLabel(asset.OwningOrganisationId), customer: contract ? this.partyLabel(contract.CustomerPartyId) : '—', contractLabel: contract?.ContractNo || contract?.ContractTitle || '—', contractEnd, daysToExpiry, leaseStatus, returnStatus, insuranceExpiry, riskTypes: risk.types, riskLevel: risk.level, operationalHighRisk: risk.operationalHighRisk };
    }

    private relevantContractAssets(asset: any): any[] {
        const asOf = this.today();
        return this.contractAssets.filter(item => {
            const contract = this.contractById(item.LeaseContractId);
            const end = this.asDate(contract?.MaturityDate);
            if (Number(item.AssetId) !== Number(asset.Id) || !this.isActive(item) || !contract || !end || !this.contractIsRelevant(contract, asOf)) return false;
            if (this.selectedContractId === Number(contract.Id) || this.selectedRiskType !== 'all') return true;
            if (end < asOf) return !this.returnForAsset(asset.Id, end) || this.selectedLeaseStatus === 'Closed';
            return this.daysBetween(asOf, end) <= this.expiryHorizonDays();
        });
    }

    private contractIsRelevant(contract: any, asOf: Date): boolean {
        const end = this.asDate(contract?.MaturityDate);
        if (!contract || !this.isActive(contract) || !end) return false;
        return end < asOf || this.daysBetween(asOf, end) <= this.expiryHorizonDays() || this.selectedContractId === Number(contract.Id) || this.selectedRiskType !== 'all';
    }

    private hasNonLeaseRisk(asset: any): boolean {
        return !!this.insuranceExpiryForAsset(asset.Id) || this.workOrders.some(item => Number(item.AssetId) === Number(asset.Id) && this.isOpen(item)) || this.complianceRecords.some(item => Number(item.AssetId) === Number(asset.Id) && this.isActive(item) && !!this.asDate(item.ValidTo)) || this.unresolvedExceptions(asset.Id).length > 0;
    }

    private riskForAsset(asset: any, contract: any | null, daysToExpiry: number | null, returnStatus: string, insuranceExpiry: Date | null): { types: string[]; level: RiskLevel; operationalHighRisk: boolean } {
        const types: string[] = [];
        let level: RiskLevel = 'None';
        let operationalHighRisk = false;
        const setLevel = (value: RiskLevel, operational = false) => { if (this.riskRank(value) > this.riskRank(level)) level = value; if (operational && this.riskRank(value) >= this.riskRank('High')) operationalHighRisk = true; };
        if (contract && daysToExpiry !== null && daysToExpiry >= 0 && daysToExpiry <= 90) { types.push('Lease Expiry'); setLevel(daysToExpiry <= 30 ? 'Medium' : 'Low'); }
        if (returnStatus === 'Overdue') { types.push('Overdue Return'); setLevel('High'); }
        if (insuranceExpiry) { const days = this.daysBetween(this.today(), insuranceExpiry); if (days <= 30) { types.push('Insurance'); setLevel(days < 0 ? 'High' : 'Medium'); } }
        const openOrders = this.workOrders.filter(item => Number(item.AssetId) === Number(asset.Id) && this.isOpen(item));
        if (openOrders.length) { types.push('Maintenance'); openOrders.forEach(item => setLevel(this.priorityRiskLevel(item.PriorityCode), true)); }
        const compliances = this.complianceRecords.filter(item => Number(item.AssetId) === Number(asset.Id) && this.isActive(item) && this.asDate(item.ValidTo)).map(item => this.asDate(item.ValidTo)!);
        if (compliances.some(date => this.daysBetween(this.today(), date) <= 30)) { types.push('Compliance'); setLevel(compliances.some(date => date < this.today()) ? 'High' : 'Medium', true); }
        this.unresolvedExceptions(asset.Id).forEach(item => { types.push(item.DomainCode?.toLowerCase().includes('insurance') ? 'Insurance' : 'Maintenance'); setLevel(this.severityRiskLevel(item.SeverityCode), true); });
        return { types: [...new Set(types)], level, operationalHighRisk };
    }

    private rowMatchesFilters(row: RiskRow): boolean {
        const contractMatches = this.selectedContractId === null || Number(row.contract?.Id) === this.selectedContractId;
        const customerMatches = this.selectedCustomerId === null || Number(row.contract?.CustomerPartyId) === this.selectedCustomerId;
        const leaseMatches = this.selectedLeaseStatus === 'all' || row.leaseStatus === this.selectedLeaseStatus;
        const riskTypeMatches = this.selectedRiskType === 'all' || row.riskTypes.includes(this.selectedRiskType);
        const riskLevelMatches = this.selectedRiskLevel === 'all' || row.riskLevel === this.selectedRiskLevel;
        const expiryMatches = this.matchesExpiryFilter(row);
        const term = this.appliedSearchTerm.toLowerCase();
        const searchMatches = !term || [row.assetNumber, row.assetName, row.category, row.organisation, row.customer, row.contractLabel, row.riskTypes.join(' ')].some(value => value.toLowerCase().includes(term));
        return contractMatches && customerMatches && leaseMatches && riskTypeMatches && riskLevelMatches && expiryMatches && searchMatches;
    }

    private matchesExpiryFilter(row: RiskRow): boolean {
        if (row.daysToExpiry === null) return row.riskTypes.length > 0;
        if (row.daysToExpiry < 0) return true;
        return row.daysToExpiry <= this.expiryHorizonDays();
    }

    private assetIsInScope(asset: any): boolean {
        return this.isActive(asset) && this.isCurrentAt(asset, this.today()) && (this.selectedOrganisationId === null || Number(asset.OwningOrganisationId) === this.selectedOrganisationId) && (this.selectedOrganisationUnitId === null || Number(asset.ResponsibleOrganisationUnitId) === this.selectedOrganisationUnitId) && (this.selectedCategoryId === null || Number(asset.AssetCategoryId) === this.selectedCategoryId) && (this.selectedTypeId === null || Number(asset.AssetTypeId) === this.selectedTypeId);
    }

    private insuranceExpiryForAsset(assetId: any): Date | null {
        const asOf = this.today();
        const dates = this.policyAssets.filter(item => Number(item.AssetId) === Number(assetId) && this.isActive(item) && !this.isClosedStatus(item.StatusCode)).map(item => this.asDate(item.CoverageEndDate)).filter((date): date is Date => !!date);
        const currentOrFuture = dates.filter(date => date >= asOf).sort((left, right) => left.getTime() - right.getTime());
        const mostRecentPast = dates.filter(date => date < asOf).sort((left, right) => right.getTime() - left.getTime());
        return currentOrFuture[0] || mostRecentPast[0] || null;
    }

    private returnForAsset(assetId: any, contractEnd: Date | null): any | undefined {
        return this.returns.filter(item => Number(item.AssetId) === Number(assetId) && this.isActive(item) && this.asDate(item.ReturnedAt) && (!contractEnd || this.asDate(item.ReturnedAt)! >= this.addDays(contractEnd, -30))).sort((left, right) => this.timeOf(this.asDate(right.ReturnedAt)) - this.timeOf(this.asDate(left.ReturnedAt)))[0];
    }

    private unresolvedExceptions(assetId: any): any[] {
        const workOrderIds = new Set(this.workOrders.filter(item => Number(item.AssetId) === Number(assetId)).map(item => Number(item.Id)));
        const unresolved = (item: any) => this.isActive(item) && !item.ResolvedAt && !this.isClosedStatus(item.StatusCode);
        const relates = (item: any) => Number(item.ReferenceId) === Number(assetId) || (String(item.ReferenceTypeCode || '').toLowerCase().includes('work') && workOrderIds.has(Number(item.ReferenceId)));
        return [...this.maintenanceExceptions.filter(item => unresolved(item) && relates(item)), ...this.maintenanceInsuranceExceptions.filter(item => unresolved(item) && relates(item))];
    }

    private rebuildCharts(): void {
        const expiry = [
            { label: 'Expired / Overdue', count: this.distinctAssetCount(row => row.returnStatus === 'Overdue') }, { label: '0–30 days', count: this.distinctAssetCount(row => row.daysToExpiry !== null && row.daysToExpiry >= 0 && row.daysToExpiry <= 30) }, { label: '31–60 days', count: this.distinctAssetCount(row => row.daysToExpiry !== null && row.daysToExpiry >= 31 && row.daysToExpiry <= 60) }, { label: '61–90 days', count: this.distinctAssetCount(row => row.daysToExpiry !== null && row.daysToExpiry >= 61 && row.daysToExpiry <= 90) }, { label: 'Beyond 90 days', count: this.distinctAssetCount(row => row.daysToExpiry !== null && row.daysToExpiry > 90) }
        ];
        const levels: RiskLevel[] = ['Critical', 'High', 'Medium', 'Low'];
        const styles = getComputedStyle(document.documentElement);
        this.expiryChartData = { labels: expiry.map(item => item.label), datasets: [{ label: 'Distinct assets', data: expiry.map(item => item.count), backgroundColor: [this.cssColor('--p-red-500', '#ef4444'), this.cssColor('--p-orange-500', '#f97316'), this.cssColor('--p-yellow-500', '#eab308'), this.cssColor('--p-blue-500', '#3b82f6'), this.cssColor('--p-surface-400', '#94a3b8')], borderRadius: 5 }] };
        this.expiryChartOptions = { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false }, ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim() } }, y: { beginAtZero: true, ticks: { precision: 0, color: styles.getPropertyValue('--p-text-muted-color').trim() }, grid: { color: styles.getPropertyValue('--p-content-border-color').trim() } } }, plugins: { legend: { display: false } } };
        this.riskChartData = { labels: levels, datasets: [{ data: levels.map(level => this.distinctAssetCount(row => row.riskLevel === level)), backgroundColor: [this.cssColor('--p-red-600', '#dc2626'), this.cssColor('--p-orange-500', '#f97316'), this.cssColor('--p-yellow-500', '#eab308'), this.cssColor('--p-blue-500', '#3b82f6')], borderWidth: 0 }] };
        this.riskChartOptions = { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, color: styles.getPropertyValue('--p-text-color').trim() } } } };
    }

    private distinctAssetCount(predicate: (row: RiskRow) => boolean): number { return new Set(this.reportRows.filter(predicate).map(row => Number(row.asset.Id))).size; }
    private expiryHorizonDays(): number { return this.selectedExpiryPeriod === 'custom' ? Math.max(0, this.daysBetween(this.today(), this.customHorizonDate)) : Number(this.selectedExpiryPeriod); }
    private priorityRiskLevel(value: any): RiskLevel { const priority = String(value || '').toLowerCase(); return /critical|urgent/.test(priority) ? 'Critical' : /high/.test(priority) ? 'High' : /medium/.test(priority) ? 'Medium' : 'Low'; }
    private severityRiskLevel(value: any): RiskLevel { const severity = String(value || '').toLowerCase(); return /critical/.test(severity) ? 'Critical' : /high/.test(severity) ? 'High' : /medium/.test(severity) ? 'Medium' : 'Low'; }
    private riskRank(level: RiskLevel): number { return ({ None: 0, Low: 1, Medium: 2, High: 3, Critical: 4 })[level]; }
    private categoryLabel(asset: any): string { return this.categories.find(item => Number(item.Id) === Number(asset.AssetCategoryId))?.CategoryName || asset.AssetCategoryDisplayName || 'Unclassified'; }
    private organisationLabel(id: any): string { const item = this.organisations.find(organisation => Number(organisation.Id) === Number(id)); return item?.TradeName || item?.LegalName || item?.OrganisationCode || 'Not recorded'; }
    private partyLabel(id: any): string { const item = this.parties.find(party => Number(party.Id) === Number(id)); return item?.TradeName || item?.LegalName || item?.PartyCode || `Customer ${id}`; }
    private contractById(id: any): any | undefined { return this.contracts.find(item => Number(item.Id) === Number(id)); }
    private contractIsActive(contract: any, _asOf: Date): boolean { return !!contract && this.isActive(contract) && !/cancel|terminate|reject/.test(String(contract.LeaseContractStatusName || contract.StatusName || contract.StatusCode || '').toLowerCase()) && !!this.asDate(contract.MaturityDate); }
    private isOpen(item: any): boolean { return this.isActive(item) && !this.isClosedStatus(item.WorkOrderStatusCode || item.StatusCode); }
    private isClosedStatus(value: any): boolean { return /complete|closed|cancel|resolved|released|returned|expired/.test(String(value || '').toLowerCase()); }
    private appliedFiltersLabel(): string { return [this.selectedOrganisationId === null ? 'All organisations' : this.organisationLabel(this.selectedOrganisationId), this.selectedOrganisationUnitId === null ? 'All units' : this.organisationUnitOptions.find(item => item.value === this.selectedOrganisationUnitId)?.label || 'Selected unit', this.selectedCategoryId === null ? 'All categories' : this.categoryOptions.find(item => item.value === this.selectedCategoryId)?.label || 'Selected category', this.selectedTypeId === null ? 'All types' : this.typeOptions.find(item => item.value === this.selectedTypeId)?.label || 'Selected type', this.selectedCustomerId === null ? 'All customers' : this.partyLabel(this.selectedCustomerId), this.selectedContractId === null ? 'All contracts' : this.contractOptions.find(item => item.value === this.selectedContractId)?.label || 'Selected contract', this.expiryPeriodOptions.find(item => item.value === this.selectedExpiryPeriod)?.label || 'Custom horizon', this.leaseStatusOptions.find(item => item.value === this.selectedLeaseStatus)?.label || 'All lease statuses', this.riskTypeOptions.find(item => item.value === this.selectedRiskType)?.label || 'All risks', this.riskLevelOptions.find(item => item.value === this.selectedRiskLevel)?.label || 'All risk levels'].join(' | '); }
    private daysBetween(from: Date, to: Date): number { return Math.ceil((this.startOfDay(to).getTime() - this.startOfDay(from).getTime()) / 86_400_000); }
    private daysFromToday(value: Date): number { return this.daysBetween(this.today(), value); }
    private addDays(date: Date, days: number): Date { const result = new Date(date); result.setDate(result.getDate() + days); return result; }
    private fileDate(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
    private isActive(item: any): boolean { const status = String(item?.RecordStatus || item?.Status || '').toLowerCase(); return !['inactive', 'deleted', 'cancelled'].includes(status); }
    private isCurrentAt(item: any, asOf: Date): boolean { const from = this.asDate(item.EffectiveFrom || item.InServiceDate || item.AcquisitionDate); const to = this.asDate(item.EffectiveTo); return (!from || from <= asOf) && (!to || to >= asOf); }
    private asDate(value: any): Date | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
    private asBoolean(value: any): boolean { return value === true || value === 1 || String(value).toLowerCase() === 'true'; }
    private timeOf(value: Date | null): number { return value?.getTime() || Number.MAX_SAFE_INTEGER; }
    private startOfDay(date: Date): Date { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
    private cssColor(variable: string, fallback: string): string { return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback; }
    private failedFeed() { this.hasLoadError = true; return of([]); }
    private recordsOf(response: any): any[] { const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response; return Array.isArray(records) ? records : []; }
    private optionSort(left: { label: string }, right: { label: string }): number { return left.label.localeCompare(right.label); }
}
