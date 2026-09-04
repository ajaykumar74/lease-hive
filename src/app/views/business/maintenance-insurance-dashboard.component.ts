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
import { MaintenanceWorkOrderService } from '@/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder.service';
import { MaintenanceScheduleService } from '@/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule.service';
import { AssetDowntimeService } from '@/views/maintenanceInsurances/assetDowntime/assetDowntime.service';
import { InsurancePolicyService } from '@/views/maintenanceInsurances/insurancePolicy/insurancePolicy.service';
import { InsuranceClaimService } from '@/views/maintenanceInsurances/insuranceClaim/insuranceClaim.service';
import { MaintenanceInsuranceExceptionService } from '@/views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException.service';

@Component({
    selector: 'app-maintenance-insurance-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule, ChartModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './maintenance-insurance-dashboard.component.html',
    styleUrl: './operations-dashboard.component.css'
})
export class MaintenanceInsuranceDashboardComponent implements OnInit {
    private readonly workOrderService = inject(MaintenanceWorkOrderService);
    private readonly scheduleService = inject(MaintenanceScheduleService);
    private readonly downtimeService = inject(AssetDowntimeService);
    private readonly policyService = inject(InsurancePolicyService);
    private readonly claimService = inject(InsuranceClaimService);
    private readonly exceptionService = inject(MaintenanceInsuranceExceptionService);
    private readonly router = inject(Router);

    isLoading = true;
    hasLoadError = false;
    workOrders: any[] = [];
    schedules: any[] = [];
    downtimes: any[] = [];
    policies: any[] = [];
    claims: any[] = [];
    exceptions: any[] = [];
    workOrderData: any;
    workOrderOptions: any;

    ngOnInit(): void { this.loadDashboard(); }

    get openWorkOrders(): any[] { return this.workOrders.filter(item => !this.isClosed(item.WorkOrderStatusCode)); }
    get activeDowntimes(): any[] { return this.downtimes.filter(item => !item.DowntimeEndAt); }
    get openClaims(): any[] { return this.claims.filter(item => !item.ClosedDate); }
    get openExceptions(): any[] { return this.exceptions.filter(item => !item.ResolvedAt && !this.isClosed(item.StatusCode)); }
    get maintenanceSpend(): number { return this.workOrders.reduce((sum, item) => sum + Number(item.ActualAmount || item.EstimateAmount || 0), 0); }
    get insuredValue(): number { return this.policies.reduce((sum, item) => sum + Number(item.TotalInsuredValue || 0), 0); }
    get currencyCode(): string { return this.workOrders.find(item => item.CurrencyCode)?.CurrencyCode || this.policies.find(item => item.CurrencyCode)?.CurrencyCode || 'GBP'; }
    get dueSchedules(): any[] {
        const now = new Date(); const limit = new Date(); limit.setDate(limit.getDate() + 30);
        return this.schedules.filter(item => { const due = this.asDate(item.DueDate); return due && due <= limit && !this.isClosed(item.DueStatusCode); })
            .sort((a, b) => this.timeOf(a.DueDate) - this.timeOf(b.DueDate));
    }
    get expiringPolicies(): any[] {
        const now = new Date(); const limit = new Date(); limit.setDate(limit.getDate() + 60);
        return this.policies.filter(item => { const end = this.asDate(item.PolicyEndDate); return end && end >= now && end <= limit; })
            .sort((a, b) => this.timeOf(a.PolicyEndDate) - this.timeOf(b.PolicyEndDate));
    }
    get recentWorkOrders(): any[] { return [...this.workOrders].sort((a, b) => this.timeOf(b.CreatedDateTime || b.PlannedStartAt) - this.timeOf(a.CreatedDateTime || a.PlannedStartAt)).slice(0, 6); }

    loadDashboard(): void {
        this.isLoading = true; this.hasLoadError = false;
        forkJoin({
            workOrders: this.workOrderService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            schedules: this.scheduleService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            downtimes: this.downtimeService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            policies: this.policyService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            claims: this.claimService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            exceptions: this.exceptionService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.workOrders = this.recordsOf(result.workOrders);
            this.schedules = this.recordsOf(result.schedules);
            this.downtimes = this.recordsOf(result.downtimes);
            this.policies = this.recordsOf(result.policies);
            this.claims = this.recordsOf(result.claims);
            this.exceptions = this.recordsOf(result.exceptions);
            this.buildWorkOrderChart();
        });
    }

    openWorkOrder(item: any): void { this.router.navigate(['/maintenance-insurance/maintenance/work-orders/view', item.Id]); }
    workOrderStatus(item: any): string { return item.WorkOrderStatusCode || 'Not set'; }
    severity(value: any): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const status = String(value || '').toLowerCase();
        if (status.includes('complete') || status.includes('closed') || status.includes('resolved') || status.includes('active')) return 'success';
        if (status.includes('urgent') || status.includes('critical') || status.includes('overdue') || status.includes('failed')) return 'danger';
        if (status.includes('pending') || status.includes('scheduled') || status.includes('medium')) return 'warn';
        if (status.includes('progress') || status.includes('open') || status.includes('approved')) return 'info';
        return 'secondary';
    }

    private buildWorkOrderChart(): void {
        const counts = new Map<string, number>();
        this.workOrders.forEach(item => { const status = this.workOrderStatus(item); counts.set(status, (counts.get(status) || 0) + 1); });
        const groups = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
        const styles = getComputedStyle(document.documentElement);
        const colors = ['--p-primary-color', '--p-blue-500', '--p-orange-500', '--p-purple-500', '--p-cyan-500', '--p-pink-500', '--p-yellow-500'].map(value => styles.getPropertyValue(value).trim());
        this.workOrderData = { labels: groups.map(item => item[0]), datasets: [{ data: groups.map(item => item[1]), backgroundColor: colors, borderWidth: 0 }] };
        this.workOrderOptions = { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, color: styles.getPropertyValue('--p-text-color').trim() } } } };
    }
    private isClosed(value: any): boolean { const status = String(value || '').toLowerCase(); return ['complete', 'closed', 'cancelled', 'resolved'].some(item => status.includes(item)); }
    private failedFeed() { this.hasLoadError = true; return of([]); }
    private recordsOf(response: any): any[] { const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response; return Array.isArray(records) ? records : []; }
    private asDate(value: any): Date | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
    private timeOf(value: any): number { return this.asDate(value)?.getTime() ?? 0; }
}
