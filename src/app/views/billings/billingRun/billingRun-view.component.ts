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
import { CustomerInvoiceService } from '../customerInvoice/customerInvoice.service';
import { ICustomerInvoice } from '../customerInvoice/customerInvoice';

@Component({
    templateUrl: './billingRun-view.component.html', 
    styleUrls: ['./billingRun-workflow.css'],
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
    isIssuingInvoices = false;
    isInvoiceIssuanceSummaryLoading = false;
    draftInvoiceCount = 0;
    issuedInvoiceCount = 0;
    invoiceIssuanceSummaryError = '';
    invoiceIssueResult: any = null;
    private invoiceIssuanceSummaryRequest = 0;
    isValidating = false;
    isApproving = false;
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private billingRunService: BillingRunService, 
        private customerInvoiceService: CustomerInvoiceService,
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
                this.loadInvoiceIssuanceSummary();
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
        return this.isValidating || this.isApproving || this.isGeneratingInvoices || this.isIssuingInvoices;
    }

    get workflowItems() {
        return this.billingRun?.BillingRunItems || [];
    }

    get validItemCount(): number {
        return this.workflowItems.filter(item => this.validationStatus(item) === 'VALID').length;
    }

    get excludedItemCount(): number {
        return this.workflowItems.filter(item => this.validationStatus(item) === 'EXCLUDED').length;
    }

    get errorItemCount(): number {
        return this.workflowItems.filter(item => this.validationStatus(item) === 'INVALID' || this.validationStatus(item) === 'ERROR').length;
    }

    get validationStatusLabel(): string {
        return this.isDraft ? (this.errorItemCount ? 'Action required' : 'Ready to validate') : 'Validated';
    }

    get approvalStatusLabel(): string {
        return this.isApprovedForInvoiceGeneration ? 'Approved' : this.isValidated ? 'Ready for approval' : 'Pending validation';
    }

    get invoiceGenerationStatusLabel(): string {
        return this.hasGeneratedInvoices ? 'Draft invoices generated' : this.isApprovedForInvoiceGeneration ? 'Ready to execute' : 'Awaiting approval';
    }

    get invoiceIssuanceStatusLabel(): string {
        if (!this.hasGeneratedInvoices) return 'Awaiting draft invoices';
        if (this.isInvoiceIssuanceSummaryLoading) return 'Loading invoice status';
        if (this.draftInvoiceCount > 0) return 'Invoices ready to issue';
        return this.issuedInvoiceCount > 0 ? 'All listed invoices issued' : 'No invoices available';
    }

    get bulkIssueFailures(): any[] {
        return (this.invoiceIssueResult?.Invoices || []).filter((invoice: any) => invoice?.Outcome === 'Failed');
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
        if (!this.isApprovedForInvoiceGeneration || this.hasGeneratedInvoices || !this.permission?.CanUpdate || this.isWorkflowActionInProgress) return;

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
        if (!this.isApprovedForInvoiceGeneration || this.hasGeneratedInvoices || !this.permission?.CanUpdate || this.isGeneratingInvoices) return;

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

    confirmIssueAllInvoices(): void {
        if (!this.hasGeneratedInvoices || this.draftInvoiceCount <= 0 || !this.permission?.CanUpdate || this.isWorkflowActionInProgress) return;
        const count = this.draftInvoiceCount;
        this.confirmationService.confirm({
            key: 'billing-run-execution',
            header: 'Issue customer invoices',
            icon: 'pi pi-exclamation-triangle',
            message: `Issue ${count} eligible draft customer invoice${count === 1 ? '' : 's'}? Each invoice will be validated and processed independently.`,
            acceptLabel: 'Issue invoices',
            rejectLabel: 'Cancel',
            accept: () => this.issueAllInvoices()
        });
    }

    private issueAllInvoices(): void {
        if (!this.hasGeneratedInvoices || this.draftInvoiceCount <= 0 || !this.permission?.CanUpdate || this.isIssuingInvoices) return;

        this.isIssuingInvoices = true;
        this.invoiceIssueResult = null;
        this.spinner.show();
        this.billingRunService.issueInvoices(this.selectedId).subscribe({
            next: response => {
                this.invoiceIssueResult = response?.data || response;
                const result = this.invoiceIssueResult || {};
                this.messageService?.showSuccess(`${result.IssuedCount || 0} invoice(s) issued; ${result.SkippedCount || 0} skipped; ${result.FailedCount || 0} failed.`);
                this.loadUI();
            },
            error: err => this.messageService?.showError(this.getErrorMessage(err)),
            complete: () => {
                this.isIssuingInvoices = false;
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

    private loadInvoiceIssuanceSummary(): void {
        const requestId = ++this.invoiceIssuanceSummaryRequest;
        this.draftInvoiceCount = 0;
        this.issuedInvoiceCount = 0;
        this.invoiceIssuanceSummaryError = '';
        if (!this.hasGeneratedInvoices) {
            this.isInvoiceIssuanceSummaryLoading = false;
            return;
        }

        this.isInvoiceIssuanceSummaryLoading = true;
        this.loadInvoiceIssuancePage(requestId, 0, []);
    }

    private loadInvoiceIssuancePage(requestId: number, skip: number, invoices: ICustomerInvoice[]): void {
        this.customerInvoiceService.search({ Skip: skip, Take: 100, SortBy: 'Id', IsDescending: false, BillingRunId: this.selectedId, Conditions: [] })
            .subscribe({
                next: response => {
                    if (requestId !== this.invoiceIssuanceSummaryRequest) return;
                    const page = response?.data?.Records || [];
                    const allInvoices = invoices.concat(page);
                    const total = Number(response?.data?.TotalRecords || 0);
                    if (page.length > 0 && allInvoices.length < total) {
                        this.loadInvoiceIssuancePage(requestId, allInvoices.length, allInvoices);
                        return;
                    }
                    this.issuedInvoiceCount = allInvoices.filter(invoice => !!invoice.IsIssued || !!invoice.IssuedAtUtc).length;
                    this.draftInvoiceCount = allInvoices.length - this.issuedInvoiceCount;
                    this.isInvoiceIssuanceSummaryLoading = false;
                },
                error: error => {
                    if (requestId !== this.invoiceIssuanceSummaryRequest) return;
                    this.invoiceIssuanceSummaryError = this.getErrorMessage(error);
                    this.isInvoiceIssuanceSummaryLoading = false;
                }
            });
    }

    private validationStatus(item: any): string {
        return String(item?.ValidationStatus || '').trim().toUpperCase();
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

