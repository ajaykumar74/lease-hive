import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CustomerInvoiceService } from '@/views/billings/customerInvoice/customerInvoice.service';
import { ReceivableService } from '@/views/billings/receivable/receivable.service';
import { PaymentReceiptService } from '@/views/billings/paymentReceipt/paymentReceipt.service';
import { BillingRunService } from '@/views/billings/billingRun/billingRun.service';
import { FinanceExceptionService } from '@/views/billings/financeException/financeException.service';

@Component({
    selector: 'app-billing-finance-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule, ChartModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './billing-finance-dashboard.component.html',
    styleUrl: './operations-dashboard.component.css'
})
export class BillingFinanceDashboardComponent implements OnInit {
    private readonly invoiceService = inject(CustomerInvoiceService);
    private readonly receivableService = inject(ReceivableService);
    private readonly receiptService = inject(PaymentReceiptService);
    private readonly billingRunService = inject(BillingRunService);
    private readonly exceptionService = inject(FinanceExceptionService);
    private readonly router = inject(Router);

    isLoading = true;
    hasLoadError = false;
    invoices: any[] = [];
    receivables: any[] = [];
    receipts: any[] = [];
    billingRuns: any[] = [];
    exceptions: any[] = [];
    cashData: any;
    cashOptions: any;

    ngOnInit(): void { this.loadDashboard(); }

    get outstandingAmount(): number { return this.receivables.reduce((sum, item) => sum + Number(item.OutstandingAmount || 0), 0); }
    get invoicedAmount(): number { return this.invoices.reduce((sum, item) => sum + Number(item.GrossAmount || 0), 0); }
    get receivedAmount(): number { return this.receipts.reduce((sum, item) => sum + Number(item.ReceiptAmount || 0), 0); }
    get unappliedAmount(): number { return this.receipts.reduce((sum, item) => sum + Number(item.UnappliedAmount || 0), 0); }
    get overdueReceivables(): any[] { const now = new Date(); return this.receivables.filter(item => Number(item.OutstandingAmount || 0) > 0 && this.asDate(item.DueDate) && this.asDate(item.DueDate)! < now).sort((a, b) => this.timeOf(a.DueDate) - this.timeOf(b.DueDate)); }
    get openExceptions(): any[] { return this.exceptions.filter(item => !item.ResolvedAtUtc && !String(item.StatusCode || '').toLowerCase().includes('closed')).slice(0, 5); }
    get recentInvoices(): any[] { return [...this.invoices].sort((a, b) => this.timeOf(b.InvoiceDate || b.CreatedDateTime) - this.timeOf(a.InvoiceDate || a.CreatedDateTime)).slice(0, 6); }
    get collectionRate(): number { return this.invoicedAmount ? Math.min(100, this.receivedAmount / this.invoicedAmount * 100) : 0; }
    get currencyCode(): string { return this.invoices.find(item => item.CurrencyCode)?.CurrencyCode || this.receivables.find(item => item.CurrencyCode)?.CurrencyCode || 'GBP'; }

    loadDashboard(): void {
        this.isLoading = true; this.hasLoadError = false;
        forkJoin({
            invoices: this.invoiceService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            receivables: this.receivableService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            receipts: this.receiptService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            billingRuns: this.billingRunService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            exceptions: this.exceptionService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.invoices = this.recordsOf(result.invoices);
            this.receivables = this.recordsOf(result.receivables);
            this.receipts = this.recordsOf(result.receipts);
            this.billingRuns = this.recordsOf(result.billingRuns);
            this.exceptions = this.recordsOf(result.exceptions);
            this.buildCashChart();
        });
    }

    openInvoice(item: any): void { this.router.navigate(['/billing-finance/invoices/view', item.Id]); }
    invoiceStatus(item: any): string { return item.InvoiceStatusName || item.StatusName || item.RecordStatus || 'Not set'; }
    severity(value: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const status = String(value || '').toLowerCase();
        if (status.includes('paid') || status.includes('issued') || status.includes('complete') || status.includes('resolved')) return 'success';
        if (status.includes('draft') || status.includes('pending') || status.includes('medium')) return 'warn';
        if (status.includes('overdue') || status.includes('failed') || status.includes('high') || status.includes('critical')) return 'danger';
        if (status.includes('partial') || status.includes('open')) return 'info';
        return 'secondary';
    }

    private buildCashChart(): void {
        const styles = getComputedStyle(document.documentElement);
        this.cashData = { labels: ['Invoiced', 'Received', 'Outstanding', 'Unapplied'], datasets: [{ data: [this.invoicedAmount, this.receivedAmount, this.outstandingAmount, this.unappliedAmount], backgroundColor: ['--p-blue-500', '--p-primary-color', '--p-orange-500', '--p-purple-500'].map(value => styles.getPropertyValue(value).trim()), borderRadius: 6 }] };
        this.cashOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim() }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: styles.getPropertyValue('--p-text-muted-color').trim() }, grid: { color: styles.getPropertyValue('--p-content-border-color').trim() } } } };
    }
    private failedFeed() { this.hasLoadError = true; return of([]); }
    private recordsOf(response: any): any[] { const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response; return Array.isArray(records) ? records : []; }
    private asDate(value: any): Date | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
    private timeOf(value: any): number { return this.asDate(value)?.getTime() ?? 0; }
}
