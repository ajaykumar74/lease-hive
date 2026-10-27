import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { LeaseContractService } from './leaseContract.service';
import { ILeaseContract } from './leaseContract';
import { finalize } from 'rxjs';
import { DocumentTemplateService } from '@/views/documents/documentTemplate/document-template.service';
import { DocumentTemplate } from '@/views/documents/documentTemplate/document-template.models';
import { ILeaseContractReadiness } from './leaseContract-readiness';
import { ILeaseContractExecutionWorkflow } from './leaseContract-execution';
import { ILeaseContractActivationAsset, ILeaseContractActivationReadiness, ILeaseContractActivationRequirement } from './leaseContract-activation';

@Component({
    templateUrl: './leaseContract-view.component.html', 
    styleUrls: ['./leaseContract-view.component.css'],
standalone: false,
    providers: [MessageService]
})
export class LeaseContractViewComponent implements OnInit {
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
    signatureVerificationForm: any;
    activationReadiness: ILeaseContractActivationReadiness | null = null;
    allocationSelections: { [leaseContractAssetId: number]: number | null } = {};
    deliveryForm: any;
    acceptanceForm: any;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private leaseContractService: LeaseContractService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService,
        private documentTemplateService: DocumentTemplateService,
        private formBuilder: FormBuilder
    ) {
        this.signatureRequestForm = this.formBuilder.group({
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
        this.leaseContractService.getById(this.selectedId).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: data => {
                this.leaseContract = data.data;
                this.permission = data.permission; 
                this.populateUI(this.leaseContract);
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
        this.downloadPdfAction(
            this.leaseContractService.downloadAgreement(this.leaseContract.Id),
            this.agreement?.FileName || `Lease-Agreement-${this.leaseContract.Id}.pdf`,
            'Lease agreement downloaded.'
        );
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
                this.loadUI();
            },
            error: err => this.messageService.showError(err)
        });
    }

    selectAllocation(requirement: ILeaseContractActivationRequirement, assetId: number | null): void {
        this.allocationSelections[requirement.LeaseContractAssetId] = assetId;
    }

    allocateAsset(requirement: ILeaseContractActivationRequirement): void {
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
        if (this.deliveryForm.invalid) {
            this.deliveryForm.markAllAsTouched();
            this.messageService.showError('Enter delivery location, delivering person, and receiving person.');
            return;
        }
        const value = this.deliveryForm.getRawValue();
        this.runActivationAction(this.leaseContractService.recordAssetDelivery(this.leaseContract.Id, value), 'Asset delivery recorded. Confirm customer acceptance when available.', () => this.cancelDelivery());
    }

    beginAcceptance(requirement: ILeaseContractActivationRequirement, asset: ILeaseContractActivationAsset): void {
        this.acceptanceForm.reset({ LeaseContractAssetId: requirement.LeaseContractAssetId, AssetId: asset.AssetId, DecisionCode: 'ACCEPT', AcceptedOnUtc: '', AcceptedBy: '', Remarks: '' });
    }

    cancelAcceptance(): void { this.acceptanceForm.reset({ LeaseContractAssetId: 0, AssetId: 0, DecisionCode: 'ACCEPT', AcceptedOnUtc: '', AcceptedBy: '', Remarks: '' }); }

    recordAcceptance(): void {
        if (this.acceptanceForm.invalid) {
            this.acceptanceForm.markAllAsTouched();
            this.messageService.showError('Enter the customer representative confirming this decision.');
            return;
        }
        const value = this.acceptanceForm.getRawValue();
        this.runActivationAction(this.leaseContractService.recordAssetAcceptance(this.leaseContract.Id, value), value.DecisionCode === 'REJECT' ? 'Customer rejection recorded. Resolve delivery before activation.' : 'Customer acceptance recorded.', () => this.cancelAcceptance());
    }

    validateActivation(): void {
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
        if (!this.activationReadiness?.IsReadyForActivation) {
            this.messageService.showError('Validate and complete the activation requirements first.');
            return;
        }
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.activateContract(this.leaseContract.Id).pipe(finalize(() => {
            this.spinner.hide(); this.isLoading = false;
        })).subscribe({
            next: response => {
                this.applyActivationReadiness(response.data.Readiness);
                this.messageService.showSuccess(response.data.Message);
                this.loadUI();
            },
            error: err => this.messageService.showError(err)
        });
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
            next: response => this.readiness = response.data,
            error: () => this.readiness = null
        });
    }

    private loadExecution(): void {
        this.leaseContractService.getExecution(this.selectedId).subscribe({
            next: response => {
                this.execution = response.data;
                if (!this.signatureRequestForm.controls.RecipientEmail.dirty) {
                    this.signatureRequestForm.patchValue({ RecipientEmail: this.execution.CustomerSignerEmail || '' });
                }
                if (!this.signatureVerificationForm.dirty) {
                    this.signatureVerificationForm.patchValue({
                        CustomerSignerName: this.execution.CustomerSignerName || '',
                        CustomerSignedOnUtc: this.dateValue(this.execution.CustomerSignedOnUtc),
                        LessorSignerName: this.execution.LessorSignerName || '',
                        LessorSignedOnUtc: this.dateValue(this.execution.LessorSignedOnUtc)
                    });
                }
            },
            error: () => this.execution = null
        });
    }

    private loadActivationReadiness(): void {
        this.leaseContractService.getActivationReadiness(this.selectedId).subscribe({
            next: response => this.applyActivationReadiness(response.data),
            error: () => this.activationReadiness = null
        });
    }

    private applyActivationReadiness(readiness: ILeaseContractActivationReadiness): void {
        this.activationReadiness = readiness;
        readiness.AssetRequirements.forEach(requirement => {
            if (this.allocationSelections[requirement.LeaseContractAssetId] === undefined) this.allocationSelections[requirement.LeaseContractAssetId] = null;
        });
    }

    private runActivationAction(request: any, successMessage: string, completed?: () => void): void {
        this.isLoading = true;
        this.spinner.show();
        request.pipe(finalize(() => { this.spinner.hide(); this.isLoading = false; })).subscribe({
            next: (response: { data: ILeaseContractActivationReadiness }) => {
                this.applyActivationReadiness(response.data);
                completed?.();
                this.messageService.showSuccess(successMessage);
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

    get isDraft(): boolean { return this.normalizeStatus(this.readiness?.StatusCode) === 'DRAFT'; }
    get isPendingApproval(): boolean { return this.normalizeStatus(this.readiness?.StatusCode) === 'PENDING_APPROVAL'; }
    get isApproved(): boolean { return this.normalizeStatus(this.readiness?.StatusCode) === 'APPROVED'; }
    get isPendingExecution(): boolean { return this.normalizeStatus(this.readiness?.StatusCode) === 'PENDING_EXECUTION'; }
    get isPendingActivation(): boolean { return this.normalizeStatus(this.execution?.ContractStatusCode) === 'PENDING_ACTIVATION' || this.normalizeStatus(this.readiness?.StatusCode) === 'PENDING_ACTIVATION' || this.normalizeStatus(this.activationReadiness?.StatusCode) === 'PENDING_ACTIVATION'; }
    get canEditContract(): boolean { return this.isDraft && this.permission?.CanUpdate === true; }
    get signaturesVerified(): boolean {
        return this.execution?.CustomerSignatureStatusCode === 'SIGNED_VERIFIED' && this.execution?.LessorSignatureStatusCode === 'SIGNED_VERIFIED';
    }

     

    

}

