import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { BillingRunService } from './billingRun.service';
import { IBillingRun } from './billingRun';

@Component({
    templateUrl: './billingRun-view.component.html', 
standalone: false,
    providers: [MessageService, ConfirmationService]
})
export class BillingRunViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    billingRun: IBillingRun = {} as IBillingRun;
    Caption: string = 'Loading...';
    isGeneratingInvoices = false;
    isValidating = false;
    isApproving = false;
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private billingRunService: BillingRunService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService,
        private confirmationService: ConfirmationService
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
        this.billingRunService.getById(this.selectedId).subscribe({
            next: data => {
                this.billingRun = data.data;
                this.permission = data.permission; 
                this.populateUI(this.billingRun);
            },
            error: err => {
                this.isLoading = false;
                this.spinner.hide();
                this.messageService?.showError(this.getErrorMessage(err));
            },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IBillingRun): void { 
        this.Caption = "BillingRun Details #" + obj.Id;
    }

    get billingRunStatusCode(): string {
        return String(this.billingRun?.BillingRunStatusCode || '').toUpperCase();
    }

    get isDraft(): boolean {
        return this.billingRunStatusCode === 'DRAFT';
    }

    get isValidated(): boolean {
        return this.billingRunStatusCode === 'VALIDATED';
    }

    get isApprovedForInvoiceGeneration(): boolean {
        return this.billingRunStatusCode === 'APPROVED';
    }

    get isWorkflowActionInProgress(): boolean {
        return this.isValidating || this.isApproving || this.isGeneratingInvoices;
    }

    get hasGeneratedInvoices(): boolean {
        return Number(this.billingRun?.InvoiceCount || 0) > 0
            || (this.billingRun?.BillingRunItems || []).some(item => Number(item.CustomerInvoiceId || 0) > 0);
    }

    validateBillingRun(): void {
        if (!this.isDraft || !this.permission?.CanUpdate || this.isWorkflowActionInProgress) return;

        this.isValidating = true;
        this.spinner.show();
        this.billingRunService.validateBillingRun(this.selectedId).subscribe({
            next: response => {
                this.messageService?.showSuccess(response?.Message || response?.message || 'Billing run validated.');
                this.loadUI();
            },
            error: err => {
                this.isValidating = false;
                this.spinner.hide();
                this.messageService?.showError(this.getErrorMessage(err));
                // Invalid items are persisted with their exclusion reasons, so refresh even when
                // validation intentionally returns an error response.
                this.loadUI();
            },
            complete: () => {
                this.isValidating = false;
                this.spinner.hide();
            }
        });
    }

    approveBillingRun(): void {
        if (!this.isValidated || !this.permission?.CanUpdate || this.isWorkflowActionInProgress) return;

        this.isApproving = true;
        this.spinner.show();
        this.billingRunService.approveBillingRun(this.selectedId).subscribe({
            next: response => {
                this.messageService?.showSuccess(response?.Message || response?.message || 'Billing run approved.');
                this.loadUI();
            },
            error: err => {
                this.isApproving = false;
                this.spinner.hide();
                this.messageService?.showError(this.getErrorMessage(err));
            },
            complete: () => {
                this.isApproving = false;
                this.spinner.hide();
            }
        });
    }

    confirmExecution(): void {
        if (!this.isApprovedForInvoiceGeneration || !this.permission?.CanUpdate || this.isWorkflowActionInProgress) return;

        this.confirmationService.confirm({
            key: 'billing-run-execution',
            header: 'Generate draft invoices',
            icon: 'pi pi-exclamation-triangle',
            message: 'Generate draft invoices for every valid, uninvoiced item in this approved billing run?',
            acceptLabel: 'Generate invoices',
            rejectLabel: 'Cancel',
            accept: () => this.generateDraftInvoices()
        });
    }

    private generateDraftInvoices(): void {
        if (!this.isApprovedForInvoiceGeneration || !this.permission?.CanUpdate || this.isGeneratingInvoices) return;

        this.isGeneratingInvoices = true;
        this.spinner.show();
        this.billingRunService.generateDraftInvoices(this.selectedId).subscribe({
            next: response => {
                this.messageService?.showSuccess(response?.Message || response?.message || 'Draft invoices generated.');
                this.loadUI();
            },
            error: err => {
                this.isGeneratingInvoices = false;
                this.spinner.hide();
                this.messageService?.showError(this.getErrorMessage(err));
            },
            complete: () => {
                this.isGeneratingInvoices = false;
                this.spinner.hide();
            }
        });
    }

    viewGeneratedInvoices(): void {
        const contractIds = Array.from(new Set((this.billingRun.BillingRunItems || [])
            .map(item => Number(item.LeaseContractId))
            .filter(contractId => Number.isInteger(contractId) && contractId > 0)));
        const queryParams: any = { billingRunId: this.selectedId };
        if (contractIds.length === 1) queryParams.leaseContractId = contractIds[0];
        this.router.navigate(['/billing-finance/invoices'], { queryParams });
    }

    viewInvoice(customerInvoiceId: number): void {
        if (customerInvoiceId > 0) this.router.navigate(['/billing-finance/invoices/view/' + customerInvoiceId]);
    }

    private getErrorMessage(error: any): string {
        if (typeof error === 'string' && error.trim()) return error;
        const payload = error?.error || error;
        const errors = payload?.Errors || payload?.errors;
        if (Array.isArray(errors) && errors.length > 0) return errors.join(' ');
        return payload?.ErrorMessage || payload?.message || payload?.Message || 'The billing-run action could not be completed.';
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/billing-finance/billing/runs/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

