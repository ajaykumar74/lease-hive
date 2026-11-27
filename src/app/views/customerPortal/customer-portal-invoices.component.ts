import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogModule } from 'primeng/dialog';
import { CustomerPortalInvoice, CustomerPortalPaymentHistory, CustomerPortalWorkspaceService } from './customer-portal-workspace.service';
import { workspaceStyles } from './customer-portal-contracts.component';

@Component({
    selector: 'app-customer-portal-invoices',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe, FormsModule, DialogModule],
    styles: [workspaceStyles, `
        .billing-summary { display: flex; flex-wrap: wrap; gap: 1rem; margin: 1.25rem 0; }
        .summary-metric { min-width: 12.5rem; padding: 1rem 1.1rem; border: 1px solid #dbe7ef; border-radius: .75rem; background: linear-gradient(135deg, #fff 0%, #f6fafc 100%); }
        .summary-metric span { display: block; color: var(--text-color-secondary); font-size: .78rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
        .summary-metric strong { display: block; margin-top: .3rem; color: #143f5b; font-size: 1.5rem; line-height: 1.1; }
        .summary-metric.outstanding strong { color: #0b6b55; }
        .billing-tabs { display: flex; gap: .25rem; padding: .35rem .35rem 0; border-bottom: 1px solid var(--surface-border); background: #fbfdfe; }
        .billing-tab { position: relative; border: 0; border-radius: .5rem .5rem 0 0; padding: .75rem 1rem; background: transparent; color: var(--text-color-secondary); font-weight: 700; cursor: pointer; }
        .billing-tab:hover { background: #eef6f8; color: #135c74; }
        .billing-tab.active { color: #0e657f; }
        .billing-tab.active::after { position: absolute; right: .8rem; bottom: -1px; left: .8rem; height: 3px; border-radius: 3px 3px 0 0; background: #15916d; content: ''; }
        .tab-panel { overflow: auto; }
        .tab-empty { padding: 2rem 1.25rem; text-align: center; }
        .invoice-number { color: #163d59; font-size: .98rem; }
        .invoice-contract { display: inline-block; margin-top: .25rem; }
        .amount { font-variant-numeric: tabular-nums; white-space: nowrap; }
        .outstanding-amount { color: #0b6b55; }
        .row-actions { display: flex; justify-content: flex-end; gap: .5rem; white-space: nowrap; }
        .icon-action { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border: 1px solid transparent; border-radius: .5rem; cursor: pointer; transition: transform .15s ease, box-shadow .15s ease, background .15s ease; }
        .icon-action:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(15, 55, 75, .14); }
        .pay-action { background: #15805f; color: #fff; }.pay-action:hover { background: #0f694e; }
        .resume-action { background: #0f766e; color: #fff; }.resume-action:hover { background: #0b5d57; }
        .pdf-action { border-color: #cbdce5; background: #fff; color: #17627d; }.pdf-action:hover { background: #edf7fa; }
        .status { display: inline-flex; align-items: center; min-height: 1.75rem; padding: .2rem .6rem; border-radius: 999px; background: #e7f5fb; color: #165a72; font-size: .76rem; font-weight: 800; letter-spacing: .02em; text-transform: uppercase; }
        .status-success, .status-simulated-success { background: #e6f8ef; color: #087443; }.status-pending { background: #fff4d9; color: #8b5a00; }.status-failed, .status-cancelled { background: #fff0f1; color: #ba2636; }
        .checkout-banner { display: flex; gap: .55rem; align-items: center; margin-bottom: 1.25rem; padding: .8rem .9rem; border: 1px solid #f2d590; border-radius: .55rem; background: #fff8e6; color: #805500; font-size: .9rem; font-weight: 700; }
        .checkout-summary { display: grid; grid-template-columns: minmax(7rem, 1fr) 1fr; gap: .55rem 1rem; margin-bottom: 1.25rem; }.checkout-summary span { color: var(--text-color-secondary); }.checkout-summary strong { color: #153d59; }
        .checkout-form label { display: grid; gap: .45rem; margin-bottom: 1rem; color: #274b62; font-size: .9rem; font-weight: 700; }.checkout-form input, .checkout-form select { width: 100%; box-sizing: border-box; padding: .7rem .75rem; border: 1px solid var(--surface-border); border-radius: .45rem; background: var(--surface-card); color: var(--text-color); font: inherit; }.checkout-help { display: block; margin-top: -.55rem; margin-bottom: 1rem; }
        .checkout-actions { display: flex; justify-content: flex-end; gap: .5rem; flex-wrap: wrap; margin-top: 1.25rem; }.action-button { display: inline-flex; align-items: center; gap: .45rem; border: 1px solid transparent; border-radius: .45rem; padding: .65rem .85rem; color: #fff; font: inherit; font-weight: 700; cursor: pointer; }.action-button:disabled, .icon-action:disabled { opacity: .55; cursor: wait; transform: none; box-shadow: none; }.secondary-action { border-color: var(--surface-border); background: var(--surface-card); color: var(--text-color); }.cancel-action { background: #64748b; }.failure-action { background: #c2414f; }.success-action { background: #15805f; }.success-action:hover { background: #0f694e; }
        @media (max-width: 640px) { .billing-summary { display: grid; grid-template-columns: 1fr 1fr; gap: .65rem; }.summary-metric { min-width: 0; }.summary-metric strong { font-size: 1.2rem; }.billing-tab { flex: 1; }table { min-width: 720px; } }
    `],
    template: `
        <section class="portal-workspace">
            <div class="heading"><div><h1>Invoices &amp; payments</h1><p>Review issued invoices and payment activity.</p></div><a routerLink="/customer-portal/dashboard">Dashboard</a></div>
            <p *ngIf="loading" class="state">Loading invoices…</p><p *ngIf="error" class="error">{{ error }}</p>
            <ng-container *ngIf="!loading && !error">
                <section class="billing-summary" aria-label="Invoice summary"><article class="summary-metric"><span>Unpaid invoices</span><strong>{{ unpaidCount }}</strong></article><article class="summary-metric outstanding"><span>Total outstanding</span><strong>{{ totalOutstanding | number:'1.2-2' }}</strong></article></section>
                <section class="table-card">
                    <nav class="billing-tabs" role="tablist" aria-label="Invoice workspace"><button type="button" class="billing-tab" [class.active]="activeTab === 'invoices'" role="tab" [attr.aria-selected]="activeTab === 'invoices'" (click)="activeTab = 'invoices'"><i class="pi pi-file-invoice mr-2"></i>Invoices</button><button type="button" class="billing-tab" [class.active]="activeTab === 'history'" role="tab" [attr.aria-selected]="activeTab === 'history'" (click)="activeTab = 'history'"><i class="pi pi-history mr-2"></i>Payment history</button></nav>
                    <div class="tab-panel" *ngIf="activeTab === 'invoices'" role="tabpanel">
                        <table *ngIf="invoices.length; else emptyInvoices"><thead><tr><th>Invoice</th><th>Issue date</th><th>Due date</th><th>Payment status</th><th>Gross</th><th>Outstanding</th><th aria-label="Actions"></th></tr></thead><tbody><tr *ngFor="let invoice of invoices"><td><strong class="invoice-number">{{ invoice.InvoiceNo }}</strong><small class="invoice-contract" *ngIf="invoice.ContractNo">{{ invoice.ContractNo }}</small></td><td>{{ invoice.InvoiceDate | date:'mediumDate' }}</td><td>{{ invoice.DueDate | date:'mediumDate' }}</td><td><span class="status" [ngClass]="statusClass(invoice.PaymentStatus)">{{ invoice.PaymentStatus }}</span></td><td class="amount">{{ invoice.GrossAmount | currency:invoice.CurrencyCode:'symbol':'1.2-2' }}</td><td class="amount outstanding-amount"><strong>{{ invoice.OutstandingAmount | currency:invoice.CurrencyCode:'symbol':'1.2-2' }}</strong></td><td><div class="row-actions"><button *ngIf="invoice.CanPay" type="button" class="icon-action pay-action" title="Pay invoice" [attr.aria-label]="'Pay ' + invoice.InvoiceNo" (click)="openCheckout(invoice)"><i class="pi pi-credit-card"></i></button><button *ngIf="!invoice.CanPay && pendingPaymentFor(invoice.InvoiceId)" type="button" class="icon-action resume-action" title="Resume payment" [attr.aria-label]="'Resume payment for ' + invoice.InvoiceNo" (click)="resumeCheckout(invoice)"><i class="pi pi-play"></i></button><button *ngIf="invoice.HasIssuedPdf" type="button" class="icon-action pdf-action" title="Download invoice PDF" [attr.aria-label]="'Download PDF for ' + invoice.InvoiceNo" (click)="downloadPdf(invoice)"><i class="pi pi-download"></i></button></div></td></tr></tbody></table>
                        <ng-template #emptyInvoices><p class="state tab-empty">No issued invoices are available for your party.</p></ng-template>
                    </div>
                    <div class="tab-panel" *ngIf="activeTab === 'history'" role="tabpanel">
                        <table *ngIf="history.length; else emptyHistory"><thead><tr><th>Reference</th><th>Invoice</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th><th>Receipt</th></tr></thead><tbody><tr *ngFor="let item of history"><td>{{ item.TransactionReference }}</td><td>{{ item.InvoiceNo }}</td><td>{{ item.AttemptedAtUtc | date:'medium' }}</td><td class="amount">{{ item.Amount | currency:item.CurrencyCode:'symbol':'1.2-2' }}</td><td>{{ methodLabel(item.PaymentMethod) }}</td><td><span class="status" [ngClass]="statusClass(item.Status)">{{ item.Status }}</span></td><td>{{ item.PaymentReceiptId ? ('Receipt #' + item.PaymentReceiptId) : '—' }}</td></tr></tbody></table>
                        <ng-template #emptyHistory><p class="state tab-empty">No payment attempts have been recorded.</p></ng-template>
                    </div>
                </section>
            </ng-container>
        </section>
        <p-dialog [(visible)]="checkoutVisible" [modal]="true" [style]="{width:'min(34rem, 94vw)'}" [header]="pendingPayment ? 'Resume mock payment' : 'Mock payment checkout'"><div *ngIf="selected"><div class="checkout-banner"><i class="pi pi-info-circle"></i>Test mode — no real money will be transferred.</div><div class="checkout-summary"><span>Invoice</span><strong>{{ selected.InvoiceNo }}</strong><span>Outstanding</span><strong>{{ selected.OutstandingAmount | currency:selected.CurrencyCode:'symbol':'1.2-2' }}</strong></div><div class="checkout-form"><label>Payment amount<input type="number" min="0.01" [max]="selected.OutstandingAmount" step="0.01" [(ngModel)]="amount" [disabled]="submitting || !!pendingPayment"></label><small class="checkout-help">{{ pendingPayment ? 'This amount is reserved by the pending payment attempt.' : (selected.CurrencyCode + ' · full or partial amount') }}</small><label>Simulated payment method<select [(ngModel)]="paymentMethod" [disabled]="submitting || !!pendingPayment"><option value="UPI">UPI</option><option value="CARD">Debit / Credit Card</option><option value="NET_BANKING">Net Banking</option></select></label></div><p *ngIf="checkoutError" class="error">{{ checkoutError }}</p><div class="checkout-actions"><button type="button" class="action-button secondary-action" (click)="checkoutVisible = false" [disabled]="submitting"><i class="pi pi-times"></i>Close</button><button type="button" class="action-button cancel-action" (click)="start('CANCELLED')" [disabled]="submitting"><i class="pi pi-ban"></i>Simulate cancelled</button><button type="button" class="action-button failure-action" (click)="start('FAILED')" [disabled]="submitting"><i class="pi pi-times-circle"></i>Simulate failed</button><button type="button" class="action-button success-action" (click)="start('SUCCESS')" [disabled]="submitting"><i class="pi pi-check-circle"></i>Simulate success</button></div></div></p-dialog>
    `
})
export class CustomerPortalInvoicesComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    invoices: CustomerPortalInvoice[] = [];
    history: CustomerPortalPaymentHistory[] = [];
    activeTab: 'invoices' | 'history' = 'invoices';
    loading = true;
    error = '';
    checkoutVisible = false;
    submitting = false;
    checkoutError = '';
    selected?: CustomerPortalInvoice;
    pendingPayment?: CustomerPortalPaymentHistory;
    amount = 0;
    paymentMethod = 'UPI';

    constructor(private readonly workspace: CustomerPortalWorkspaceService) {}
    ngOnInit(): void { this.refresh(); }
    get unpaidCount(): number { return this.invoices.filter(invoice => invoice.OutstandingAmount > 0).length; }
    get totalOutstanding(): number { return this.invoices.reduce((total, invoice) => total + Math.max(0, invoice.OutstandingAmount), 0); }
    refresh(): void { this.loading = true; this.workspace.invoices().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: invoices => this.invoices = invoices || [], error: () => { this.error = 'Invoices could not be loaded.'; this.loading = false; }, complete: () => this.loading = false }); this.workspace.paymentHistory().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: history => this.history = history || [] }); }
    pendingPaymentFor(invoiceId: number): CustomerPortalPaymentHistory | undefined { return this.history.find(item => item.InvoiceId === invoiceId && item.Status.toUpperCase() === 'PENDING'); }
    openCheckout(invoice: CustomerPortalInvoice): void { this.selected = invoice; this.pendingPayment = undefined; this.amount = invoice.OutstandingAmount; this.paymentMethod = 'UPI'; this.checkoutError = ''; this.checkoutVisible = true; }
    resumeCheckout(invoice: CustomerPortalInvoice): void { const pending = this.pendingPaymentFor(invoice.InvoiceId); if (!pending) return; this.selected = invoice; this.pendingPayment = pending; this.amount = pending.Amount; this.paymentMethod = pending.PaymentMethod; this.checkoutError = ''; this.checkoutVisible = true; }
    start(outcome: 'SUCCESS' | 'FAILED' | 'CANCELLED'): void { if (this.pendingPayment) { this.completePending(outcome); return; } if (!this.selected || this.amount <= 0 || this.amount > this.selected.OutstandingAmount) { this.checkoutError = 'Enter an amount greater than zero and no more than the outstanding balance.'; return; } this.submitting = true; this.workspace.initiatePayment({ InvoiceId: this.selected.InvoiceId, Amount: this.amount, PaymentMethod: this.paymentMethod }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: attempt => this.workspace.completePayment(attempt.Id, outcome).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: () => { this.checkoutVisible = false; this.submitting = false; this.refresh(); }, error: () => { this.checkoutError = 'The payment attempt could not be completed.'; this.submitting = false; } }), error: () => { this.checkoutError = 'The payment attempt could not be created.'; this.submitting = false; } }); }
    completePending(outcome: 'SUCCESS' | 'FAILED' | 'CANCELLED'): void { if (!this.pendingPayment) return; this.submitting = true; this.workspace.completePayment(this.pendingPayment.TransactionId, outcome).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: () => { this.checkoutVisible = false; this.submitting = false; this.refresh(); }, error: () => { this.checkoutError = 'The pending payment could not be completed. You can try again.'; this.submitting = false; } }); }
    downloadPdf(invoice: CustomerPortalInvoice): void { this.workspace.invoicePdf(invoice.InvoiceId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: blob => { const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `Invoice-${invoice.InvoiceNo}.pdf`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 0); }, error: () => this.error = 'Invoice PDF could not be downloaded.' }); }
    methodLabel(value: string): string { return value === 'NET_BANKING' ? 'Net Banking' : value === 'CARD' ? 'Debit / Credit Card' : value; }
    statusClass(value: string): string { return `status-${String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`; }
}
