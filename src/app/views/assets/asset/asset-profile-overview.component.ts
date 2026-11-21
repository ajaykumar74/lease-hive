import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, catchError, forkJoin, of, takeUntil } from 'rxjs';
import { AssetProfileContext, AssetProfileContextService } from './asset-profile-context.service';
import { AssetFundingService } from '@/views/billings/assetFunding/assetFunding.service';
import { IAssetFundingAssetSummary } from '@/views/billings/assetFunding/assetFunding';
import { AssetAssignmentService } from '@/views/assets/assetAssignment/assetAssignment.service';
import { InsurancePolicyAssetService } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset.service';
import { DeliveryChecklistService } from '@/views/leaseContracts/deliveryChecklist/delivery-checklist.service';
import { LoggedInUserService, DataType, Operator } from '@/shared/LoggedInUserService';

@Component({ templateUrl: './asset-profile-overview.component.html', styleUrls: ['./asset-profile-overview.component.scss'], standalone: false })
export class AssetProfileOverviewComponent implements OnInit, OnDestroy {
    context?: AssetProfileContext;
    loading = true;
    funding: IAssetFundingAssetSummary[] = [];
    assignments: any[] = [];
    insurance: any[] = [];
    deliveries: any[] = [];
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly profile: AssetProfileContextService,
        private readonly fundingService: AssetFundingService,
        private readonly assignmentService: AssetAssignmentService,
        private readonly insuranceService: InsurancePolicyAssetService,
        private readonly deliveryService: DeliveryChecklistService,
        private readonly user: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.profile.context$.pipe(takeUntil(this.destroy$)).subscribe(context => {
            if (!context || context.assetId === this.context?.assetId) return;
            this.context = context;
            this.load(context.assetId);
        });
    }

    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

    get activeAssignment(): any { return this.assignments.find(x => String(x.RecordStatus || 'Active').toLowerCase() === 'active') || this.assignments[0]; }
    get totalFunded(): number { return this.funding.reduce((total, row) => total + Number(row.allocatedAmount || 0), 0); }
    get latestInsurance(): any { return this.insurance[0]; }
    get nextDelivery(): any { return this.deliveries.find(x => !x.IsReadyForDelivery) || this.deliveries[0]; }

    private load(assetId: number): void {
        this.loading = true;
        const tenant = String(this.user.loggedInUser.Tenant.Id);
        const query = (sortBy: string) => ({ Skip: 0, Take: 5, SortBy: sortBy, IsDescending: true, Conditions: [
            { DBName: 'TenantId', Value: tenant, DataType: DataType.Int, Operator: Operator.EqualTo },
            { DBName: 'AssetId', Value: String(assetId), DataType: DataType.Int, Operator: Operator.EqualTo }
        ] });
        forkJoin({
            funding: this.fundingService.assetSummary(assetId).pipe(catchError(() => of([]))),
            assignments: this.assignmentService.search(query('AssignedFrom')).pipe(catchError(() => of({ data: { Records: [] } }))),
            insurance: this.insuranceService.search(query('CoverageEndDate')).pipe(catchError(() => of({ data: { Records: [] } }))),
            deliveries: this.deliveryService.getForAsset(assetId).pipe(catchError(() => of({ data: { Records: [] } })))
        }).subscribe(result => {
            this.funding = result.funding || [];
            this.assignments = result.assignments?.data?.Records || [];
            this.insurance = result.insurance?.data?.Records || [];
            this.deliveries = result.deliveries?.data?.Records || [];
            this.loading = false;
        });
    }
}
