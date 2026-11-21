import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, forkJoin, map, of, takeUntil } from 'rxjs';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { AssetProfileContext, AssetProfileContextService } from './asset-profile-context.service';
import { AssetAcquisitionService } from '@/views/assets/assetAcquisition/assetAcquisition.service';
import { LeaseContractAssetService } from '@/views/leaseContracts/leaseContractAsset/leaseContractAsset.service';
import { AssetAssignmentService } from '@/views/assets/assetAssignment/assetAssignment.service';
import { InsurancePolicyAssetService } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset.service';
import { DeliveryChecklistService } from '@/views/leaseContracts/deliveryChecklist/delivery-checklist.service';
import { AssetMaintenancePlanService } from '@/views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan.service';
import { AssetLocationHistoryService } from '@/views/assets/assetLocationHistory/assetLocationHistory.service';
import { AssetDocumentLinkService } from '@/views/assets/assetDocumentLink/assetDocumentLink.service';
import { AssetFundingService } from '@/views/billings/assetFunding/assetFunding.service';
import { AssetMeasureReadingService } from '@/views/assets/assetMeasureReading/assetMeasureReading.service';
import { AssetOwnershipHistoryService } from '@/views/assets/assetOwnershipHistory/assetOwnershipHistory.service';
import { AssetLifecycleEventService } from '@/views/assets/assetLifecycleEvent/assetLifecycleEvent.service';
import { InsurancePolicyService } from '@/views/maintenanceInsurances/insurancePolicy/insurancePolicy.service';
import { InsuranceCoverageTypeService } from '@/views/maintenanceInsurances/insuranceCoverageType/insuranceCoverageType.service';

interface ProfileSection {
    title: string;
    description: string;
    empty: string;
    icon: string;
    columns: Array<{ field: string; label: string }>;
    route?: any[];
    detailRoute?: (record: any) => any[] | undefined;
    load: (assetId: number) => any;
}

@Component({ templateUrl: './asset-profile-records.component.html', styleUrls: ['./asset-profile-records.component.scss'], standalone: false })
export class AssetProfileRecordsComponent implements OnInit, OnDestroy {
    context?: AssetProfileContext;
    sectionKey = '';
    section?: ProfileSection;
    records: any[] = [];
    total = 0;
    loading = true;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly profile: AssetProfileContextService,
        private readonly user: LoggedInUserService,
        private readonly acquisitions: AssetAcquisitionService,
        private readonly contracts: LeaseContractAssetService,
        private readonly assignments: AssetAssignmentService,
        private readonly insurance: InsurancePolicyAssetService,
        private readonly deliveries: DeliveryChecklistService,
        private readonly maintenance: AssetMaintenancePlanService,
        private readonly locations: AssetLocationHistoryService,
        private readonly documents: AssetDocumentLinkService,
        private readonly funding: AssetFundingService,
        private readonly usage: AssetMeasureReadingService,
        private readonly ownership: AssetOwnershipHistoryService,
        private readonly activity: AssetLifecycleEventService,
        private readonly policies: InsurancePolicyService,
        private readonly coverageTypes: InsuranceCoverageTypeService
    ) {}

    ngOnInit(): void {
        this.sectionKey = this.route.snapshot.data['section'];
        this.profile.context$.pipe(takeUntil(this.destroy$)).subscribe(context => {
            if (!context || context.assetId === this.context?.assetId) return;
            this.context = context;
            this.section = this.createSections()[this.sectionKey];
            if (!this.section) { this.router.navigate(['../overview'], { relativeTo: this.route.parent }); return; }
            this.load(context.assetId);
        });
    }

    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

    format(value: any, field: string): string {
        if (value === null || value === undefined || value === '') return '—';
        if (field.toLowerCase().includes('date')) { const date = new Date(value); if (!Number.isNaN(date.getTime())) return date.toLocaleDateString(); }
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'number' && /(amount|cost|value|outstanding)/i.test(field)) return value.toLocaleString(undefined, { style: 'currency', currency: this.context?.asset.AcquisitionCurrencyCode || 'USD', maximumFractionDigits: 0 });
        return String(value);
    }

    openFullList(): void { if (this.section?.route) this.router.navigate(this.section.route); }

    openDetails(record: any): void {
        const route = this.section?.detailRoute?.(record);
        if (route) this.router.navigate(route);
    }

    hasDetails(record: any): boolean { return !!this.section?.detailRoute?.(record); }

    isStatus(column: { field: string }): boolean { return /status/i.test(column.field); }

    statusSeverity(value: unknown): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const status = String(value || '').replace(/[ _-]/g, '').toUpperCase();
        if (/EXPIRED|CANCEL|VOID|REJECT|DECLIN|FAILED|OVERDUE|TERMINAT|INACTIVE|UNALLOCATED|UNPAID|NOTAVAILABLE/.test(status)) return 'danger';
        if (/ACTIVE|APPROVED|COMPLETE|COMPLETED|COVERED|VERIFIED|ALLOCATED|RECEIVED|PAID|CURRENT|AVAILABLE/.test(status)) return 'success';
        if (/PENDING|DRAFT|OPEN|SCHEDULED|PROCESS|REVIEW|HOLD/.test(status)) return 'warn';
        if (/INFO|NEW/.test(status)) return 'info';
        return 'secondary';
    }

    private load(assetId: number): void {
        this.loading = true;
        this.section!.load(assetId).pipe(catchError(() => of({ data: { Records: [], TotalRecords: 0 } }))).subscribe((response: any) => {
            const data = response?.data ?? response;
            const records = data?.Records || data || [];
            this.records = this.sectionKey === 'insurance' ? this.withInsuranceLabels(records) : records;
            this.total = Number(data?.TotalRecords ?? this.records.length);
            this.loading = false;
        });
    }

    private withInsuranceLabels(records: any[]): any[] {
        const policyIds = [...new Set(records.map(record => Number(record.InsurancePolicyId)).filter(Number.isFinite))];
        const coverageTypeIds = [...new Set(records.map(record => Number(record.CoverageTypeId)).filter(Number.isFinite))];
        if (!policyIds.length && !coverageTypeIds.length) return records;

        const policies = policyIds.map(id => this.policies.getById(id).pipe(
            map((response: any) => response?.data ?? response),
            catchError(() => of(null))
        ));
        const coverageTypes = coverageTypeIds.map(id => this.coverageTypes.getById(id).pipe(
            map((response: any) => response?.data ?? response),
            catchError(() => of(null))
        ));

        forkJoin({ policies: forkJoin(policies), coverageTypes: forkJoin(coverageTypes) }).subscribe(result => {
            const policyById = new Map(result.policies.filter(Boolean).map((policy: any) => [Number(policy.Id), policy]));
            const coverageTypeById = new Map(result.coverageTypes.filter(Boolean).map((coverageType: any) => [Number(coverageType.Id), coverageType]));
            this.records = records.map(record => {
                const policy = policyById.get(Number(record.InsurancePolicyId));
                const coverageType = coverageTypeById.get(Number(record.CoverageTypeId));
                return {
                    ...record,
                    PolicyNo: policy?.PolicyNo || record.PolicyNo,
                    Coverage: coverageType?.CoverageTypeName || coverageType?.CoverageTypeCode || record.Coverage,
                    PolicyType: policy?.PolicyTypeCode || record.PolicyType
                };
            });
        });
        return records;
    }

    private query(service: any, assetId: number, sortBy = 'Id'): any {
        return service.search({ Skip: 0, Take: 50, SortBy: sortBy, IsDescending: true, Conditions: [
            { DBName: 'TenantId', Value: String(this.user.loggedInUser.Tenant.Id), DataType: DataType.Int, Operator: Operator.EqualTo },
            { DBName: 'AssetId', Value: String(assetId), DataType: DataType.Int, Operator: Operator.EqualTo }
        ] });
    }

    private createSections(): Record<string, ProfileSection> {
        const sections = (title: string, description: string, empty: string, icon: string, columns: ProfileSection['columns'], route: any[] | undefined, detailRoute: ProfileSection['detailRoute'], load: (assetId: number) => any): ProfileSection => ({ title, description, empty, icon, columns, route, detailRoute, load });
        return {
            acquisition: sections('Acquisition & Purchase', 'Purchase and capitalisation records linked to this asset.', 'No acquisition record is linked to this asset.', 'pi pi-shopping-cart', [{ field: 'PurchaseOrderReference', label: 'Purchase order' }, { field: 'SupplierPartyDisplayName', label: 'Supplier' }, { field: 'AcquisitionDate', label: 'Acquired' }, { field: 'TotalAcquisitionCost', label: 'Total cost' }], ['/business/assets/acquisitions'], record => ['/business/assets/acquisitions/view', record.Id], id => this.query(this.acquisitions, id, 'AcquisitionDate')),
            contracts: sections('Contracts', 'Lease contract allocations and their effective periods.', 'This asset is not allocated to a lease contract.', 'pi pi-file-edit', [{ field: 'LeaseContractId', label: 'Contract' }, { field: 'AllocationStatusCode', label: 'Allocation status' }, { field: 'EffectiveFrom', label: 'Effective from' }, { field: 'EffectiveTo', label: 'Effective to' }, { field: 'AssetValueSnapshot', label: 'Value snapshot' }], ['/contracts/assets'], record => ['/contracts/assets/view', record.Id], id => this.query(this.contracts, id, 'EffectiveFrom')),
            finance: sections('Billing & Finance', 'Funding allocation and current outstanding balances for this asset.', 'No finance allocation is linked to this asset.', 'pi pi-wallet', [{ field: 'fundingNumber', label: 'Funding number' }, { field: 'lenderName', label: 'Lender' }, { field: 'allocatedAmount', label: 'Allocated' }, { field: 'outstandingAmount', label: 'Outstanding' }, { field: 'fundingStatus', label: 'Status' }], ['/billing-finance/funding'], record => ['/billing-finance/funding', record.fundingId], id => this.funding.assetSummary(id)),
            users: sections('Customer & Assigned Users', 'Customer custody and assigned-user history.', 'No users are assigned to this asset.', 'pi pi-users', [{ field: 'AssetUserDisplayName', label: 'Assigned user' }, { field: 'PartyDisplayName', label: 'Customer' }, { field: 'CustomerDepartmentDisplayName', label: 'Department' }, { field: 'AssignedFrom', label: 'Assigned from' }, { field: 'AssignedTo', label: 'Assigned to' }], ['/business/assets/assignments'], record => ['/business/assets/assignments/view', record.Id], id => this.query(this.assignments, id, 'AssignedFrom')),
            deliveries: sections('Deliveries', 'Delivery checklist snapshots recorded through active contract workflows.', 'No delivery checklist has been recorded.', 'pi pi-truck', [{ field: 'LeaseContractId', label: 'Contract' }, { field: 'AssetCategoryName', label: 'Category' }, { field: 'CompletedMandatoryItemCount', label: 'Completed checks' }, { field: 'MandatoryItemCount', label: 'Required checks' }, { field: 'Status', label: 'Status' }], undefined, undefined, id => this.deliveries.getForAsset(id)),
            insurance: sections('Insurance', 'Insurance cover and verification records associated with the asset.', 'No insurance cover is linked to this asset.', 'pi pi-shield', [{ field: 'InsurancePolicyId', label: 'Policy ID' }, { field: 'PolicyNo', label: 'Policy No.' }, { field: 'Coverage', label: 'Coverage' }, { field: 'PolicyType', label: 'Type' }, { field: 'CoverageStartDate', label: 'Cover starts' }, { field: 'CoverageEndDate', label: 'Cover ends' }, { field: 'StatusCode', label: 'Status' }], ['/maintenance-insurance/insurance/policies/assets'], record => ['/maintenance-insurance/insurance/policies/assets/view', record.Id], id => this.query(this.insurance, id, 'CoverageEndDate')),
            maintenance: sections('Maintenance', 'Maintenance plans currently configured for this asset.', 'No maintenance plans are linked to this asset.', 'pi pi-wrench', [{ field: 'MaintenancePlanDisplayName', label: 'Plan' }, { field: 'StartDate', label: 'Starts' }, { field: 'EndDate', label: 'Ends' }, { field: 'BaselineDate', label: 'Baseline date' }, { field: 'StatusCode', label: 'Status' }], ['/maintenance-insurance/maintenance/asset-plans'], record => ['/maintenance-insurance/maintenance/asset-plans/view', record.Id], id => this.query(this.maintenance, id, 'StartDate')),
            locations: sections('Location & Movements', 'Current and historical locations for the selected asset.', 'No location movements are recorded.', 'pi pi-map-marker', [{ field: 'LocationDisplayName', label: 'Location' }, { field: 'EffectiveFrom', label: 'From' }, { field: 'EffectiveTo', label: 'To' }, { field: 'MovementReference', label: 'Reference' }, { field: 'RecordStatus', label: 'Status' }], ['/business/assets/location-history'], record => ['/business/assets/location-history/view', record.Id], id => this.query(this.locations, id, 'EffectiveFrom')),
            documents: sections('Documents', 'Document links attached directly to this asset.', 'No documents are linked to this asset.', 'pi pi-folder-open', [{ field: 'DocumentDisplayName', label: 'Document' }, { field: 'DocumentTypeDisplayName', label: 'Type' }, { field: 'RecordStatus', label: 'Status' }, { field: 'CreatedDateTime', label: 'Added' }], ['/business/assets/documents'], record => ['/business/assets/documents/view', record.Id], id => this.query(this.documents, id, 'CreatedDateTime')),
            funding: sections('Funding & Depreciation', 'Funding facilities and asset value allocations.', 'No funding facility is allocated to this asset.', 'pi pi-chart-line', [{ field: 'fundingNumber', label: 'Funding number' }, { field: 'fundingType', label: 'Funding type' }, { field: 'allocatedAmount', label: 'Allocated amount' }, { field: 'outstandingAmount', label: 'Outstanding' }, { field: 'fundingStatus', label: 'Status' }], ['/billing-finance/funding'], record => ['/billing-finance/funding', record.fundingId], id => this.funding.assetSummary(id)),
            usage: sections('Usage & Telemetry', 'Meter readings and usage records for this asset.', 'No usage readings have been recorded.', 'pi pi-chart-bar', [{ field: 'MeasureDefinitionDisplayName', label: 'Measure' }, { field: 'ReadingValue', label: 'Reading' }, { field: 'ReadingDate', label: 'Reading date' }, { field: 'SourceReference', label: 'Source' }], ['/business/assets/measures/readings'], record => ['/business/assets/measures/readings/view', record.Id], id => this.query(this.usage, id, 'ReadingDate')),
            relationships: sections('Relationships', 'Ownership and asset relationship history.', 'No ownership relationship history is recorded.', 'pi pi-share-alt', [{ field: 'OwningPartyDisplayName', label: 'Owner' }, { field: 'EffectiveFrom', label: 'From' }, { field: 'EffectiveTo', label: 'To' }, { field: 'RecordStatus', label: 'Status' }], ['/business/assets/ownership-history'], record => ['/business/assets/ownership-history/view', record.Id], id => this.query(this.ownership, id, 'EffectiveFrom')),
            activity: sections('Activity History', 'Lifecycle events and operational changes recorded for this asset.', 'No lifecycle activity is recorded.', 'pi pi-history', [{ field: 'EventTypeDisplayName', label: 'Event' }, { field: 'EventDate', label: 'Event date' }, { field: 'Reference', label: 'Reference' }, { field: 'RecordStatus', label: 'Status' }], ['/business/assets/lifecycle'], record => ['/business/assets/lifecycle/view', record.Id], id => this.query(this.activity, id, 'EventDate'))
        };
    }
}
