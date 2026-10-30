import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { PaymentReceiptService } from './paymentReceipt.service';
import { IEligibleReceivable, IPaymentReceipt, IPaymentReceiptAllocationWorkspace } from './paymentReceipt';

interface AllocationLine extends IEligibleReceivable {
    Selected: boolean;
    Amount: number | null;
}

@Component({
    templateUrl: './paymentReceipt-view.component.html', 
    styleUrls: ['./paymentReceipt-view.component.css'],
standalone: false,
    providers: [MessageService]
})
export class PaymentReceiptViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    paymentReceipt: IPaymentReceipt = {} as IPaymentReceipt;
    Caption: string = 'Loading...';
    isConfirming = false;
    isAllocating = false;
    allocationWorkspace: IPaymentReceiptAllocationWorkspace | null = null;
    allocationLines: AllocationLine[] = [];
    private allocationRequestId: string | null = null;
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private paymentReceiptService: PaymentReceiptService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService
    ) {

    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent; 

    get isConfirmed(): boolean {
        return this.allocationWorkspace?.IsConfirmed ?? !!this.paymentReceipt?.VerifiedAtUtc;
    }

    get availableBalance(): number {
        return this.allocationWorkspace?.UnallocatedAmount ?? Math.max(0, (this.paymentReceipt?.ReceiptAmount || 0) - (this.paymentReceipt?.AllocatedAmount || 0));
    }

    get allocationTotal(): number {
        return this.allocationLines.filter(line => line.Selected).reduce((total, line) => total + Number(line.Amount || 0), 0);
    }

    get canAllocatePayment(): boolean {
        return this.isConfirmed && this.availableBalance > 0.0001;
    }

    get draftRecordedBy(): string {
        return this.paymentReceipt?.CreatedByCode?.trim() || 'Not recorded';
    }

    get confirmedBy(): string {
        return this.paymentReceipt?.ModifiedByCode?.trim() || 'Not recorded';
    }

    ngOnInit(): void { 
        this.selectedId = Number(this.activatedRouter.snapshot.params['id']); 
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.loadUI(), 300);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.paymentReceiptService.getById(this.selectedId).subscribe({
            next: data => {
                this.paymentReceipt = data.data;
                this.permission = data.permission; 
                this.populateUI(this.paymentReceipt);
                this.loadAllocationWorkspace();
            },
            error: err => this.showError(err),
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IPaymentReceipt): void { 
        this.Caption = "PaymentReceipt Details #" + obj.Id;
    }

    loadAllocationWorkspace(): void {
        this.paymentReceiptService.getAllocationWorkspace(this.selectedId).subscribe({
            next: data => {
                this.allocationWorkspace = data.data;
                this.allocationLines = (this.allocationWorkspace?.EligibleReceivables || []).map(receivable => ({
                    ...receivable,
                    Selected: false,
                    Amount: null
                }));
            },
            error: err => this.showError(err)
        });
    }

    confirmPayment(): void {
        if (this.isConfirming || !this.permission?.CanUpdate || this.isConfirmed) return;
        this.isConfirming = true; this.spinner?.show();
        this.paymentReceiptService.confirm(this.selectedId).subscribe({
            next: r => { this.messageService?.showSuccess(r?.Message || r?.message || 'Payment confirmed.'); this.loadUI(); },
            error: e => this.showError(e),
            complete: () => { this.isConfirming = false; this.spinner?.hide(); }
        });
    }

    allocatePayment(): void {
        if (!this.permission?.CanUpdate || this.isAllocating) return;
        if (!this.canAllocatePayment) {
            this.messageService?.showError('This receipt has no remaining balance. Create another payment receipt or reverse an existing allocation before allocating more.');
            return;
        }
        const allocations = this.allocationLines.filter(line => line.Selected)
            .map(line => ({ ReceivableId: line.ReceivableId, Amount: Number(line.Amount || 0) }));
        const total = allocations.reduce((sum, allocation) => sum + allocation.Amount, 0);
        if (!allocations.length || allocations.some(allocation => allocation.Amount <= 0)) {
            this.messageService?.showError('Select at least one receivable and enter a positive allocation amount.');
            return;
        }
        if (total > this.availableBalance + 0.0001) {
            this.messageService?.showError('The allocation total cannot exceed the available receipt balance.');
            return;
        }
        this.allocationRequestId ??= this.createRequestId();
        this.isAllocating = true;
        this.spinner?.show();
        this.paymentReceiptService.allocate(this.selectedId, { IdempotencyKey: this.allocationRequestId, Allocations: allocations }).subscribe({
            next: response => {
                this.messageService?.showSuccess(response?.Message || response?.message || 'Payment allocated successfully.');
                this.allocationRequestId = null;
                this.loadUI();
            },
            // Retain the idempotency key after a timeout: clicking Allocate again remains safe.
            error: error => this.showError(error),
            complete: () => { this.isAllocating = false; this.spinner?.hide(); }
        });
    }

    onAllocationSelectionChanged(line: AllocationLine): void {
        if (!this.canAllocatePayment) {
            line.Selected = false;
            line.Amount = null;
            return;
        }

        line.Amount = line.Selected ? this.maxAllocationFor(line) : null;
    }

    onAllocationAmountChanged(line: AllocationLine): void {
        if (!line.Selected) return;

        const amount = Number(line.Amount || 0);
        line.Amount = Math.min(Math.max(0, amount), this.maxAllocationFor(line));
    }

    maxAllocationFor(line: AllocationLine): number {
        const otherSelectedTotal = this.allocationLines
            .filter(other => other !== line && other.Selected)
            .reduce((total, other) => total + Number(other.Amount || 0), 0);

        return Math.max(0, Math.min(Number(line.OutstandingAmount || 0), this.availableBalance - otherSelectedTotal));
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/billing-finance/payments/receipts/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

    private createRequestId(): string {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
            const value = Math.floor(Math.random() * 16);
            return (character === 'x' ? value : (value & 0x3) | 0x8).toString(16);
        });
    }

    private showError(error: unknown): void {
        const message = typeof error === 'string'
            ? error
            : (error as any)?.error?.ErrorMessage || (error as any)?.error?.message || 'The payment action could not be completed.';
        this.messageService?.showError(message);
    }

     

    

}

