import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { CustomerInvoiceService } from './customerInvoice.service';
import { ICustomerInvoice } from './customerInvoice';

@Component({
    templateUrl: './customerInvoice-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class CustomerInvoiceViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    customerInvoice: ICustomerInvoice = {} as ICustomerInvoice;
    Caption: string = 'Loading...';
    isWorkflowActionInProgress = false;
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private customerInvoiceService: CustomerInvoiceService, 
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
        this.customerInvoiceService.getById(this.selectedId).subscribe({
            next: data => {
                this.customerInvoice = data.data;
                this.permission = data.permission; 
                this.populateUI(this.customerInvoice);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: ICustomerInvoice): void { 
        this.Caption = "Invoice " + (obj.InvoiceId || ('#' + obj.Id));
    }

    get isIssued(): boolean {
        return !!this.customerInvoice?.IsIssued || !!this.customerInvoice?.IssuedAtUtc;
    }

    get invoiceStatusCode(): string {
        return String(this.customerInvoice?.InvoiceStatusCode || '').toUpperCase();
    }

    get canIssueInvoice(): boolean {
        return !this.isIssued && (this.invoiceStatusCode === 'DRAFT' || this.invoiceStatusCode === 'APPROVED') && this.canManageInvoice;
    }

    get canManageInvoice(): boolean {
        return !!this.permission?.CanUpdate && !this.isWorkflowActionInProgress;
    }

    previewInvoice(): void {
        if (this.isWorkflowActionInProgress) return;
        this.isWorkflowActionInProgress = true;
        this.customerInvoiceService.previewInvoicePdf(this.selectedId).subscribe({
            next: pdf => this.openPdf(pdf, this.isIssued ? `Invoice-${this.customerInvoice.InvoiceId}.pdf` : `Invoice-${this.selectedId}-draft-preview.pdf`),
            error: error => this.messageService?.showError(this.getErrorMessage(error)),
            complete: () => this.isWorkflowActionInProgress = false
        });
    }

    downloadInvoice(): void {
        if (!this.isIssued || this.isWorkflowActionInProgress) return;
        this.isWorkflowActionInProgress = true;
        this.customerInvoiceService.downloadInvoicePdf(this.selectedId).subscribe({
            next: pdf => this.downloadPdf(pdf, `Invoice-${this.customerInvoice.InvoiceId}.pdf`),
            error: error => this.messageService?.showError(this.getErrorMessage(error)),
            complete: () => this.isWorkflowActionInProgress = false
        });
    }

    issueInvoice(): void {
        if (this.isIssued || !this.canManageInvoice) return;
        this.isWorkflowActionInProgress = true;
        this.spinner?.show();
        this.customerInvoiceService.issueInvoice(this.selectedId).subscribe({
            next: response => {
                const warning = response?.data?.EmailQueueWarning;
                this.messageService?.showSuccess(warning || 'Invoice issued and final PDF created.');
                this.loadUI();
            },
            error: error => this.messageService?.showError(this.getErrorMessage(error)),
            complete: () => { this.isWorkflowActionInProgress = false; this.spinner?.hide(); }
        });
    }

    resendInvoiceEmail(): void {
        if (!this.isIssued || !this.canManageInvoice) return;
        this.isWorkflowActionInProgress = true;
        this.customerInvoiceService.resendInvoiceEmail(this.selectedId).subscribe({
            next: () => this.messageService?.showSuccess('Invoice email queued for delivery.'),
            error: error => this.messageService?.showError(this.getErrorMessage(error)),
            complete: () => this.isWorkflowActionInProgress = false
        });
    }

    viewCustomerPortalInvoice(): void {
        if (this.isIssued) this.router.navigate(['/customer-portal/invoices']);
    }

    private openPdf(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank', 'noopener');
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    }

    private downloadPdf(blob: Blob, filename: string): void {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
    }

    private getErrorMessage(error: any): string {
        const payload = error?.error || error;
        const errors = payload?.Errors || payload?.errors;
        if (Array.isArray(errors) && errors.length) return errors.join(' ');
        return payload?.ErrorMessage || payload?.message || payload?.Message || 'The invoice action could not be completed.';
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/billing-finance/invoices/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

