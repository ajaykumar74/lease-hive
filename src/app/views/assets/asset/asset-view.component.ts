import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { finalize } from 'rxjs';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService'
import { AssetService } from './asset.service';
import { IAsset } from './asset';
import { createAssetQuickOptions } from './asset-quick-options';
import { AssetFundingService } from '@/views/billings/assetFunding/assetFunding.service';
import { IAssetFundingAssetSummary } from '@/views/billings/assetFunding/assetFunding';
import { AssetAssignmentService } from '@/views/assets/assetAssignment/assetAssignment.service';
import { IAssetAssignment } from '@/views/assets/assetAssignment/assetAssignment';
import { ISelectItem } from '@/shared/ISelectItem';
import { InsurancePolicyAssetService } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset.service';
import { IInsurancePolicyAsset } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset';
import { DeliveryChecklistService } from '@/views/leaseContracts/deliveryChecklist/delivery-checklist.service';
import { IDeliveryChecklistSnapshot } from '@/views/leaseContracts/deliveryChecklist/delivery-checklist.models';

@Component({
    templateUrl: './asset-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class AssetViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    asset: IAsset = {} as IAsset;
    Caption: string = 'Loading...';
    menuItems: MenuItem[] = [];
    activeTab: 'details' | 'funding' | 'assignments' | 'insurance' | 'delivery-checks' = 'details';
    fundingFacilities: IAssetFundingAssetSummary[] = [];
    fundingLoading: boolean = false;
    assignments: IAssetAssignment[] = [];
    assignmentsLoading = false;
    assignmentStatusOptions: ISelectItem[] = [];
    insuranceCoverages: IInsurancePolicyAsset[] = [];
    insuranceLoading = false;
    deliveryChecklists: IDeliveryChecklistSnapshot[] = [];
    deliveryChecklistsLoading = false;
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private assetService: AssetService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService,
        private fundingService: AssetFundingService,
        private assignmentService: AssetAssignmentService,
        private insurancePolicyAssetService: InsurancePolicyAssetService,
        private deliveryChecklistService: DeliveryChecklistService
    ) {
        this.menuItems = createAssetQuickOptions(
            () => this.asset?.Id,
            commands => this.router.navigate(commands));
    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent; 

       

    ngOnInit(): void { 
        this.selectedId = this.activatedRouter.snapshot.params['id']; 
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 1000);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.assetService.getById(this.selectedId).subscribe({
            next: data => {
                this.asset = data.data;
                this.permission = data.permission; 
                this.populateUI(this.asset);
                if (this.asset?.Id) this.loadFunding();
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IAsset): void { 
        this.Caption = "Asset Details #" + obj.Id;
    }

    selectTab(tab: 'details' | 'funding' | 'assignments' | 'insurance' | 'delivery-checks'): void {
        this.activeTab = tab;
        if (tab === 'funding') this.loadFunding();
        if (tab === 'assignments') this.loadAssignments();
        if (tab === 'insurance') this.loadInsurance();
        if (tab === 'delivery-checks') this.loadDeliveryChecklists();
    }

    loadFunding(): void {
        const assetId = Number(this.asset?.Id);
        if (!Number.isInteger(assetId) || assetId <= 0 || this.fundingLoading) return;

        this.fundingLoading = true;
        this.fundingService.assetSummary(assetId).pipe(
            finalize(() => this.fundingLoading = false)
        ).subscribe({
            next: rows => this.fundingFacilities = Array.isArray(rows) ? rows : [],
            error: () => this.fundingFacilities = []
        });
    }

    loadAssignments(): void {
        const assetId = Number(this.asset?.Id);
        if (!Number.isInteger(assetId) || assetId <= 0 || this.assignmentsLoading) return;

        this.assignmentsLoading = true;
        this.assignmentStatusOptions = this.loggedInUserService.getPicklistOptions('AssetAssignmentStatus');
        this.assignmentService.search({
            Skip: 0,
            Take: 100,
            SortBy: 'AssignedFrom',
            IsDescending: true,
            Conditions: [
                { DBName: 'TenantId', Value: String(this.loggedInUserService.loggedInUser.Tenant.Id), DataType: DataType.Int, Operator: Operator.EqualTo },
                { DBName: 'AssetId', Value: String(assetId), DataType: DataType.Int, Operator: Operator.EqualTo }
            ]
        }).pipe(finalize(() => this.assignmentsLoading = false)).subscribe({
            next: response => this.assignments = response?.data?.Records || [],
            error: () => this.assignments = []
        });
    }

    loadInsurance(): void {
        const assetId = Number(this.asset?.Id);
        if (!Number.isInteger(assetId) || assetId <= 0 || this.insuranceLoading) return;
        this.insuranceLoading = true;
        this.insurancePolicyAssetService.search({
            Skip: 0,
            Take: 100,
            SortBy: 'CoverageEndDate',
            IsDescending: true,
            Conditions: [
                { DBName: 'TenantId', Value: String(this.loggedInUserService.loggedInUser.Tenant.Id), DataType: DataType.Int, Operator: Operator.EqualTo },
                { DBName: 'AssetId', Value: String(assetId), DataType: DataType.Int, Operator: Operator.EqualTo }
            ]
        }).pipe(finalize(() => this.insuranceLoading = false)).subscribe({
            next: response => this.insuranceCoverages = response?.data?.Records || [],
            error: () => this.insuranceCoverages = []
        });
    }

    loadDeliveryChecklists(): void {
        const assetId = Number(this.asset?.Id);
        if (!Number.isInteger(assetId) || assetId <= 0 || this.deliveryChecklistsLoading) return;
        this.deliveryChecklistsLoading = true;
        this.deliveryChecklistService.getForAsset(assetId).pipe(finalize(() => this.deliveryChecklistsLoading = false)).subscribe({
            next: response => this.deliveryChecklists = response?.data?.Records || [],
            error: () => this.deliveryChecklists = []
        });
    }

    insuranceStatus(coverage: IInsurancePolicyAsset): string {
        const status = String(coverage.StatusCode || '').replace(/[ _-]/g, '').toUpperCase();
        if (status === 'NOTREQUIRED') return 'Not Required';
        const end = coverage.CoverageEndDate ? new Date(coverage.CoverageEndDate) : null;
        if (end && !Number.isNaN(end.getTime()) && end < new Date(new Date().setHours(0, 0, 0, 0))) return 'Expired';
        if (['COVERED', 'ACTIVE', 'VERIFIED'].includes(status)) return 'Covered';
        return 'Pending Verification';
    }

    assignmentStatus(assignment: IAssetAssignment): string {
        return this.assignmentStatusOptions.find(option => option.Id === assignment.AssignmentStatusId)?.Text
            || assignment.RecordStatus
            || 'Pending';
    }

    get currentAssignment(): IAssetAssignment | null {
        return this.assignments.find(assignment => assignment.IsPrimary && String(assignment.RecordStatus || 'Active').toUpperCase() === 'ACTIVE' && !assignment.AssignedTo)
            || this.assignments.find(assignment => String(assignment.RecordStatus || 'Active').toUpperCase() === 'ACTIVE')
            || null;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/asset/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

