import { Component, DestroyRef, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MenuItem, MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { PermissionService } from '@/shared/security/permission.service';
import { LeaseContractService } from './leaseContract.service';
import { ILeaseContract } from './leaseContract';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { DocumentTemplateService } from '@/views/documents/documentTemplate/document-template.service';
import { DocumentTemplate } from '@/views/documents/documentTemplate/document-template.models';
import { ILeaseContractReadiness } from './leaseContract-readiness';
import { ILeaseContractExecutionWorkflow } from './leaseContract-execution';
import { ILeaseContractActivationAsset, ILeaseContractActivationReadiness, ILeaseContractActivationRequirement } from './leaseContract-activation';
import { AssetAssignmentService } from '@/views/assets/assetAssignment/assetAssignment.service';
import { IAssetAssignment, IAssetAssignmentDeliveryContext } from '@/views/assets/assetAssignment/assetAssignment';
import { ISelectItem } from '@/shared/ISelectItem';
import { DataType, Operator } from '@/shared/LoggedInUserService';
import { AssetService } from '@/views/assets/asset/asset.service';
import { AssetCategoryService } from '@/views/assets/assetCategory/assetCategory.service';
import { IAssetCategory } from '@/views/assets/assetCategory/assetCategory';
import { InsurancePolicyAssetService } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset.service';
import { IInsurancePolicyAsset } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset';
import { IInsurancePolicyAssetDeliveryContext } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-delivery-form.component';
import { DeliveryChecklistService } from '../deliveryChecklist/delivery-checklist.service';
import { IDeliveryChecklistContext, IDeliveryChecklistSnapshot } from '../deliveryChecklist/delivery-checklist.models';
import { switchMap } from 'rxjs/operators';

@Component({
    templateUrl: './leaseContract-view.component.html', 
    styleUrls: ['./leaseContract-view.component.css'],
standalone: false,
    providers: [MessageService]
})
export class LeaseContractViewComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly permissionCodes = {
        view: 'contract.leasecontract.view',
        update: 'contract.leasecontract.update',
        activate: 'contract.leasecontract.activate'
    } as const;

    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    leaseContract: ILeaseContract = {} as ILeaseContract;
    agreement: any = null;
    templates: DocumentTemplate[] = [];
    selectedTemplateId: number | null = null;
    templateChoicesUnavailable: boolean = false;
    readiness: ILeaseContractReadiness | null = null;
    rejectionReason: string = '';
    execution: ILeaseContractExecutionWorkflow | null = null;
    signedAgreementFile: File | null = null;
    signatureRequestForm: any;
    executedAgreementForm: any;
    signatureVerificationForm: any;
    activationReadiness: ILeaseContractActivationReadiness | null = null;
    allocationSelections: { [leaseContractAssetId: number]: number | null } = {};
    deliveryForm: any;
    acceptanceForm: any;
    quickOptionItems: MenuItem[] = [];
    assignmentDialogVisible = false;
    assignmentContext: IAssetAssignmentDeliveryContext | null = null;
    selectedAssignment: IAssetAssignment | null = null;
    deliveryAssignments: Record<number, IAssetAssignment[]> = {};
    assignmentStatusOptions: ISelectItem[] = [];
    assignmentLoading = false;
    assignmentPermission = {} as IPermission;
    insuranceDialogVisible = false;
    insuranceContext: IInsurancePolicyAssetDeliveryContext | null = null;
    selectedInsuranceCoverage: IInsurancePolicyAsset | null = null;
    deliveryInsurance: Record<number, IInsurancePolicyAsset[]> = {};
    insurancePermission = {} as IPermission;
    insuranceLoading = false;
    checklistDialogVisible = false;
    checklistContext: IDeliveryChecklistContext | null = null;
    deliveryChecklists: Record<number, IDeliveryChecklistSnapshot | null> = {};
    checklistLoading = false;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private leaseContractService: LeaseContractService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService,
        private permissionService: PermissionService,
        private documentTemplateService: DocumentTemplateService,
        private formBuilder: FormBuilder,
        private assetAssignmentService: AssetAssignmentService,
        private assetService: AssetService,
        private assetCategoryService: AssetCategoryService,
        private insurancePolicyAssetService: InsurancePolicyAssetService,
        private deliveryChecklistService: DeliveryChecklistService
    ) {
        this.signatureRequestForm = this.formBuilder.group({
            RecipientEmail: ['', [Validators.required, Validators.email]]
        });
        this.executedAgreementForm = this.formBuilder.group({
            RecipientEmail: ['', [Validators.required, Validators.email]]
        });
        this.signatureVerificationForm = this.formBuilder.group({
            CustomerSignerName: ['', Validators.required],
            CustomerSignedOnUtc: ['', Validators.required],
            LessorSignerName: ['', Validators.required],
            LessorSignedOnUtc: ['', Validators.required],
            VerificationComments: ['']
        });
        this.deliveryForm = this.formBuilder.group({
            LeaseContractAssetId: [0, Validators.min(1)],
            AssetId: [0, Validators.min(1)],
            DeliveredOnUtc: [''],
            DeliveryLocationId: [null, Validators.required],
            DeliveredBy: ['', Validators.required],
            ReceivedBy: ['', Validators.required],
            Remarks: ['']
        });
        this.acceptanceForm = this.formBuilder.group({
            LeaseContractAssetId: [0, Validators.min(1)],
            AssetId: [0, Validators.min(1)],
            DecisionCode: ['ACCEPT', Validators.required],
            AcceptedOnUtc: [''],
            AcceptedBy: ['', Validators.required],
            Remarks: ['']
        });
    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent; 
    @ViewChild('activationSection') activationSection?: ElementRef<HTMLElement>;

       

    ngOnInit(): void { 
        this.selectedId = this.activatedRouter.snapshot.params['id']; 
        this.permissionService.permissions$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.refreshQuickOptions());
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 1000);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.getById(this.selectedId).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: data => {
                this.leaseContract = data.data;
                this.permission = data.permission; 
                this.populateUI(this.leaseContract);
                this.refreshQuickOptions();
                this.loadAgreement();
                this.loadTemplates();
                this.loadReadiness();
                this.loadExecution();
                this.loadActivationReadiness();
            },
            error: err => this.messageService.showError(err)
        });
    }

    populateUI(obj: ILeaseContract): void { 
        this.Caption = "LeaseContract Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/contracts/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

    previewAgreement(): void {
        this.runPdfAction(this.leaseContractService.previewAgreement(this.leaseContract.Id, this.templateIdForAgreement), 'Preview opened.');
    }

    issueAgreement(): void {
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.issueAgreement(this.leaseContract.Id, this.templateIdForAgreement).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                this.agreement = response.data;
                this.messageService.showSuccess('The final unsigned lease agreement has been issued.');
                this.loadUI();
            },
            error: err => this.messageService.showError(err)
        });
    }

    viewAgreement(): void {
        this.runPdfAction(this.leaseContractService.downloadAgreement(this.leaseContract.Id), 'Lease agreement opened.');
    }

    downloadAgreement(): void {
        this.downloadPdfAction(this.leaseContractService.downloadAgreement(this.leaseContract.Id), this.agreement?.FileName || `Lease-Agreement-${this.leaseContract.Id}.pdf`, 'Lease agreement downloaded.');
    }

    editContract(): void {
        this.router.navigate(['/contracts/edit/' + this.leaseContract.Id]);
    }

    sendForSignature(isResend: boolean = false): void {
        if (this.signatureRequestForm.invalid) {
            this.signatureRequestForm.markAllAsTouched();
            this.messageService.showError('Confirm a valid customer signatory email before sending.');
            return;
        }
        this.isLoading = true;
        this.spinner.show();
        const recipientEmail = this.signatureRequestForm.controls.RecipientEmail.value || '';
        this.leaseContractService.sendForSignature(this.leaseContract.Id, recipientEmail, isResend).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                response.data.AlreadyQueued ? this.messageService.showError(response.data.Message) : this.messageService.showSuccess(response.data.Message);
                this.loadExecution();
            },
            error: err => this.messageService.showError(err)
        });
    }

    sendExecutedAgreement(): void {
        if (this.executedAgreementForm.invalid) {
            this.executedAgreementForm.markAllAsTouched();
            this.messageService.showError('Confirm a valid customer email before sending the executed agreement.');
            return;
        }
        this.isLoading = true;
        this.spinner.show();
        const recipientEmail = this.executedAgreementForm.controls.RecipientEmail.value || '';
        this.leaseContractService.sendExecutedAgreement(this.leaseContract.Id, recipientEmail).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                response.data.IsQueued ? this.messageService.showSuccess(response.data.Message) : this.messageService.showError(response.data.Message);
            },
            error: err => this.messageService.showError(err)
        });
    }

    onSignedAgreementSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.item(0) || null;
        if (file && !file.name.toLowerCase().endsWith('.pdf')) {
            this.signedAgreementFile = null;
            input.value = '';
            this.messageService.showError('Only a PDF can be uploaded as the signed lease agreement.');
            return;
        }
        this.signedAgreementFile = file;
    }

    uploadSignedAgreement(): void {
        if (!this.signedAgreementFile || !this.execution?.IssuedAgreementDocumentVersionId) {
            this.messageService.showError('Select the signed PDF and an issued agreement before uploading.');
            return;
        }
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.uploadSignedAgreement(
            this.leaseContract.Id,
            this.execution.IssuedAgreementDocumentVersionId,
            this.signedAgreementFile,
            `Signed lease agreement ${this.execution.ContractNumber}`
        ).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                this.execution = response.data.Execution;
                this.signedAgreementFile = null;
                this.messageService.showSuccess('The signed agreement has been stored against the issued agreement version.');
            },
            error: err => this.messageService.showError(err)
        });
    }

    recordSignatures(): void {
        if (this.signatureVerificationForm.invalid) {
            this.signatureVerificationForm.markAllAsTouched();
            this.messageService.showError('Enter both signatory names and signature dates before confirming verification.');
            return;
        }
        this.isLoading = true;
        this.spinner.show();
        const values = this.signatureVerificationForm.getRawValue();
        this.leaseContractService.recordSignatures(this.leaseContract.Id, {
            CustomerSignerName: values.CustomerSignerName || '',
            CustomerSignedOnUtc: values.CustomerSignedOnUtc || '',
            LessorSignerName: values.LessorSignerName || '',
            LessorSignedOnUtc: values.LessorSignedOnUtc || '',
            VerificationComments: values.VerificationComments || ''
        }).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                this.execution = response.data;
                this.messageService.showSuccess('Customer and lessor signature evidence has been verified.');
            },
            error: err => this.messageService.showError(err)
        });
    }

    executeContract(): void {
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.executeContract(this.leaseContract.Id).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                this.execution = response.data.Execution;
                this.messageService.showSuccess(response.data.Message);
                this.leaseContractService.invalidateListCache();
                this.loadUI();
            },
            error: err => this.messageService.showError(err)
        });
    }

    selectAllocation(requirement: ILeaseContractActivationRequirement, assetId: number | null): void {
        this.allocationSelections[requirement.LeaseContractAssetId] = assetId;
    }

    allocateAsset(requirement: ILeaseContractActivationRequirement): void {
        if (!this.canAllocateAsset) return;

        const assetId = this.allocationSelections[requirement.LeaseContractAssetId];
        if (!assetId) {
            this.messageService.showError('Select an available physical asset before allocating it.');
            return;
        }
        this.runActivationAction(this.leaseContractService.allocateAsset(this.leaseContract.Id, requirement.LeaseContractAssetId, { AssetId: assetId }), 'Asset allocated to the contract requirement.');
    }

    beginDelivery(requirement: ILeaseContractActivationRequirement, asset: ILeaseContractActivationAsset): void {
        this.deliveryForm.reset({ LeaseContractAssetId: requirement.LeaseContractAssetId, AssetId: asset.AssetId, DeliveredOnUtc: '', DeliveryLocationId: null, DeliveredBy: '', ReceivedBy: '', Remarks: '' });
    }

    cancelDelivery(): void { this.deliveryForm.reset({ LeaseContractAssetId: 0, AssetId: 0, DeliveredOnUtc: '', DeliveryLocationId: null, DeliveredBy: '', ReceivedBy: '', Remarks: '' }); }

    recordDelivery(): void {
        if (!this.canRecordDelivery) return;

        const assetId = Number(this.deliveryForm.getRawValue().AssetId || 0);
        if (assetId && this.requiresInsuranceFor(assetId) && !this.hasRequiredInsurance(assetId)) {
            this.messageService.showError('Delivery is blocked because this asset requires verified insurance coverage. Add or verify insurance before recording delivery.');
            return;
        }
        // Attachment uploads change evidence counts outside the checklist form.
        // Refresh the server snapshot immediately before deciding whether the
        // client may submit; the API performs the same check transactionally.
        if (assetId && this.requiresChecklistFor(assetId)) {
            const requirement = this.activationReadiness?.AssetRequirements.find(item => item.AllocatedAssets.some(candidate => candidate.AssetId === assetId));
            if (!requirement) { this.messageService.showError('The allocated asset requirement could not be resolved.'); return; }
            this.deliveryChecklistService.getOrCreate({ LeaseContractId: this.leaseContract.Id, LeaseContractAssetId: requirement.LeaseContractAssetId, AssetId: assetId, AssetLabel: '', AssetCategoryName: requirement.AssetCategoryName }).subscribe({
                next: response => {
                    const checklist = response?.data || null;
                    this.deliveryChecklists[assetId] = checklist;
                    if (!checklist?.IsReadyForDelivery) { this.messageService.showError('Delivery is blocked until the mandatory delivery checklist is complete.'); return; }
                    this.submitDelivery();
                },
                error: () => this.messageService.showError('Delivery checklist validation is unavailable. Delivery remains blocked.')
            });
            return;
        }
        this.submitDelivery();
    }

    private submitDelivery(): void {
        if (this.deliveryForm.invalid) {
            this.deliveryForm.markAllAsTouched();
            this.messageService.showError('Enter delivery location, delivering person, and receiving person.');
            return;
        }
        const value = this.deliveryForm.getRawValue();
        this.runActivationAction(this.leaseContractService.recordAssetDelivery(this.leaseContract.Id, value), 'Asset delivery recorded. Confirm customer acceptance when available.', () => this.cancelDelivery());
    }

    openAssetAssignment(asset: ILeaseContractActivationAsset): void {
        if (!this.leaseContract?.CustomerPartyId || !asset?.AssetId) return;
        this.selectedAssignment = this.currentDeliveryAssignment(asset.AssetId) || null;
        this.assignmentContext = {
            AssetId: asset.AssetId,
            AssetLabel: `${asset.AssetNumber}${asset.Identifier ? ' — ' + asset.Identifier : ''}`,
            PartyId: this.leaseContract.CustomerPartyId,
            ReferenceType: 'Contract',
            ReferenceId: String(this.leaseContract.Id)
        };
        this.assignmentDialogVisible = true;
        this.loadAssetCategoryCompliance(asset.AssetId);
    }

    private loadAssetCategoryCompliance(assetId: number): void {
        this.assetService.getById(assetId).pipe(
            switchMap((assetResponse: any) => {
                const asset = assetResponse?.data || assetResponse;
                return asset?.AssetCategoryId ? this.assetCategoryService.getById(asset.AssetCategoryId) : of(null);
            }),
            catchError(() => of(null))
        ).subscribe((categoryResponse: any) => {
            const category = (categoryResponse?.data || categoryResponse || null) as IAssetCategory | null;
            if (!category || !this.assignmentContext || this.assignmentContext.AssetId !== assetId) return;
            // False is the safe default: category policy, not an asset name, controls vehicle KYC.
            this.assignmentContext = {
                ...this.assignmentContext,
                RequiresDriverKyc: category.RequiresDriverKyc === true,
                RequiredDrivingLicenceClass: category.RequiredDrivingLicenceClass || undefined
            };
        });
    }

    closeAssetAssignment(): void {
        this.assignmentDialogVisible = false;
        this.assignmentContext = null;
        this.selectedAssignment = null;
    }

    onAssetAssignmentSaved(): void {
        this.closeAssetAssignment();
        this.messageService.showSuccess('Asset custodian assignment saved.');
        this.loadActivationReadiness();
    }

    assignmentFor(assetId: number): IAssetAssignment | null {
        return this.currentDeliveryAssignment(assetId);
    }

    assignmentStatus(assignment: IAssetAssignment | null): string {
        if (!assignment) return 'Unassigned';
        return this.assignmentStatusOptions.find(option => option.Id === assignment.AssignmentStatusId)?.Text
            || assignment.RecordStatus
            || 'Pending';
    }

    assignmentHistoryFor(assetId: number): IAssetAssignment[] {
        const currentId = this.currentDeliveryAssignment(assetId)?.Id;
        return (this.deliveryAssignments[assetId] || []).filter(item => item.Id !== currentId);
    }

    canManageAssetAssignment(assetId: number): boolean {
        const existing = this.assignmentFor(assetId);
        return this.canRecordDelivery && (existing ? this.assignmentPermission.CanUpdate === true : this.assignmentPermission.CanCreate === true);
    }

    insuranceFor(assetId: number): IInsurancePolicyAsset[] {
        return this.deliveryInsurance[assetId] || [];
    }

    insuranceStatus(assetId: number): 'Covered' | 'Missing' | 'Expired' | 'Pending Verification' | 'Not Required' {
        const coverage = this.insuranceFor(assetId).filter(item => String(item.RecordStatus || 'Active').toUpperCase() === 'ACTIVE');
        if (!coverage.length) return 'Missing';
        if (coverage.some(item => String(item.StatusCode || '').replace(/[ _-]/g, '').toUpperCase() === 'NOTREQUIRED')) return 'Not Required';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const current = coverage.filter(item => {
            const start = this.insuranceDate(item.CoverageStartDate);
            const end = this.insuranceDate(item.CoverageEndDate);
            return !!start && !!end && start <= today && end >= today;
        });
        if (current.some(item => this.isCoveredInsurance(item))) return 'Covered';
        if (current.length) return 'Pending Verification';
        return 'Expired';
    }

    insuranceStatusSeverity(assetId: number): 'success' | 'warn' | 'danger' | 'info' {
        switch (this.insuranceStatus(assetId)) {
            case 'Covered': return 'success';
            case 'Not Required': return 'info';
            case 'Pending Verification': return 'warn';
            default: return 'danger';
        }
    }

    openAssetInsurance(asset: ILeaseContractActivationAsset): void {
        if (!asset?.AssetId || !this.leaseContract?.Id) return;
        const records = this.insuranceFor(asset.AssetId);
        this.selectedInsuranceCoverage = records.find(item => this.isCoveredInsurance(item)) || records[0] || null;
        this.insuranceContext = {
            AssetId: asset.AssetId,
            LeaseContractId: this.leaseContract.Id,
            AssetLabel: `${asset.AssetNumber}${asset.Identifier ? ' — ' + asset.Identifier : ''}`
        };
        this.insuranceDialogVisible = true;
    }

    addAssetInsurance(asset: ILeaseContractActivationAsset): void {
        this.openAssetInsurance(asset);
        this.selectedInsuranceCoverage = null;
    }

    closeAssetInsurance(): void {
        this.insuranceDialogVisible = false;
        this.insuranceContext = null;
        this.selectedInsuranceCoverage = null;
    }

    onAssetInsuranceSaved(): void {
        this.closeAssetInsurance();
        this.messageService.showSuccess('Insurance coverage saved and delivery readiness refreshed.');
        this.loadActivationReadiness();
    }

    canManageAssetInsurance(assetId: number): boolean {
        const existing = this.insuranceFor(assetId)[0];
        return existing ? this.insurancePermission.CanUpdate === true : this.insurancePermission.CanCreate === true;
    }

    deliveryChecklistFor(assetId: number): IDeliveryChecklistSnapshot | null {
        return this.deliveryChecklists[assetId] || null;
    }

    checklistStatus(assetId: number): string {
        const checklist = this.deliveryChecklistFor(assetId);
        if (!checklist) return this.requiresChecklistFor(assetId) ? 'Not started' : 'Not required';
        if (checklist.IsReadyForDelivery) return 'Complete';
        if (checklist.Status === 'BLOCKED') return 'Blocked';
        return checklist.Status === 'NOT_STARTED' ? 'Not started' : 'In progress';
    }

    checklistStatusSeverity(assetId: number): 'success' | 'warn' | 'danger' | 'info' {
        const status = this.checklistStatus(assetId);
        return status === 'Complete' ? 'success' : status === 'Not required' ? 'info' : status === 'Blocked' ? 'danger' : 'warn';
    }

    openDeliveryChecklist(requirement: ILeaseContractActivationRequirement, asset: ILeaseContractActivationAsset): void {
        if (!this.canRecordDelivery || !asset?.AssetId) return;
        this.checklistContext = {
            LeaseContractId: this.leaseContract.Id,
            LeaseContractAssetId: requirement.LeaseContractAssetId,
            AssetId: asset.AssetId,
            AssetLabel: `${asset.AssetNumber}${asset.Identifier ? ' — ' + asset.Identifier : ''}`,
            AssetCategoryName: requirement.AssetCategoryName
        };
        this.checklistDialogVisible = true;
    }

    closeDeliveryChecklist(): void {
        this.checklistDialogVisible = false;
        this.checklistContext = null;
    }

    onDeliveryChecklistSaved(): void {
        this.closeDeliveryChecklist();
        this.messageService.showSuccess('Delivery checklist saved and readiness refreshed.');
        this.loadActivationReadiness();
    }

    private requiresInsuranceFor(assetId: number): boolean {
        const asset = this.activationAssets.find(item => item.AssetId === assetId);
        // Newer APIs can provide an asset/contract requirement flag. Existing
        // tenants retain their current delivery behaviour until that policy is set.
        return asset?.InsuranceRequired === true || (this.leaseContract as any)?.InsuranceRequired === true;
    }

    private hasRequiredInsurance(assetId: number): boolean {
        const asset = this.activationAssets.find(item => item.AssetId === assetId);
        const requiredCoverageTypeId = asset?.RequiredInsuranceCoverageTypeId;
        return this.insuranceFor(assetId).some(item => this.isCoveredInsurance(item) && this.isCurrentInsurance(item)
            && (!requiredCoverageTypeId || item.CoverageTypeId === requiredCoverageTypeId)
        );
    }

    private requiresChecklistFor(assetId: number): boolean {
        const asset = this.activationAssets.find(item => item.AssetId === assetId) as any;
        const requirement = this.activationReadiness?.AssetRequirements.find(item => item.AllocatedAssets.some(candidate => candidate.AssetId === assetId));
        const category = String(requirement?.AssetCategoryName || '').toUpperCase();
        return asset?.DeliveryChecklistRequired === true || /VEHICLE|IT|PLANT|EQUIPMENT/.test(category) || !!this.deliveryChecklists[assetId]?.Items?.length;
    }

    private isCoveredInsurance(item: IInsurancePolicyAsset): boolean {
        return ['COVERED', 'ACTIVE', 'VERIFIED'].includes(String(item.StatusCode || '').replace(/[ _-]/g, '').toUpperCase());
    }

    private isCurrentInsurance(item: IInsurancePolicyAsset): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = this.insuranceDate(item.CoverageStartDate);
        const end = this.insuranceDate(item.CoverageEndDate);
        return !!start && !!end && start <= today && end >= today;
    }

    private insuranceDate(value: unknown): Date | null {
        if (!value) return null;
        const date = value instanceof Date ? value : new Date(String(value));
        if (Number.isNaN(date.getTime())) return null;
        date.setHours(0, 0, 0, 0);
        return date;
    }

    beginAcceptance(requirement: ILeaseContractActivationRequirement, asset: ILeaseContractActivationAsset): void {
        this.acceptanceForm.reset({ LeaseContractAssetId: requirement.LeaseContractAssetId, AssetId: asset.AssetId, DecisionCode: 'ACCEPT', AcceptedOnUtc: '', AcceptedBy: '', Remarks: '' });
    }

    cancelAcceptance(): void { this.acceptanceForm.reset({ LeaseContractAssetId: 0, AssetId: 0, DecisionCode: 'ACCEPT', AcceptedOnUtc: '', AcceptedBy: '', Remarks: '' }); }

    recordAcceptance(): void {
        if (!this.canRecordCustomerAcceptance) return;

        if (this.acceptanceForm.invalid) {
            this.acceptanceForm.markAllAsTouched();
            this.messageService.showError('Enter the customer representative confirming this decision.');
            return;
        }
        const value = this.acceptanceForm.getRawValue();
        this.runActivationAction(this.leaseContractService.recordAssetAcceptance(this.leaseContract.Id, value), value.DecisionCode === 'REJECT' ? 'Customer rejection recorded. Resolve delivery before activation.' : 'Customer acceptance recorded.', () => this.cancelAcceptance());
    }

    validateActivation(): void {
        if (!this.canViewActivationConditions) return;

        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.getActivationReadiness(this.leaseContract.Id).pipe(finalize(() => {
            this.spinner.hide(); this.isLoading = false;
        })).subscribe({
            next: response => {
                this.applyActivationReadiness(response.data);
                response.data.IsReadyForActivation ? this.messageService.showSuccess('Activation validation passed.') : this.messageService.showError('Complete the activation items shown below.');
            },
            error: err => this.messageService.showError(err)
        });
    }

    activateContract(): void {
        if (!this.canActivateContract) return;

        let activationSucceeded = false;
        if (!this.activationReadiness?.IsReadyForActivation) {
            this.messageService.showError('Validate and complete the activation requirements first.');
            return;
        }
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.activateContract(this.leaseContract.Id).pipe(finalize(() => {
            this.spinner.hide(); this.isLoading = false;
            if (activationSucceeded) this.loadUI();
        })).subscribe({
            next: response => {
                this.applyActivationReadiness(response.data.Readiness);
                this.synchroniseContractStatus(response.data.Readiness.StatusCode);
                this.messageService.showSuccess(response.data.Message);
                this.leaseContractService.invalidateListCache();
                activationSucceeded = true;
            },
            error: err => this.messageService.showError(err)
        });
    }

    openAllocateAssetQuickOption(): void {
        if (!this.canAllocateAsset) return;

        if (!this.activationReadiness) {
            this.loadActivationReadiness(
                () => this.focusAllocationTarget(),
                () => this.messageService.showError('Unable to load the outstanding asset allocation requirements.')
            );
            return;
        }

        this.focusAllocationTarget();
    }

    openDeliveryQuickOption(): void {
        if (!this.canRecordDelivery) return;

        const target = this.findDeliveryTarget();
        if (!target) return;

        this.beginDelivery(target.requirement, target.asset);
        this.focusActivationSection();
    }

    openCustomerAcceptanceQuickOption(): void {
        if (!this.canRecordCustomerAcceptance) return;

        const target = this.findAcceptanceTarget();
        if (!target) return;

        this.beginAcceptance(target.requirement, target.asset);
        this.focusActivationSection();
    }

    viewActivationConditions(): void {
        if (!this.canViewActivationConditions) return;

        if (!this.activationReadiness) {
            this.loadActivationReadiness(() => this.focusActivationSection());
            return;
        }
        this.focusActivationSection();
    }

    openActivationQuickOption(): void {
        if (!this.canActivateContract || !this.activationReadiness?.IsReadyForActivation) return;
        this.activateContract();
    }

    viewSignedAgreement(): void {
        this.runPdfAction(this.leaseContractService.downloadSignedAgreement(this.leaseContract.Id), 'Signed lease agreement opened.');
    }

    approveContract(): void {
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.approvalAction(this.leaseContract.Id, 'APPROVE', '').pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                this.messageService.showSuccess(response.data.Message);
                this.leaseContractService.invalidateListCache();
                this.loadUI();
            },
            error: err => this.messageService.showError(err)
        });
    }

    rejectContract(): void {
        if (!this.rejectionReason.trim()) {
            this.messageService.showError('Enter a rejection reason before rejecting the contract.');
            return;
        }
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.approvalAction(this.leaseContract.Id, 'REJECT', this.rejectionReason.trim()).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                this.rejectionReason = '';
                this.messageService.showSuccess(response.data.Message);
                this.leaseContractService.invalidateListCache();
                this.loadUI();
            },
            error: err => this.messageService.showError(err)
        });
    }

    validateContract(): void {
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.getReadiness(this.selectedId).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                this.readiness = response.data;
                const message = this.readiness.IsReadyForApproval
                    ? 'Contract validation passed. It is ready for approval.'
                    : 'Contract validation found items to complete.';
                this.readiness.IsReadyForApproval ? this.messageService.showSuccess(message) : this.messageService.showError(message);
            },
            error: err => this.messageService.showError(err)
        });
    }

    submitForApproval(): void {
        if (!this.readiness?.IsReadyForApproval || this.readiness.IsSubmittedForApproval) return;
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.submitForApproval(this.selectedId).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                this.readiness = response.data.Readiness;
                this.messageService.showSuccess(response.data.Message);
                this.leaseContractService.invalidateListCache();
                this.loadUI();
            },
            error: err => this.messageService.showError(err)
        });
    }

    private loadAgreement(): void {
        this.leaseContractService.getAgreement(this.selectedId).subscribe({
            next: response => this.agreement = response.data,
            error: () => this.agreement = null
        });
    }

    private loadTemplates(): void {
        this.documentTemplateService.list().subscribe({
            next: templates => {
                this.templates = templates.filter(template => this.isEligibleTemplate(template));
                this.templateChoicesUnavailable = false;
            },
            error: () => {
                // Choosing a template is an enhancement. Preview and issue are
                // still authorised and resolved by the server from the tenant's
                // configured default template.
                this.templates = [];
                this.templateChoicesUnavailable = true;
            }
        });
    }

    private loadReadiness(): void {
        this.leaseContractService.getReadiness(this.selectedId).subscribe({
            next: response => {
                this.readiness = response.data;
                this.refreshQuickOptions();
            },
            error: () => {
                this.readiness = null;
                this.refreshQuickOptions();
            }
        });
    }

    private loadExecution(): void {
        this.leaseContractService.getExecution(this.selectedId).subscribe({
            next: response => {
                this.execution = response.data;
                if (!this.signatureRequestForm.controls.RecipientEmail.dirty) {
                    this.signatureRequestForm.patchValue({ RecipientEmail: this.execution.CustomerSignerEmail || '' });
                }
                if (!this.executedAgreementForm.controls.RecipientEmail.dirty) {
                    this.executedAgreementForm.patchValue({ RecipientEmail: this.execution.CustomerSignerEmail || '' });
                }
                if (!this.signatureVerificationForm.dirty) {
                    this.signatureVerificationForm.patchValue({
                        CustomerSignerName: this.execution.CustomerSignerName || '',
                        CustomerSignedOnUtc: this.dateValue(this.execution.CustomerSignedOnUtc),
                        LessorSignerName: this.execution.LessorSignerName || '',
                        LessorSignedOnUtc: this.dateValue(this.execution.LessorSignedOnUtc)
                    });
                }
                this.refreshQuickOptions();
            },
            error: () => {
                this.execution = null;
                this.refreshQuickOptions();
            }
        });
    }

    private loadActivationReadiness(loaded?: () => void, failed?: () => void): void {
        this.leaseContractService.getActivationReadiness(this.selectedId).subscribe({
            next: response => {
                this.applyActivationReadiness(response.data);
                loaded?.();
            },
            error: () => {
                this.activationReadiness = null;
                this.refreshQuickOptions();
                failed?.();
            }
        });
    }

    private applyActivationReadiness(readiness: ILeaseContractActivationReadiness): void {
        this.activationReadiness = readiness;
        readiness.AssetRequirements.forEach(requirement => {
            const selectedAssetId = this.allocationSelections[requirement.LeaseContractAssetId];
            if (selectedAssetId === undefined || !requirement.AvailableAssets.some(asset => asset.AssetId === selectedAssetId)) {
                this.allocationSelections[requirement.LeaseContractAssetId] = null;
            }
        });
        this.loadDeliveryAssignments(readiness);
        this.loadDeliveryInsurance(readiness);
        this.loadDeliveryChecklists(readiness);
        this.refreshQuickOptions();
    }

    private loadDeliveryAssignments(readiness: ILeaseContractActivationReadiness): void {
        const assetIds = [...new Set(readiness.AssetRequirements.flatMap(requirement => requirement.AllocatedAssets.map(asset => asset.AssetId)))];
        this.assignmentStatusOptions = this.loggedInUserService.getPicklistOptions('AssetAssignmentStatus');
        if (!assetIds.length) {
            this.deliveryAssignments = {};
            return;
        }

        const tenantId = this.loggedInUserService.loggedInUser?.Tenant?.Id;
        this.assignmentLoading = true;
        const requests = assetIds.map(assetId => this.assetAssignmentService.search({
            Skip: 0, Take: 100, SortBy: 'AssignedFrom', IsDescending: true,
            Conditions: [
                { DBName: 'TenantId', Value: String(tenantId), DataType: DataType.Int, Operator: Operator.EqualTo },
                { DBName: 'AssetId', Value: String(assetId), DataType: DataType.Int, Operator: Operator.EqualTo }
            ]
        }).pipe(catchError(() => of(null))));
        forkJoin(requests).subscribe({
            next: responses => {
                const records: Record<number, IAssetAssignment[]> = {};
                responses.forEach((response: any, index: number) => {
                    records[assetIds[index]] = response?.data?.Records || [];
                    if (response?.permission) this.assignmentPermission = response.permission;
                });
                this.deliveryAssignments = records;
            },
            complete: () => this.assignmentLoading = false
        });
    }

    private loadDeliveryInsurance(readiness: ILeaseContractActivationReadiness): void {
        const assetIds = [...new Set(readiness.AssetRequirements.flatMap(requirement => requirement.AllocatedAssets.map(asset => asset.AssetId)))];
        if (!assetIds.length) {
            this.deliveryInsurance = {};
            return;
        }
        const tenantId = this.loggedInUserService.loggedInUser?.Tenant?.Id;
        this.insuranceLoading = true;
        const requests = assetIds.map(assetId => this.insurancePolicyAssetService.search({
            Skip: 0, Take: 100, SortBy: 'CoverageEndDate', IsDescending: true,
            Conditions: [
                { DBName: 'TenantId', Value: String(tenantId), DataType: DataType.Int, Operator: Operator.EqualTo },
                { DBName: 'AssetId', Value: String(assetId), DataType: DataType.Int, Operator: Operator.EqualTo },
                { DBName: 'LeaseContractId', Value: String(this.leaseContract.Id), DataType: DataType.Int, Operator: Operator.EqualTo }
            ]
        }).pipe(catchError(() => of(null))));
        forkJoin(requests).subscribe({
            next: responses => {
                const records: Record<number, IInsurancePolicyAsset[]> = {};
                responses.forEach((response: any, index: number) => {
                    records[assetIds[index]] = response?.data?.Records || [];
                    if (response?.permission) this.insurancePermission = response.permission;
                });
                this.deliveryInsurance = records;
                readiness.AssetRequirements.forEach(requirement => requirement.AllocatedAssets.forEach(asset => asset.InsuranceStatus = this.insuranceStatus(asset.AssetId)));
            },
            complete: () => this.insuranceLoading = false
        });
    }

    private loadDeliveryChecklists(readiness: ILeaseContractActivationReadiness): void {
        const contexts: IDeliveryChecklistContext[] = [];
        for (const requirement of readiness.AssetRequirements) {
            for (const asset of requirement.AllocatedAssets) {
                contexts.push({
                    LeaseContractId: this.leaseContract.Id,
                    LeaseContractAssetId: requirement.LeaseContractAssetId,
                    AssetId: asset.AssetId,
                    AssetLabel: `${asset.AssetNumber}${asset.Identifier ? ' — ' + asset.Identifier : ''}`,
                    AssetCategoryName: requirement.AssetCategoryName
                });
            }
        }
        if (!contexts.length) {
            this.deliveryChecklists = {};
            return;
        }
        this.checklistLoading = true;
        const requests = contexts.map(context => this.deliveryChecklistService.getOrCreate(context).pipe(catchError(() => of(null))));
        forkJoin(requests).subscribe({
            next: responses => {
                const records: Record<number, IDeliveryChecklistSnapshot | null> = {};
                responses.forEach((response: any, index: number) => records[contexts[index].AssetId] = response?.data || null);
                this.deliveryChecklists = records;
            },
            complete: () => this.checklistLoading = false
        });
    }

    private currentDeliveryAssignment(assetId: number): IAssetAssignment | null {
        // Keep the delivery form tied to its own contract. Other active
        // assignments stay in the candidate list so overlap validation (and
        // the server's validation) can prevent a conflicting new primary.
        const assignments = (this.deliveryAssignments[assetId] || []).filter(assignment =>
            String(assignment.ReferenceType || '').toUpperCase() === 'CONTRACT'
            && String(assignment.ReferenceId || '') === String(this.leaseContract.Id));
        return assignments.find(assignment => assignment.IsPrimary && String(assignment.RecordStatus || 'Active').toUpperCase() === 'ACTIVE' && !assignment.AssignedTo)
            || assignments.find(assignment => String(assignment.RecordStatus || 'Active').toUpperCase() === 'ACTIVE')
            || assignments[0]
            || null;
    }

    private refreshQuickOptions(): void {
        if (this.isActive) {
            this.quickOptionItems = [
                {
                    label: 'View Payment Schedule',
                    icon: 'pi pi-calendar',
                    command: () => this.openContractBillingRoute('/contracts/payment-schedules')
                },
                {
                    label: 'Generate Billing Run',
                    icon: 'pi pi-play-circle',
                    disabled: this.permission?.CanUpdate !== true,
                    command: () => this.openContractBillingRoute('/billing-finance/billing/runs/create')
                },
                {
                    label: 'View Billing Runs',
                    icon: 'pi pi-list',
                    command: () => this.openContractBillingRoute('/billing-finance/billing/runs')
                },
                {
                    label: 'View Customer Invoices',
                    icon: 'pi pi-file',
                    command: () => this.openContractBillingRoute('/billing-finance/invoices')
                }
            ];
            return;
        }

        this.quickOptionItems = [
            {
                label: 'Allocate Asset',
                icon: 'pi pi-plus',
                disabled: !this.canAllocateAsset || !this.canOpenAllocation,
                command: () => this.openAllocateAssetQuickOption()
            },
            {
                label: 'Record Delivery',
                icon: 'pi pi-truck',
                disabled: !this.canRecordDelivery || !this.findDeliveryTarget(),
                command: () => this.openDeliveryQuickOption()
            },
            {
                label: 'Record Customer Acceptance',
                icon: 'pi pi-check',
                disabled: !this.canRecordCustomerAcceptance || !this.findAcceptanceTarget(),
                command: () => this.openCustomerAcceptanceQuickOption()
            },
            {
                label: 'View Activation Conditions',
                icon: 'pi pi-list-check',
                disabled: !this.canViewActivationConditions,
                command: () => this.viewActivationConditions()
            },
            {
                label: 'Activate Contract',
                icon: 'pi pi-play',
                disabled: !this.canActivateContract || !this.activationReadiness?.IsReadyForActivation,
                command: () => this.openActivationQuickOption()
            }
        ];
    }

    private openContractBillingRoute(route: string): void {
        if (!this.leaseContract?.Id) return;
        this.router.navigate([route], { queryParams: { leaseContractId: this.leaseContract.Id } });
    }

    private findAllocationTarget(): ILeaseContractActivationRequirement | null {
        return this.activationReadiness?.AssetRequirements.find(requirement =>
            requirement.AllocatedAssets.length < requirement.RequiredQuantity) ?? null;
    }

    private findDeliveryTarget(): { requirement: ILeaseContractActivationRequirement; asset: ILeaseContractActivationAsset } | null {
        return this.findActivationAsset(asset => asset.IsValidAllocation && !asset.DeliveredOnUtc);
    }

    private findAcceptanceTarget(): { requirement: ILeaseContractActivationRequirement; asset: ILeaseContractActivationAsset } | null {
        return this.findActivationAsset(asset => asset.IsValidAllocation && !!asset.DeliveredOnUtc && !asset.AcceptanceStatusCode);
    }

    private findActivationAsset(matches: (asset: ILeaseContractActivationAsset) => boolean): { requirement: ILeaseContractActivationRequirement; asset: ILeaseContractActivationAsset } | null {
        for (const requirement of this.activationReadiness?.AssetRequirements || []) {
            const asset = requirement.AllocatedAssets.find(matches);
            if (asset) return { requirement, asset };
        }
        return null;
    }

    private focusActivationSection(): void {
        window.setTimeout(() => {
            const section = this.activationSection?.nativeElement;
            if (!section) return;
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            section.focus({ preventScroll: true });
        });
    }

    private focusActivationRequirement(leaseContractAssetId: number): void {
        window.setTimeout(() => {
            const requirement = document.getElementById(this.activationRequirementElementId(leaseContractAssetId));
            if (!requirement) {
                this.focusActivationSection();
                return;
            }
            requirement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            requirement.focus({ preventScroll: true });
        });
    }

    private focusAllocationTarget(): void {
        const requirement = this.findAllocationTarget();
        if (!requirement) {
            this.focusActivationSection();
            return;
        }
        this.focusActivationRequirement(requirement.LeaseContractAssetId);
    }

    activationRequirementElementId(leaseContractAssetId: number): string {
        return `activation-requirement-${leaseContractAssetId}`;
    }

    private synchroniseContractStatus(statusCode: string): void {
        if (this.readiness) this.readiness = { ...this.readiness, StatusCode: statusCode };
        if (this.execution) this.execution = { ...this.execution, ContractStatusCode: statusCode };
    }

    private runActivationAction(request: any, successMessage: string, completed?: () => void): void {
        let actionSucceeded = false;
        this.isLoading = true;
        this.spinner.show();
        request.pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
            if (actionSucceeded) this.loadUI();
        })).subscribe({
            next: (response: { data: ILeaseContractActivationReadiness }) => {
                this.applyActivationReadiness(response.data);
                completed?.();
                this.messageService.showSuccess(successMessage);
                actionSucceeded = true;
            },
            error: (err: any) => this.messageService.showError(err)
        });
    }

    private dateValue(value?: unknown): string {
        if (!value) return '';
        if (typeof value === 'string') return value.substring(0, 10);
        if (value instanceof Date && !Number.isNaN(value.getTime())) {
            const month = String(value.getMonth() + 1).padStart(2, '0');
            const day = String(value.getDate()).padStart(2, '0');
            return `${value.getFullYear()}-${month}-${day}`;
        }
        return '';
    }

    private runPdfAction(request: any, successMessage: string): void {
        this.isLoading = true;
        this.spinner.show();
        request.pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: (blob: Blob) => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank', 'noopener');
                window.setTimeout(() => URL.revokeObjectURL(url), 60000);
                this.messageService.showSuccess(successMessage);
            },
            error: (err: any) => this.messageService.showError(err)
        });
    }

    private downloadPdfAction(request: any, fileName: string, successMessage: string): void {
        this.isLoading = true;
        this.spinner.show();
        request.pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: (blob: Blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.setTimeout(() => URL.revokeObjectURL(url), 60000);
                this.messageService.showSuccess(successMessage);
            },
            error: (err: any) => this.messageService.showError(err)
        });
    }

    private isEligibleTemplate(template: DocumentTemplate): boolean {
        if (template.TemplateTypeCode?.toUpperCase() !== 'LEASE_CONTRACT' || template.RecordStatus?.toUpperCase() !== 'ACTIVE' || !template.EffectiveFrom) return false;
        const today = new Date().toISOString().substring(0, 10);
        const effectiveFrom = this.dateValue(template.EffectiveFrom);
        const effectiveTo = this.dateValue(template.EffectiveTo);
        return !!effectiveFrom && effectiveFrom <= today && (!effectiveTo || effectiveTo >= today);
    }

    private get templateIdForAgreement(): number | undefined {
        return this.selectedTemplateId ?? (this.templates.length === 1 ? this.templates[0].Id : undefined);
    }

    private normalizeStatus(status?: string | null): string {
        return (status || '').trim().toUpperCase().replace(/^LCS-/, '').replace(/-/g, '_');
    }

    get canViewActivationConditions(): boolean {
        return this.isPendingActivation && this.permissionService.hasPermission(this.permissionCodes.view);
    }

    get canAllocateAsset(): boolean {
        return this.isPendingActivation && this.permission?.CanUpdate === true;
    }

    get hasAllocationRequired(): boolean {
        return !!this.findAllocationTarget();
    }

    get canOpenAllocation(): boolean {
        return !this.activationReadiness || this.hasAllocationRequired;
    }

    get activationRequiredAssetCount(): number {
        return (this.activationReadiness?.AssetRequirements || []).reduce((total, requirement) => total + requirement.RequiredQuantity, 0);
    }

    get activationAllocatedAssetCount(): number {
        return this.activationAssets.length;
    }

    get activationDeliveredAssetCount(): number {
        return this.activationAssets.filter(asset => !!asset.DeliveredOnUtc).length;
    }

    get activationAwaitingAcceptanceCount(): number {
        return this.activationAssets.filter(asset => !!asset.DeliveredOnUtc && !asset.AcceptanceStatusCode).length;
    }

    get isAllocationComplete(): boolean {
        const requirements = this.activationReadiness?.AssetRequirements || [];
        return requirements.length > 0 && requirements.every(requirement => requirement.AllocatedAssets.length >= requirement.RequiredQuantity);
    }

    get isDeliveryComplete(): boolean {
        return this.isAllocationComplete && this.activationAssets.length > 0 && this.activationAssets.every(asset => !!asset.DeliveredOnUtc);
    }

    get isCustomerAcceptanceComplete(): boolean {
        return this.isDeliveryComplete && this.activationAssets.length > 0 && this.activationAssets.every(asset => asset.AcceptanceStatusCode === 'ACCEPTED');
    }

    get customerAcceptanceGuidance(): string {
        if (!this.isAllocationComplete) return 'Allocate every required physical asset before arranging delivery with the customer.';
        if (!this.isDeliveryComplete) return 'Record delivery for each allocated asset before requesting customer acceptance.';
        if (!this.isCustomerAcceptanceComplete) return 'Obtain confirmation through the agreed customer channel, then record the customer representative’s decision below.';
        return 'All allocated assets have been accepted. Complete any remaining activation conditions, then activate the lease.';
    }

    get canRecordDelivery(): boolean {
        return this.canAllocateAsset;
    }

    get canRecordCustomerAcceptance(): boolean {
        return this.canAllocateAsset;
    }

    get canActivateContract(): boolean {
        return this.isPendingActivation && this.permissionService.hasPermission(this.permissionCodes.activate);
    }

    get isDraft(): boolean { return this.normalizeStatus(this.readiness?.StatusCode) === 'DRAFT'; }
    get isPendingApproval(): boolean { return this.normalizeStatus(this.readiness?.StatusCode) === 'PENDING_APPROVAL'; }
    get isApproved(): boolean { return this.normalizeStatus(this.readiness?.StatusCode) === 'APPROVED'; }
    get isPendingExecution(): boolean { return this.normalizeStatus(this.readiness?.StatusCode) === 'PENDING_EXECUTION'; }
    get isPendingActivation(): boolean { return this.normalizeStatus(this.execution?.ContractStatusCode) === 'PENDING_ACTIVATION' || this.normalizeStatus(this.readiness?.StatusCode) === 'PENDING_ACTIVATION' || this.normalizeStatus(this.activationReadiness?.StatusCode) === 'PENDING_ACTIVATION'; }
    get isActive(): boolean { return this.normalizeStatus(this.execution?.ContractStatusCode) === 'ACTIVE' || this.normalizeStatus(this.readiness?.StatusCode) === 'ACTIVE' || this.normalizeStatus(this.activationReadiness?.StatusCode) === 'ACTIVE'; }
    get isExecutedAgreementAvailable(): boolean { return this.normalizeStatus(this.execution?.ExecutionStatusCode) === 'EXECUTED' && !!this.execution?.SignedAgreementDocumentId; }
    get canEditContract(): boolean { return this.isDraft && this.permission?.CanUpdate === true; }
    get signaturesVerified(): boolean {
        return this.execution?.CustomerSignatureStatusCode === 'SIGNED_VERIFIED' && this.execution?.LessorSignatureStatusCode === 'SIGNED_VERIFIED';
    }

    private get activationAssets(): ILeaseContractActivationAsset[] {
        return (this.activationReadiness?.AssetRequirements || []).flatMap(requirement => requirement.AllocatedAssets);
    }

     

    

}

