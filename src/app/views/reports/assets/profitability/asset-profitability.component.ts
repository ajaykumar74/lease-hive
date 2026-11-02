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
import { AssetStatusService } from '@/views/assets/assetStatus/assetStatus.service';
import { AssetStatusHistoryService } from '@/views/assets/assetStatusHistory/assetStatusHistory.service';
import { AssetTypeService } from '@/views/assets/assetType/assetType.service';
import { CustomerInvoiceService } from '@/views/billings/customerInvoice/customerInvoice.service';
import { CustomerInvoiceLineService } from '@/views/billings/CustomerInvoiceLine/customerInvoiceLine/customerInvoiceLine.service';
import { CreditNoteService } from '@/views/billings/creditNote/creditNote.service';
import { CreditNoteLineService } from '@/views/billings/creditNoteLine/creditNoteLine.service';
import { LeaseContractService } from '@/views/leaseContracts/leaseContract/leaseContract.service';
import { LeaseContractAssetService } from '@/views/leaseContracts/leaseContractAsset/leaseContractAsset.service';
import { LeasePaymentScheduleService } from '@/views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule.service';
import { LeasePaymentScheduleLineService } from '@/views/leaseContracts/leasePaymentScheduleLine/leasePaymentScheduleLine.service';
import { AssetDowntimeService } from '@/views/maintenanceInsurances/assetDowntime/assetDowntime.service';
import { InsurancePolicyService } from '@/views/maintenanceInsurances/insurancePolicy/insurancePolicy.service';
import { InsurancePolicyAssetService } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset.service';
import { MaintenanceWorkOrderService } from '@/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder.service';
import { MaintenanceWorkOrderLabourService } from '@/views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour.service';
import { MaintenanceWorkOrderPartService } from '@/views/maintenanceInsurances/maintenanceWorkOrderPart/maintenanceWorkOrderPart.service';
import { MaintenanceWorkOrderServiceService } from '@/views/maintenanceInsurances/maintenanceWorkOrderService/maintenanceWorkOrderService.service';
import { OrganisationService } from '@/views/organisations/organisation/organisation.service';
import { OrganisationUnitService } from '@/views/organisations/organisationUnit/organisationUnit.service';
import { PartyService } from '@/views/parties/party/party.service';
import { downloadXlsx } from '../utilization/xlsx-exporter';

type PortfolioStatus = 'Leased' | 'Available' | 'Reserved' | 'Maintenance' | 'Other';
type FinancialKind = 'revenue' | 'maintenance' | 'insurance' | 'other';

interface CurrencyTotals { [currency: string]: number; }

interface FinancialEvent {
    assetId: number;
    kind: FinancialKind;
    amount: number;
    currency: string;
    date: Date;
    contractId?: number;
    customerId?: number;
}

interface ProfitabilityRow {
    asset: any;
    assetNumber: string;
    assetName: string;
    category: string;
    organisation: string;
    status: PortfolioStatus;
    customer: string;
    customerIds: number[];
    contract: string;
    contractIds: number[];
    revenue: CurrencyTotals;
    maintenance: CurrencyTotals;
    insurance: CurrencyTotals;
    other: CurrencyTotals;
}

@Component({
    selector: 'app-asset-profitability',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ChartModule, DatePickerModule, InputTextModule, PaginatorModule, SelectModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './asset-profitability.component.html',
    styleUrl: './asset-profitability.component.scss'
})
export class AssetProfitabilityComponent implements OnInit {
    private readonly assetService = inject(AssetService);
    private readonly categoryService = inject(AssetCategoryService);
    private readonly typeService = inject(AssetTypeService);
    private readonly statusService = inject(AssetStatusService);
    private readonly statusHistoryService = inject(AssetStatusHistoryService);
    private readonly contractService = inject(LeaseContractService);
    private readonly contractAssetService = inject(LeaseContractAssetService);
    private readonly paymentScheduleService = inject(LeasePaymentScheduleService);
    private readonly paymentScheduleLineService = inject(LeasePaymentScheduleLineService);
    private readonly invoiceService = inject(CustomerInvoiceService);
    private readonly invoiceLineService = inject(CustomerInvoiceLineService);
    private readonly creditNoteService = inject(CreditNoteService);
    private readonly creditNoteLineService = inject(CreditNoteLineService);
    private readonly workOrderService = inject(MaintenanceWorkOrderService);
    private readonly downtimeService = inject(AssetDowntimeService);
    private readonly workOrderPartService = inject(MaintenanceWorkOrderPartService);
    private readonly workOrderLabourService = inject(MaintenanceWorkOrderLabourService);
    private readonly workOrderServiceService = inject(MaintenanceWorkOrderServiceService);
    private readonly policyService = inject(InsurancePolicyService);
    private readonly policyAssetService = inject(InsurancePolicyAssetService);
    private readonly organisationService = inject(OrganisationService);
    private readonly unitService = inject(OrganisationUnitService);
    private readonly partyService = inject(PartyService);
    private readonly router = inject(Router);

    readonly statusOptions = [
        { label: 'All statuses', value: 'all' },
        { label: 'Leased', value: 'Leased' },
        { label: 'Available', value: 'Available' },
        { label: 'Reserved', value: 'Reserved' },
        { label: 'Under maintenance', value: 'Maintenance' }
    ];
    readonly sortOptions = [
        { label: 'Net contribution: highest first', value: 'contribution-desc' },
        { label: 'Rental revenue: highest first', value: 'revenue-desc' },
        { label: 'Operating cost: highest first', value: 'cost-desc' },
        { label: 'Asset number: A to Z', value: 'asset-asc' }
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
    selectedCustomerId: number | null = null;
    selectedContractId: number | null = null;
    selectedCurrency = 'all';
    selectedSort = 'contribution-desc';
    dateFrom = this.startOfCurrentMonth();
    dateTo = this.today();
    first = 0;
    rows = 10;

    assets: any[] = [];
    categories: any[] = [];
    types: any[] = [];
    statuses: any[] = [];
    statusHistory: any[] = [];
    contracts: any[] = [];
    contractAssets: any[] = [];
    paymentSchedules: any[] = [];
    paymentScheduleLines: any[] = [];
    invoices: any[] = [];
    invoiceLines: any[] = [];
    creditNotes: any[] = [];
    creditNoteLines: any[] = [];
    workOrders: any[] = [];
    downtimes: any[] = [];
    workOrderParts: any[] = [];
    workOrderLabour: any[] = [];
    workOrderServices: any[] = [];
    policies: any[] = [];
    policyAssets: any[] = [];
    organisations: any[] = [];
    organisationUnits: any[] = [];
    parties: any[] = [];
    reportRows: ProfitabilityRow[] = [];
    private financialEvents: FinancialEvent[] = [];
    revenueCostChartData: any;
    revenueCostChartOptions: any;
    categoryChartData: any;
    categoryChartOptions: any;

    ngOnInit(): void { this.loadReport(); }

    get organisationOptions(): any[] {
        return this.organisations.filter(item => this.isActive(item)).map(item => ({ label: item.TradeName || item.LegalName || item.OrganisationCode || `Organisation ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort);
    }

    get organisationUnitOptions(): any[] {
        return this.organisationUnits.filter(item => this.isActive(item) && (this.selectedOrganisationId === null || Number(item.OrganisationId) === this.selectedOrganisationId)).map(item => ({ label: item.UnitName || item.UnitCode || `Unit ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort);
    }

    get categoryOptions(): any[] {
        return this.categories.filter(item => this.isActive(item)).map(item => ({ label: item.CategoryName || item.CategoryCode || `Category ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort);
    }

    get typeOptions(): any[] {
        return this.types.filter(item => this.isActive(item) && (this.selectedCategoryId === null || Number(item.AssetCategoryId) === this.selectedCategoryId)).map(item => ({ label: item.AssetTypeName || item.AssetTypeCode || `Type ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort);
    }

    get customerOptions(): any[] {
        return this.parties.filter(item => this.isActive(item)).map(item => ({ label: item.TradeName || item.LegalName || item.PartyCode || `Customer ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort);
    }

    get contractOptions(): any[] {
        return this.contracts.filter(item => this.isActive(item) && (this.selectedOrganisationId === null || Number(item.LessorOrganisationId) === this.selectedOrganisationId) && (this.selectedCustomerId === null || Number(item.CustomerPartyId) === this.selectedCustomerId)).map(item => ({ label: item.ContractNo || item.ContractTitle || `Contract ${item.Id}`, value: Number(item.Id) })).sort(this.optionSort);
    }

    get currencyOptions(): any[] {
        const currencies = new Set(this.financialEvents.map(item => item.currency).filter(Boolean));
        return [{ label: 'All currencies', value: 'all' }, ...[...currencies].sort().map(currency => ({ label: currency, value: currency }))];
    }

    get sortedRows(): ProfitabilityRow[] {
        const rows = [...this.reportRows];
        if (this.selectedSort === 'asset-asc') return rows.sort((left, right) => left.assetNumber.localeCompare(right.assetNumber, undefined, { numeric: true }));
        if (this.selectedSort === 'revenue-desc') return rows.sort((left, right) => this.totalAmount(this.visibleTotals(right.revenue)) - this.totalAmount(this.visibleTotals(left.revenue)));
        if (this.selectedSort === 'cost-desc') return rows.sort((left, right) => this.totalAmount(this.visibleTotalCost(right)) - this.totalAmount(this.visibleTotalCost(left)));
        return rows.sort((left, right) => this.totalAmount(this.visibleNetContribution(right)) - this.totalAmount(this.visibleNetContribution(left)));
    }

    get pagedRows(): ProfitabilityRow[] { return this.sortedRows.slice(this.first, this.first + this.rows); }
    get totalRentalRevenue(): CurrencyTotals { return this.sumRows(row => row.revenue); }
    get totalOperatingCost(): CurrencyTotals { return this.sumRows(row => this.totalCost(row)); }
    get netOperatingContribution(): CurrencyTotals { return this.subtractTotals(this.totalRentalRevenue, this.totalOperatingCost); }
    get revenueGeneratingAssets(): ProfitabilityRow[] { return this.reportRows.filter(row => this.totalAmount(this.visibleTotals(row.revenue)) > 0); }
    get averageRevenuePerAsset(): CurrencyTotals { return this.divideTotals(this.totalRentalRevenue, this.revenueGeneratingAssets.length); }

    loadReport(): void {
        this.isLoading = true;
        this.hasLoadError = false;
        forkJoin({
            assets: this.assetService.GetAll(false).pipe(catchError(() => this.failedFeed())), categories: this.categoryService.GetAll(false).pipe(catchError(() => this.failedFeed())), types: this.typeService.GetAll(false).pipe(catchError(() => this.failedFeed())), statuses: this.statusService.GetAll(false).pipe(catchError(() => this.failedFeed())), statusHistory: this.statusHistoryService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            contracts: this.contractService.GetAll(false).pipe(catchError(() => this.failedFeed())), contractAssets: this.contractAssetService.GetAll(false).pipe(catchError(() => this.failedFeed())), paymentSchedules: this.paymentScheduleService.GetAll(false).pipe(catchError(() => this.failedFeed())), paymentScheduleLines: this.paymentScheduleLineService.GetAll(false).pipe(catchError(() => this.failedFeed())), invoices: this.invoiceService.GetAll(false).pipe(catchError(() => this.failedFeed())), invoiceLines: this.invoiceLineService.GetAll(false).pipe(catchError(() => this.failedFeed())), creditNotes: this.creditNoteService.GetAll(false).pipe(catchError(() => this.failedFeed())), creditNoteLines: this.creditNoteLineService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            workOrders: this.workOrderService.GetAll(false).pipe(catchError(() => this.failedFeed())), downtimes: this.downtimeService.GetAll(false).pipe(catchError(() => this.failedFeed())), workOrderParts: this.workOrderPartService.GetAll(false).pipe(catchError(() => this.failedFeed())), workOrderLabour: this.workOrderLabourService.GetAll(false).pipe(catchError(() => this.failedFeed())), workOrderServices: this.workOrderServiceService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            policies: this.policyService.GetAll(false).pipe(catchError(() => this.failedFeed())), policyAssets: this.policyAssetService.GetAll(false).pipe(catchError(() => this.failedFeed())), organisations: this.organisationService.GetAll(false).pipe(catchError(() => this.failedFeed())), organisationUnits: this.unitService.GetAll(false).pipe(catchError(() => this.failedFeed())), parties: this.partyService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.assets = this.recordsOf(result.assets); this.categories = this.recordsOf(result.categories); this.types = this.recordsOf(result.types); this.statuses = this.recordsOf(result.statuses); this.statusHistory = this.recordsOf(result.statusHistory); this.contracts = this.recordsOf(result.contracts); this.contractAssets = this.recordsOf(result.contractAssets); this.paymentSchedules = this.recordsOf(result.paymentSchedules); this.paymentScheduleLines = this.recordsOf(result.paymentScheduleLines); this.invoices = this.recordsOf(result.invoices); this.invoiceLines = this.recordsOf(result.invoiceLines); this.creditNotes = this.recordsOf(result.creditNotes); this.creditNoteLines = this.recordsOf(result.creditNoteLines); this.workOrders = this.recordsOf(result.workOrders); this.downtimes = this.recordsOf(result.downtimes); this.workOrderParts = this.recordsOf(result.workOrderParts); this.workOrderLabour = this.recordsOf(result.workOrderLabour); this.workOrderServices = this.recordsOf(result.workOrderServices); this.policies = this.recordsOf(result.policies); this.policyAssets = this.recordsOf(result.policyAssets); this.organisations = this.recordsOf(result.organisations); this.organisationUnits = this.recordsOf(result.organisationUnits); this.parties = this.recordsOf(result.parties);
            this.refreshReport();
        });
    }

    onOrganisationChange(): void { this.selectedOrganisationUnitId = null; this.selectedContractId = null; this.refreshReport(); }
    onCategoryChange(): void { this.selectedTypeId = null; this.refreshReport(); }
    onCustomerChange(): void { this.selectedContractId = null; this.refreshReport(); }
    onDateRangeChange(): void { if (this.dateFrom > this.dateTo) this.dateTo = new Date(this.dateFrom); this.refreshReport(); }

    refreshReport(): void {
        this.appliedSearchTerm = this.searchTerm.trim();
        this.financialEvents = this.buildFinancialEvents();
        this.reportRows = this.assets.filter(asset => this.assetIsInScope(asset)).map(asset => this.buildRow(asset)).filter(row => this.rowMatchesFilters(row));
        this.first = 0;
        this.rebuildCharts();
    }

    clearFilters(): void {
        this.searchTerm = ''; this.appliedSearchTerm = ''; this.selectedOrganisationId = null; this.selectedOrganisationUnitId = null; this.selectedCategoryId = null; this.selectedTypeId = null; this.selectedStatus = 'all'; this.selectedCustomerId = null; this.selectedContractId = null; this.selectedCurrency = 'all'; this.selectedSort = 'contribution-desc'; this.dateFrom = this.startOfCurrentMonth(); this.dateTo = this.today(); this.refreshReport();
    }

    onPageChange(event: { first?: number; rows?: number }): void { this.first = event.first ?? 0; this.rows = event.rows ?? this.rows; }
    onSortChange(): void { this.first = 0; }
    openAsset(row: ProfitabilityRow): void { this.router.navigate(['/business/assets/view', row.asset.Id]); }

    exportToExcel(): void {
        downloadXlsx({
            title: 'Asset Revenue & Profitability Report', reportingDate: `${this.formatDate(this.dateFrom)} – ${this.formatDate(this.dateTo)}`, filters: this.appliedFiltersLabel(), sheetName: 'Asset Profitability', fileName: `asset-profitability-${this.fileDate(this.dateFrom)}-to-${this.fileDate(this.dateTo)}.xlsx`,
            summary: [['Total Rental Revenue', this.formatTotals(this.totalRentalRevenue)], ['Total Operating Cost', this.formatTotals(this.totalOperatingCost)], ['Net Operating Contribution', this.formatTotals(this.netOperatingContribution)], ['Operating Margin', this.formatMargins(this.totalRentalRevenue, this.netOperatingContribution)], ['Revenue Generating Assets', this.revenueGeneratingAssets.length], ['Average Revenue per Asset', this.formatTotals(this.averageRevenuePerAsset)]],
            headers: ['Asset Number', 'Asset Name', 'Category', 'Organisation', 'Customer', 'Lease Contract', 'Rental Revenue', 'Maintenance Cost', 'Insurance Cost', 'Other Operating Cost', 'Total Operating Cost', 'Net Contribution', 'Margin %'],
            rows: this.sortedRows.map(row => [row.assetNumber, row.assetName, row.category, row.organisation, row.customer, row.contract, this.formatTotals(this.visibleTotals(row.revenue)), this.formatTotals(this.visibleTotals(row.maintenance)), this.formatTotals(this.visibleTotals(row.insurance)), this.formatTotals(this.visibleTotals(row.other)), this.formatTotals(this.visibleTotalCost(row)), this.formatTotals(this.visibleNetContribution(row)), this.formatMargins(this.visibleTotals(row.revenue), this.visibleNetContribution(row))])
        });
    }

    formatTotals(totals: CurrencyTotals): string {
        const entries = Object.entries(totals).filter(([, value]) => value !== 0);
        return entries.length ? entries.sort(([left], [right]) => left.localeCompare(right)).map(([currency, value]) => this.formatCurrency(value, currency)).join(' · ') : '—';
    }

    formatMargins(revenue: CurrencyTotals, contribution: CurrencyTotals): string {
        const entries = Object.entries(revenue).filter(([, value]) => value !== 0).map(([currency, value]) => `${currency} ${((contribution[currency] || 0) / value * 100).toFixed(1)}%`);
        return entries.length ? entries.join(' · ') : 'N/A';
    }

    statusSeverity(status: PortfolioStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' { return status === 'Available' ? 'success' : status === 'Leased' ? 'info' : status === 'Maintenance' ? 'warn' : status === 'Reserved' ? 'secondary' : 'danger'; }
    today(): Date { const date = new Date(); return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
    formatDate(value: Date): string { return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(value); }

    private buildFinancialEvents(): FinancialEvent[] {
        const events: FinancialEvent[] = [];
        const invoiceById = new Map(this.invoices.map(item => [Number(item.Id), item]));
        const invoiceLineById = new Map(this.invoiceLines.map(item => [Number(item.Id), item]));
        const contractAssetById = new Map(this.contractAssets.map(item => [Number(item.Id), item]));
        const billedRevenueAssetContracts = new Set<string>();
        this.invoiceLines.forEach(line => {
            const invoice = invoiceById.get(Number(line.CustomerInvoiceId));
            const contractAsset = contractAssetById.get(Number(line.LeaseContractAssetId));
            if (!invoice || !contractAsset || !this.isFinalInvoice(invoice) || !this.withinRange(this.asDate(invoice.InvoiceDate)) || !this.isRentalLine(line)) return;
            const contractId = Number(invoice.LeaseContractId || line.LeaseContractId);
            this.addEvent(events, { assetId: Number(contractAsset.AssetId), kind: 'revenue', amount: this.invoiceLineNetAmount(line), currency: invoice.CurrencyCode, date: this.asDate(invoice.InvoiceDate)!, contractId, customerId: Number(invoice.CustomerPartyId) });
            billedRevenueAssetContracts.add(this.assetContractKey(contractAsset.AssetId, contractId));
        });
        const creditById = new Map(this.creditNotes.map(item => [Number(item.Id), item]));
        this.creditNoteLines.forEach(line => {
            const credit = creditById.get(Number(line.CreditNoteId));
            const sourceLine = invoiceLineById.get(Number(line.CustomerInvoiceLineId));
            const contractAsset = sourceLine && contractAssetById.get(Number(sourceLine.LeaseContractAssetId));
            if (!credit || !sourceLine || !contractAsset || !this.isFinalCredit(credit) || !this.withinRange(this.asDate(credit.CreditNoteDate)) || !this.isRentalLine(sourceLine)) return;
            const contractId = Number(credit.LeaseContractId || sourceLine.LeaseContractId);
            this.addEvent(events, { assetId: Number(contractAsset.AssetId), kind: 'revenue', amount: -Number(line.NetAmount || 0), currency: credit.CurrencyCode, date: this.asDate(credit.CreditNoteDate)!, contractId, customerId: Number(credit.CustomerPartyId) });
            billedRevenueAssetContracts.add(this.assetContractKey(contractAsset.AssetId, contractId));
        });
        const scheduleById = new Map(this.paymentSchedules.map(item => [Number(item.Id), item]));
        this.paymentScheduleLines.forEach(line => {
            const schedule = scheduleById.get(Number(line.LeasePaymentScheduleId));
            const dueDate = this.asDate(line.DueDate);
            if (!schedule || !dueDate || !this.withinRange(dueDate) || !this.isUsableRentalSchedule(schedule, line) || !Number(line.RentalAmount || 0)) return;
            const contractId = Number(schedule.LeaseContractId);
            const linkedContractAsset = contractAssetById.get(Number((line as any).LeaseContractAssetId));
            const contractAssets = this.contractAssets.filter(item => Number(item.LeaseContractId) === contractId && this.isActive(item) && Number(item.AssetId));
            const contractAsset = linkedContractAsset || (contractAssets.length === 1 ? contractAssets[0] : undefined);
            if (!contractAsset || billedRevenueAssetContracts.has(this.assetContractKey(contractAsset.AssetId, contractId))) return;
            const contract = this.contractById(contractId);
            this.addEvent(events, { assetId: Number(contractAsset.AssetId), kind: 'revenue', amount: Number(line.RentalAmount || 0), currency: schedule.CurrencyCode, date: dueDate, contractId, customerId: Number(contract?.CustomerPartyId) });
        });
        this.workOrders.filter(order => this.isRecognizedWorkOrder(order)).forEach(order => {
            const date = this.asDate(order.ActualEndAt || order.PlannedStartAt);
            if (!date || !this.withinRange(date) || !Number(order.AssetId)) return;
            const hasActual = order.ActualAmount !== null && order.ActualAmount !== undefined;
            if (hasActual) this.addEvent(events, { assetId: Number(order.AssetId), kind: 'maintenance', amount: Number(order.ActualAmount || 0), currency: order.CurrencyCode, date, contractId: Number(order.LeaseContractId) });
            else this.workOrderLineTotals(order).forEach(item => this.addEvent(events, { assetId: Number(order.AssetId), kind: 'maintenance', amount: item.amount, currency: item.currency, date, contractId: Number(order.LeaseContractId) }));
        });
        this.policies.filter(policy => this.isActive(policy) && this.withinRange(this.asDate(policy.IssuedDate || policy.PolicyStartDate))).forEach(policy => {
            const date = this.asDate(policy.IssuedDate || policy.PolicyStartDate);
            const covered = this.policyAssets.filter(item => Number(item.InsurancePolicyId) === Number(policy.Id) && this.isActive(item) && Number(item.AssetId));
            const insuredTotal = covered.reduce((total, item) => total + Number(item.InsuredValue || 0), 0);
            if (insuredTotal > 0) covered.forEach(item => this.addEvent(events, { assetId: Number(item.AssetId), kind: 'insurance', amount: Number(policy.PremiumAmount || 0) * Number(item.InsuredValue || 0) / insuredTotal, currency: policy.CurrencyCode || item.CurrencyCode, date: date!, contractId: Number(item.LeaseContractId) }));
        });
        return events.filter(item => Number.isFinite(item.amount) && item.amount !== 0 && item.assetId > 0);
    }

    private buildRow(asset: any): ProfitabilityRow {
        const assetId = Number(asset.Id);
        const events = this.financialEvents.filter(item => item.assetId === assetId);
        const contractIds = [...new Set(events.map(item => item.contractId).filter((value): value is number => !!value))];
        const customerIds = [...new Set(events.map(item => item.customerId).filter((value): value is number => !!value))];
        const status = this.deriveStatus(asset);
        const primaryContractId = contractIds[0];
        const primaryCustomerId = customerIds[0] || this.contractById(primaryContractId)?.CustomerPartyId;
        return { asset, assetNumber: asset.AssetNo || asset.AssetId || `Asset ${assetId}`, assetName: asset.AssetName || asset.AssetDescription || asset.PrimarySerialNo || 'Not recorded', category: this.categoryLabel(asset), organisation: this.organisationLabel(asset.OwningOrganisationId), status, customer: primaryCustomerId ? this.partyLabel(primaryCustomerId) : '—', customerIds, contract: primaryContractId ? this.contractLabel(primaryContractId) : '—', contractIds, revenue: this.eventsToTotals(events, 'revenue'), maintenance: this.eventsToTotals(events, 'maintenance'), insurance: this.eventsToTotals(events, 'insurance'), other: this.eventsToTotals(events, 'other') };
    }

    private rowMatchesFilters(row: ProfitabilityRow): boolean {
        const statusMatches = this.selectedStatus === 'all' || row.status === this.selectedStatus;
        const customerMatches = this.selectedCustomerId === null || row.customerIds.includes(this.selectedCustomerId) || this.contractCustomerMatch(row.contractIds, this.selectedCustomerId);
        const contractMatches = this.selectedContractId === null || row.contractIds.includes(this.selectedContractId);
        const currencyMatches = this.selectedCurrency === 'all' || this.rowHasCurrency(row, this.selectedCurrency);
        const term = this.appliedSearchTerm.toLowerCase();
        const searchMatches = !term || [row.assetNumber, row.assetName, row.category, row.organisation, row.customer, row.contract, row.status].some(value => value.toLowerCase().includes(term));
        return statusMatches && customerMatches && contractMatches && currencyMatches && searchMatches;
    }

    private assetIsInScope(asset: any): boolean {
        return this.isActive(asset) && this.isCurrentAt(asset, this.endOfDay(this.dateTo)) && (this.selectedOrganisationId === null || Number(asset.OwningOrganisationId) === this.selectedOrganisationId) && (this.selectedOrganisationUnitId === null || Number(asset.ResponsibleOrganisationUnitId) === this.selectedOrganisationUnitId) && (this.selectedCategoryId === null || Number(asset.AssetCategoryId) === this.selectedCategoryId) && (this.selectedTypeId === null || Number(asset.AssetTypeId) === this.selectedTypeId);
    }

    private deriveStatus(asset: any): PortfolioStatus {
        const asOf = this.endOfDay(this.dateTo);
        const status = this.assetStatusAt(asset, asOf);
        const id = Number(asset.Id);
        const maintenance = /maintenance|repair|service/.test(status.toLowerCase()) || this.workOrders.some(item => Number(item.AssetId) === id && this.isActive(item) && !this.isClosedStatus(item.WorkOrderStatusCode) && (!this.asDate(item.PlannedStartAt || item.ActualStartAt) || this.asDate(item.PlannedStartAt || item.ActualStartAt)! <= asOf)) || this.downtimes.some(item => Number(item.AssetId) === id && this.isActive(item) && this.isCurrentAt({ EffectiveFrom: item.DowntimeStartAt, EffectiveTo: item.DowntimeEndAt }, asOf));
        if (maintenance) return 'Maintenance';
        if (this.contractAssets.some(item => Number(item.AssetId) === id && this.isActive(item) && this.isCurrentAt(item, asOf) && this.allocationIsActive(item) && this.contractIsActive(this.contractById(item.LeaseContractId), asOf)) || /leased|allocated|deployed|on rent/.test(status.toLowerCase())) return 'Leased';
        if (/reserv|hold/.test(status.toLowerCase())) return 'Reserved';
        return this.asBoolean(asset.IsLeaseable) && !/retired|disposed|lost|inactive|write.?off/.test(status.toLowerCase()) ? 'Available' : 'Other';
    }

    private workOrderLineTotals(order: any): Array<{ amount: number; currency: string }> {
        const id = Number(order.Id);
        return [
            ...this.workOrderParts.filter(item => Number(item.MaintenanceWorkOrderId) === id).map(item => ({ amount: Number(item.LineAmount || 0), currency: item.CurrencyCode || order.CurrencyCode })),
            ...this.workOrderLabour.filter(item => Number(item.MaintenanceWorkOrderId) === id).map(item => ({ amount: Number(item.LineAmount || 0), currency: item.CurrencyCode || order.CurrencyCode })),
            ...this.workOrderServices.filter(item => Number(item.MaintenanceWorkOrderId) === id).map(item => ({ amount: Number(item.LineAmount || 0), currency: item.CurrencyCode || order.CurrencyCode }))
        ].filter(item => item.amount !== 0);
    }

    private rebuildCharts(): void {
        const currencies = this.chartCurrencies();
        const assetIds = new Set(this.reportRows.map(row => Number(row.asset.Id)));
        const months = this.monthsInRange();
        const eventForRows = this.financialEvents.filter(item => assetIds.has(item.assetId) && (this.selectedCurrency === 'all' || item.currency === this.selectedCurrency));
        this.revenueCostChartData = { labels: months.map(month => this.monthLabel(month)), datasets: currencies.flatMap((currency, index) => [
            { label: `Revenue (${currency})`, data: months.map(month => this.sumEvents(eventForRows, month, currency, 'revenue')), backgroundColor: index === 0 ? this.cssColor('--p-primary-color', '#0f766e') : this.chartColor(index), borderRadius: 5 },
            { label: `Operating cost (${currency})`, data: months.map(month => this.sumEvents(eventForRows, month, currency, 'cost')), backgroundColor: index === 0 ? this.cssColor('--p-orange-500', '#f97316') : this.chartColor(index + 3), borderRadius: 5 }
        ]) };
        const styles = getComputedStyle(document.documentElement);
        this.revenueCostChartOptions = { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: false, grid: { display: false }, ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim() } }, y: { beginAtZero: true, ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim() }, grid: { color: styles.getPropertyValue('--p-content-border-color').trim() } } }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } }, tooltip: { callbacks: { label: (context: any) => `${context.dataset.label}: ${Number(context.raw || 0).toLocaleString()}` } } } };
        const categories = [...new Set(this.reportRows.map(row => row.category))].sort();
        this.categoryChartData = { labels: categories, datasets: currencies.map((currency, index) => ({ label: `Operating contribution (${currency})`, data: categories.map(category => this.reportRows.filter(row => row.category === category).reduce((total, row) => total + (this.netContribution(row)[currency] || 0), 0)), backgroundColor: this.chartColor(index), borderRadius: 5, maxBarThickness: 42 })) };
        this.categoryChartOptions = { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim(), maxRotation: 35 }, grid: { display: false } }, y: { ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim() }, grid: { color: styles.getPropertyValue('--p-content-border-color').trim() } } }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } }, tooltip: { callbacks: { label: (context: any) => `${context.dataset.label}: ${Number(context.raw || 0).toLocaleString()}` } } } };
    }

    private sumEvents(events: FinancialEvent[], month: string, currency: string, type: 'revenue' | 'cost'): number {
        return events.filter(item => this.monthKey(item.date) === month && item.currency === currency && (type === 'revenue' ? item.kind === 'revenue' : item.kind !== 'revenue')).reduce((total, item) => total + item.amount, 0);
    }

    private chartCurrencies(): string[] {
        if (this.selectedCurrency !== 'all') return [this.selectedCurrency];
        return [...new Set(this.reportRows.flatMap(row => Object.keys({ ...row.revenue, ...this.totalCost(row) })))].sort().slice(0, 4);
    }

    private eventsToTotals(events: FinancialEvent[], kind: FinancialKind): CurrencyTotals { return events.filter(item => item.kind === kind).reduce((totals, item) => this.addAmount(totals, item.currency, item.amount), {} as CurrencyTotals); }
    private totalCost(row: ProfitabilityRow): CurrencyTotals { return this.mergeTotals(row.maintenance, row.insurance, row.other); }
    visibleTotalCost(row: ProfitabilityRow): CurrencyTotals { return this.visibleTotals(this.totalCost(row)); }
    private netContribution(row: ProfitabilityRow): CurrencyTotals { return this.subtractTotals(row.revenue, this.totalCost(row)); }
    visibleNetContribution(row: ProfitabilityRow): CurrencyTotals { return this.visibleTotals(this.netContribution(row)); }
    visibleTotals(totals: CurrencyTotals): CurrencyTotals { return this.selectedCurrency === 'all' ? totals : { [this.selectedCurrency]: totals[this.selectedCurrency] || 0 }; }
    private sumRows(selector: (row: ProfitabilityRow) => CurrencyTotals): CurrencyTotals { return this.reportRows.reduce((totals, row) => this.mergeTotals(totals, this.visibleTotals(selector(row))), {} as CurrencyTotals); }
    private mergeTotals(...totalsList: CurrencyTotals[]): CurrencyTotals { return totalsList.reduce((combined, totals) => { Object.entries(totals).forEach(([currency, amount]) => this.addAmount(combined, currency, amount)); return combined; }, {} as CurrencyTotals); }
    private subtractTotals(left: CurrencyTotals, right: CurrencyTotals): CurrencyTotals { return this.mergeTotals(left, Object.fromEntries(Object.entries(right).map(([currency, amount]) => [currency, -amount]))); }
    private divideTotals(totals: CurrencyTotals, divisor: number): CurrencyTotals { return divisor ? Object.fromEntries(Object.entries(totals).map(([currency, amount]) => [currency, amount / divisor])) : {}; }
    private totalAmount(totals: CurrencyTotals): number { return Object.values(totals).reduce((total, amount) => total + amount, 0); }
    private addAmount(totals: CurrencyTotals, currency: string, amount: number): CurrencyTotals { const code = String(currency || 'Unspecified').toUpperCase(); totals[code] = (totals[code] || 0) + amount; return totals; }
    private addEvent(events: FinancialEvent[], event: FinancialEvent): void { if (event.amount) events.push({ ...event, currency: String(event.currency || 'Unspecified').toUpperCase() }); }
    private rowHasCurrency(row: ProfitabilityRow, currency: string): boolean { return Object.prototype.hasOwnProperty.call({ ...row.revenue, ...this.totalCost(row) }, currency); }

    private assetStatusAt(asset: any, asOf: Date): string { const history = this.statusHistory.filter(item => Number(item.AssetId) === Number(asset.Id) && this.isActive(item) && this.isCurrentAt(item, asOf)).sort((left, right) => this.timeOf(this.asDate(right.EffectiveFrom)) - this.timeOf(this.asDate(left.EffectiveFrom)))[0]; return history ? this.statuses.find(item => Number(item.Id) === Number(history.ToStatusId))?.StatusName || history.ToStatusDisplayName || '' : this.statuses.find(item => Number(item.Id) === Number(asset.AssetStatusId))?.StatusName || asset.AssetStatusDisplayName || asset.AssetStatusName || ''; }
    private contractIsActive(contract: any, asOf: Date): boolean { return !!contract && this.isActive(contract) && !/cancel|terminate|expired|reject/.test(String(contract.LeaseContractStatusName || contract.StatusName || contract.StatusCode || '').toLowerCase()) && this.isCurrentAt({ EffectiveFrom: contract.CommencementDate, EffectiveTo: contract.MaturityDate }, asOf); }
    private allocationIsActive(item: any): boolean { return !/unallocat|release|return|cancel|reject/.test(String(item.AllocationStatusCode || '').toLowerCase()); }
    private isFinalInvoice(invoice: any): boolean { const status = String(invoice.InvoiceStatusCode || invoice.InvoiceStatusName || '').toLowerCase(); return this.isActive(invoice) && !/draft|cancel|void/.test(status) && (invoice.IsIssued === true || /posted|final|issued|paid/.test(status)); }
    private isFinalCredit(credit: any): boolean { const status = String(credit.StatusCode || '').toLowerCase(); return this.isActive(credit) && !/draft|cancel|void/.test(status) && /posted|final|issued|approved|paid/.test(status); }
    private isUsableRentalSchedule(schedule: any, line: any): boolean { const status = `${schedule.ScheduleStatusCode || ''} ${line.BillingStatusCode || ''}`.toLowerCase(); return !/cancel|void|draft/.test(status); }
    private isRentalLine(line: any): boolean { return /rent/.test(`${line.ChargeTypeCode || ''} ${line.Description || ''}`.toLowerCase()); }
    private invoiceLineNetAmount(line: any): number { return Number(line.TaxableAmount ?? ((Number(line.UnitPrice || 0) * Number(line.Quantity || 0)) - Number(line.DiscountAmount || 0))); }
    private assetContractKey(assetId: any, contractId: any): string { return `${Number(assetId)}:${Number(contractId)}`; }
    private isRecognizedWorkOrder(order: any): boolean { const status = String(order.WorkOrderStatusCode || '').toLowerCase(); return this.isActive(order) && /complete|closed|resolved|posted/.test(status); }
    private contractCustomerMatch(contractIds: number[], customerId: number): boolean { return contractIds.some(id => Number(this.contractById(id)?.CustomerPartyId) === customerId); }
    private categoryLabel(asset: any): string { return this.categories.find(item => Number(item.Id) === Number(asset.AssetCategoryId))?.CategoryName || asset.AssetCategoryDisplayName || 'Unclassified'; }
    private organisationLabel(id: any): string { const item = this.organisations.find(organisation => Number(organisation.Id) === Number(id)); return item?.TradeName || item?.LegalName || item?.OrganisationCode || 'Not recorded'; }
    private partyLabel(id: any): string { const item = this.parties.find(party => Number(party.Id) === Number(id)); return item?.TradeName || item?.LegalName || item?.PartyCode || `Customer ${id}`; }
    private contractLabel(id: any): string { const item = this.contractById(id); return item?.ContractNo || item?.ContractTitle || `Contract ${id}`; }
    private contractById(id: any): any | undefined { return this.contracts.find(item => Number(item.Id) === Number(id)); }
    private appliedFiltersLabel(): string { return [this.formatDate(this.dateFrom), this.formatDate(this.dateTo), this.selectedOrganisationId === null ? 'All organisations' : this.organisationLabel(this.selectedOrganisationId), this.selectedOrganisationUnitId === null ? 'All units' : this.organisationUnitOptions.find(item => item.value === this.selectedOrganisationUnitId)?.label || 'Selected unit', this.selectedCategoryId === null ? 'All categories' : this.categoryOptions.find(item => item.value === this.selectedCategoryId)?.label || 'Selected category', this.selectedTypeId === null ? 'All types' : this.typeOptions.find(item => item.value === this.selectedTypeId)?.label || 'Selected type', this.statusOptions.find(item => item.value === this.selectedStatus)?.label || 'All statuses', this.selectedCustomerId === null ? 'All customers' : this.partyLabel(this.selectedCustomerId), this.selectedContractId === null ? 'All contracts' : this.contractLabel(this.selectedContractId), this.selectedCurrency === 'all' ? 'All currencies' : this.selectedCurrency].join(' | '); }
    private monthKey(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; }
    private monthLabel(key: string): string { const [year, month] = key.split('-').map(Number); return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(year, month - 1, 1)); }
    private monthsInRange(): string[] { const values: string[] = []; const date = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), 1); const end = new Date(this.dateTo.getFullYear(), this.dateTo.getMonth(), 1); while (date <= end) { values.push(this.monthKey(date)); date.setMonth(date.getMonth() + 1); } return values; }
    private startOfCurrentMonth(): Date { const date = this.today(); return new Date(date.getFullYear(), date.getMonth(), 1); }
    private fileDate(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
    private formatCurrency(amount: number, currency: string): string { if (currency === 'UNSPECIFIED') return `${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} (currency not set)`; try { return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount); } catch { return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`; } }
    private chartColor(index: number): string { return ['#0f766e', '#2563eb', '#f97316', '#8b5cf6', '#e11d48', '#0891b2'][index % 6]; }
    private cssColor(variable: string, fallback: string): string { return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback; }
    private withinRange(value: Date | null): boolean { return !!value && value >= this.startOfDay(this.dateFrom) && value <= this.endOfDay(this.dateTo); }
    private isActive(item: any): boolean { const status = String(item?.RecordStatus || item?.Status || '').toLowerCase(); return !['inactive', 'deleted', 'cancelled'].includes(status); }
    private isCurrentAt(item: any, asOf: Date): boolean { const from = this.asDate(item.EffectiveFrom || item.InServiceDate || item.AcquisitionDate); const to = this.asDate(item.EffectiveTo); return (!from || from <= asOf) && (!to || to >= asOf); }
    private isClosedStatus(status: any): boolean { return /complete|closed|cancel|resolved|released|expired/.test(String(status || '').toLowerCase()); }
    private asBoolean(value: any): boolean { return value === true || value === 1 || String(value).toLowerCase() === 'true'; }
    private asDate(value: any): Date | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
    private timeOf(value: Date | null): number { return value?.getTime() || 0; }
    private startOfDay(date: Date): Date { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
    private endOfDay(date: Date): Date { return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999); }
    private failedFeed() { this.hasLoadError = true; return of([]); }
    private recordsOf(response: any): any[] { const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response; return Array.isArray(records) ? records : []; }
    private optionSort(left: { label: string }, right: { label: string }): number { return left.label.localeCompare(right.label); }
}
