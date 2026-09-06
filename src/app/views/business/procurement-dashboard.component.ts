import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApprovalRequestService } from '@/views/procurements/approvalRequest/approvalRequest.service';
import { GoodsReceiptService } from '@/views/procurements/goodsReceipt/goodsReceipt.service';
import { ProcurementExceptionService } from '@/views/procurements/procurementException/procurementException.service';
import { PurchaseOrderService } from '@/views/procurements/purchaseOrder/purchaseOrder.service';
import { PurchaseRequisitionService } from '@/views/procurements/purchaseRequisition/purchaseRequisition.service';
import { SupplierInvoiceService } from '@/views/procurements/supplierInvoice/supplierInvoice.service';

@Component({
    selector: 'app-procurement-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, ChartModule, SelectModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './procurement-dashboard.component.html',
    styleUrl: './procurement-dashboard.component.css'
})
export class ProcurementDashboardComponent implements OnInit {
    private readonly requisitionService = inject(PurchaseRequisitionService);
    private readonly purchaseOrderService = inject(PurchaseOrderService);
    private readonly approvalService = inject(ApprovalRequestService);
    private readonly invoiceService = inject(SupplierInvoiceService);
    private readonly receiptService = inject(GoodsReceiptService);
    private readonly exceptionService = inject(ProcurementExceptionService);
    private readonly router = inject(Router);

    readonly periodOptions = [
        { label: 'This month', value: 'month' },
        { label: 'This quarter', value: 'quarter' },
        { label: 'This year', value: 'year' }
    ];

    selectedPeriod = 'month';
    isLoading = true;
    hasLoadError = false;
    requisitions: any[] = [];
    purchaseOrders: any[] = [];
    approvals: any[] = [];
    invoices: any[] = [];
    receipts: any[] = [];
    exceptions: any[] = [];
    pipelineData: any;
    pipelineOptions: any;

    ngOnInit(): void {
        this.loadDashboard();
    }

    get activeRequisitions(): any[] {
        return this.requisitions.filter(item => this.isActive(item));
    }

    get openRequisitions(): any[] {
        return this.activeRequisitions.filter(item => !this.isClosed(item.RequisitionStatusCode || item.RequisitionStatusName || item.StatusCode));
    }

    get openPurchaseOrders(): any[] {
        return this.purchaseOrders.filter(item => this.isActive(item) && !this.isClosed(item.PurchaseOrderStatusCode || item.PurchaseOrderStatusName || item.StatusCode));
    }

    get committedValue(): number {
        return this.openPurchaseOrders.reduce((total, item) => total + this.numberValue(item.TotalAmount || item.Subtotal), 0);
    }

    get pendingApprovals(): any[] {
        return this.approvals.filter(item => this.isPending(item.ApprovalStatusCode || item.StatusCode));
    }

    get openExceptions(): any[] {
        return this.exceptions.filter(item => !this.isClosed(item.StatusCode || item.ExceptionStatusCode || item.ResolutionStatusCode));
    }

    get exceptionCount(): number {
        return this.openExceptions.length;
    }

    get unmatchedInvoiceCount(): number {
        return this.invoices.filter(item => !this.isClosed(item.MatchStatusCode || item.StatusCode) && !this.isActiveMatch(item.MatchStatusCode)).length;
    }

    get receiptsAwaitingAction(): any[] {
        return this.receipts.filter(item => !this.isClosed(item.GoodsReceiptStatusCode || item.GoodsReceiptStatusName || item.StatusCode));
    }

    get periodPurchaseOrders(): any[] {
        return this.openPurchaseOrders.filter(item => this.inSelectedPeriod(item.PODate || item.CreatedDateTime));
    }

    get periodRequisitions(): any[] {
        return this.activeRequisitions.filter(item => this.inSelectedPeriod(item.RequisitionDate || item.CreatedDateTime));
    }

    get recentRequisitions(): any[] {
        return [...this.activeRequisitions]
            .sort((a, b) => this.timeOf(b.RequisitionDate || b.CreatedDateTime) - this.timeOf(a.RequisitionDate || a.CreatedDateTime))
            .slice(0, 6);
    }

    get attentionItems(): any[] {
        const approvals = this.pendingApprovals.slice(0, 3).map(item => ({
            id: item.Id,
            icon: 'pi pi-check-square',
            title: item.ReferenceType || 'Approval request',
            detail: item.ReferenceId ? `Reference ${item.ReferenceId}` : 'Waiting for an approval decision',
            label: 'Pending',
            severity: 'warn' as const,
            route: '/business/procurement/approvals/pending'
        }));
        const exceptions = this.openExceptions.slice(0, 3).map(item => ({
            id: item.Id,
            icon: 'pi pi-exclamation-triangle',
            title: item.ExceptionTypeCode || 'Procurement exception',
            detail: item.Description || item.ReferenceType || 'Exception requires review',
            label: item.SeverityCode || 'Open',
            severity: this.exceptionSeverity(item.SeverityCode),
            route: '/business/procurement/exceptions'
        }));
        return [...approvals, ...exceptions].slice(0, 5);
    }

    loadDashboard(): void {
        this.isLoading = true;
        this.hasLoadError = false;
        forkJoin({
            requisitions: this.requisitionService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            purchaseOrders: this.purchaseOrderService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            approvals: this.approvalService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            invoices: this.invoiceService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            receipts: this.receiptService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            exceptions: this.exceptionService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.requisitions = this.recordsOf(result.requisitions);
            this.purchaseOrders = this.recordsOf(result.purchaseOrders);
            this.approvals = this.recordsOf(result.approvals);
            this.invoices = this.recordsOf(result.invoices);
            this.receipts = this.recordsOf(result.receipts);
            this.exceptions = this.recordsOf(result.exceptions);
            this.buildPipelineChart();
        });
    }

    onPeriodChange(): void {
        this.buildPipelineChart();
    }

    openRequisition(item: any): void {
        this.router.navigate(['/business/procurement/requisitions/view', item.Id]);
    }

    requisitionStatus(item: any): string {
        return item.RequisitionStatusName || item.RequisitionStatusCode || item.StatusCode || (item.PurchaseRequisitionStatusId ? `Status ${item.PurchaseRequisitionStatusId}` : 'Not set');
    }

    purchaseOrderStatus(item: any): string {
        return item.PurchaseOrderStatusName || item.PurchaseOrderStatusCode || item.StatusCode || (item.PurchaseOrderStatusId ? `Status ${item.PurchaseOrderStatusId}` : 'Not set');
    }

    statusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const value = String(status || '').toLowerCase();
        if (value.includes('approved') || value.includes('complete') || value.includes('closed') || value.includes('received')) return 'success';
        if (value.includes('pending') || value.includes('review') || value.includes('draft')) return 'warn';
        if (value.includes('reject') || value.includes('cancel') || value.includes('failed')) return 'danger';
        if (value.includes('open') || value.includes('issued') || value.includes('progress')) return 'info';
        return 'secondary';
    }

    private buildPipelineChart(): void {
        const groups = new Map<string, number>();
        this.periodRequisitions.forEach(item => {
            const status = this.requisitionStatus(item);
            groups.set(status, (groups.get(status) || 0) + 1);
        });
        const entries = [...groups.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
        const styles = getComputedStyle(document.documentElement);
        const primary = styles.getPropertyValue('--p-primary-color').trim() || '#10b981';
        const textColor = styles.getPropertyValue('--p-text-color').trim() || '#334155';
        const mutedColor = styles.getPropertyValue('--p-text-muted-color').trim() || '#64748b';
        const borderColor = styles.getPropertyValue('--p-content-border-color').trim() || '#e2e8f0';
        this.pipelineData = {
            labels: entries.map(entry => entry[0]),
            datasets: [{ label: 'Requisitions', data: entries.map(entry => entry[1]), backgroundColor: primary, borderRadius: 5 }]
        };
        this.pipelineOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: mutedColor }, grid: { display: false }, border: { color: borderColor } },
                y: { beginAtZero: true, ticks: { color: mutedColor, precision: 0 }, grid: { color: borderColor }, border: { display: false } }
            },
            animation: { duration: 300 }
        };
        if (this.pipelineData) this.pipelineOptions.plugins.legend.labels = { color: textColor };
    }

    private isActive(item: any): boolean {
        return !item.RecordStatus || String(item.RecordStatus).toLowerCase() === 'active';
    }

    private isClosed(status: any): boolean {
        const value = String(status || '').toLowerCase();
        return value.includes('closed') || value.includes('complete') || value.includes('cancel') || value.includes('reject') || value.includes('resolved');
    }

    private isPending(status: any): boolean {
        const value = String(status || '').toLowerCase();
        return !value || value.includes('pending') || value.includes('review') || value.includes('submitted') || value.includes('waiting');
    }

    private isActiveMatch(status: any): boolean {
        const value = String(status || '').toLowerCase();
        return value.includes('matched') || value.includes('passed') || value.includes('complete');
    }

    private exceptionSeverity(value: any): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const severity = String(value || '').toLowerCase();
        if (severity.includes('critical') || severity.includes('high')) return 'danger';
        if (severity.includes('medium')) return 'warn';
        return 'info';
    }

    private inSelectedPeriod(value: any): boolean {
        const date = this.asDate(value);
        return !!date && date >= this.periodStart();
    }

    private periodStart(): Date {
        const today = new Date();
        if (this.selectedPeriod === 'year') return new Date(today.getFullYear(), 0, 1);
        if (this.selectedPeriod === 'quarter') return new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return new Date(today.getFullYear(), today.getMonth(), 1);
    }

    numberValue(value: any): number {
        const number = Number(value);
        return Number.isFinite(number) ? number : 0;
    }

    private failedFeed() {
        this.hasLoadError = true;
        return of([]);
    }

    private recordsOf(response: any): any[] {
        const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response;
        return Array.isArray(records) ? records : [];
    }

    private asDate(value: any): Date | null {
        if (!value) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    private timeOf(value: any): number {
        return this.asDate(value)?.getTime() ?? 0;
    }
}
