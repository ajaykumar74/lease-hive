import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { PurchaseRequisitionService } from './purchaseRequisition.service';
import { IPurchaseRequisition, IPurchaseRequisitionApprovalWorkflow } from './purchaseRequisition';

@Component({
    templateUrl: './purchaseRequisition-view.component.html', 
    styleUrls: ['./purchaseRequisition-approval-workflow.component.css'],
standalone: false,
    providers: [MessageService]
})
export class PurchaseRequisitionViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    purchaseRequisition: IPurchaseRequisition = {} as IPurchaseRequisition;
    Caption: string = 'Loading...';
    approvalWorkflow: IPurchaseRequisitionApprovalWorkflow | null = null;
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private purchaseRequisitionService: PurchaseRequisitionService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService
    ) {

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
        this.purchaseRequisitionService.getById(this.selectedId).subscribe({
            next: data => {
                this.purchaseRequisition = data.data;
                this.permission = data.permission; 
                this.populateUI(this.purchaseRequisition);
                this.loadApprovalWorkflow();
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IPurchaseRequisition): void { 
        this.Caption = "Purchase Requisition Details #" + obj.Id;
    }

    private loadApprovalWorkflow(): void {
        this.purchaseRequisitionService.getApprovalWorkflow(this.selectedId).subscribe({
            next: response => this.approvalWorkflow = response.data,
            error: error => this.messageService.showError(error)
        });
    }

    get workflowStatusLabel(): string {
        return this.formatWorkflowStatus(this.approvalWorkflow?.StatusCode || this.approvalWorkflow?.ApprovalStatus);
    }

    get workflowToneClass(): string {
        switch (this.approvalWorkflow?.StatusCode) {
            case 'APPROVED': return 'is-approved';
            case 'PENDING_APPROVAL': return 'is-pending';
            case 'RETURNED': return 'is-returned';
            case 'REJECTED': return 'is-rejected';
            default: return 'is-draft';
        }
    }

    get workflowIconClass(): string {
        switch (this.approvalWorkflow?.StatusCode) {
            case 'APPROVED': return 'pi pi-check-circle';
            case 'PENDING_APPROVAL': return 'pi pi-clock';
            case 'RETURNED': return 'pi pi-reply';
            case 'REJECTED': return 'pi pi-times-circle';
            default: return 'pi pi-file-edit';
        }
    }

    get pendingApproverLabel(): string {
        if (this.approvalWorkflow?.PendingApprovers?.length) return this.approvalWorkflow.PendingApprovers.join(', ');
        return this.approvalWorkflow?.StatusCode === 'PENDING_APPROVAL' ? 'No matching approver configured' : 'Not awaiting approval';
    }

    get workflowHelperText(): string {
        switch (this.approvalWorkflow?.StatusCode) {
            case 'PENDING_APPROVAL': return 'Submitted and waiting for the assigned approver to make a decision.';
            case 'APPROVED': return 'Approved requisitions can be used for downstream purchase order creation.';
            case 'RETURNED': return 'Returned for correction. Update the requisition and submit it again.';
            case 'REJECTED': return 'This requisition was rejected. Review the decision history for details.';
            default: return 'Complete the requisition details, then submit it for approval.';
        }
    }

    workflowStepClass(step: number): string {
        const status = this.approvalWorkflow?.StatusCode;
        if (status === 'PENDING_APPROVAL') return step === 1 ? 'is-complete' : step === 2 ? 'is-active' : '';
        if (['APPROVED', 'RETURNED', 'REJECTED'].includes(status || '')) return step < 3 ? 'is-complete' : 'is-active';
        return step === 1 ? 'is-active' : '';
    }

    private formatWorkflowStatus(status?: string): string {
        return (status || 'Draft')
            .replace(/[_-]+/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, character => character.toUpperCase());
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

