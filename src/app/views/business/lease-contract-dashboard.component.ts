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
import { LeaseContractService } from '@/views/leaseContracts/leaseContract/leaseContract.service';
import { LeaseContractStatusService } from '@/views/leaseContracts/leaseContractStatus/leaseContractStatus.service';
import { ContractConditionService } from '@/views/leaseContracts/contractCondition/contractCondition.service';
import { ContractApprovalRequestService } from '@/views/leaseContracts/contractApprovalRequest/contractApprovalRequest.service';
import { LeasePaymentScheduleService } from '@/views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule.service';

@Component({
    selector: 'app-lease-contract-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule, ChartModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './lease-contract-dashboard.component.html',
    styleUrl: './operations-dashboard.component.css'
})
export class LeaseContractDashboardComponent implements OnInit {
    private readonly contractService = inject(LeaseContractService);
    private readonly statusService = inject(LeaseContractStatusService);
    private readonly conditionService = inject(ContractConditionService);
    private readonly approvalService = inject(ContractApprovalRequestService);
    private readonly scheduleService = inject(LeasePaymentScheduleService);
    private readonly router = inject(Router);

    isLoading = true;
    hasLoadError = false;
    contracts: any[] = [];
    statuses: any[] = [];
    conditions: any[] = [];
    approvals: any[] = [];
    schedules: any[] = [];
    statusData: any;
    statusOptions: any;

    ngOnInit(): void { this.loadDashboard(); }

    get activeContracts(): any[] { return this.contracts.filter(item => this.statusName(item).toLowerCase().includes('active')); }
    get pendingApprovals(): any[] { return this.approvals.filter(item => !this.isClosed(item.ApprovalStatusCode)).slice(0, 5); }
    get openConditions(): any[] { return this.conditions.filter(item => !item.SatisfiedOn && !this.isClosed(item.StatusCode)); }
    get totalContractValue(): number { return this.schedules.reduce((sum, item) => sum + Number(item.TotalRentalAmount || 0) + Number(item.TotalTaxAmount || 0), 0); }
    get currencyCode(): string { return this.schedules.find(item => item.CurrencyCode)?.CurrencyCode || this.contracts.find(item => item.CurrencyCode)?.CurrencyCode || 'GBP'; }
    get maturingSoon(): any[] {
        const now = new Date(); const limit = new Date(); limit.setDate(limit.getDate() + 90);
        return this.contracts.filter(item => { const date = this.asDate(item.MaturityDate); return date && date >= now && date <= limit; })
            .sort((a, b) => this.timeOf(a.MaturityDate) - this.timeOf(b.MaturityDate)).slice(0, 5);
    }
    get recentContracts(): any[] { return [...this.contracts].sort((a, b) => this.timeOf(b.CreatedDateTime || b.ContractDate) - this.timeOf(a.CreatedDateTime || a.ContractDate)).slice(0, 6); }

    loadDashboard(): void {
        this.isLoading = true; this.hasLoadError = false;
        forkJoin({
            contracts: this.contractService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            statuses: this.statusService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            conditions: this.conditionService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            approvals: this.approvalService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            schedules: this.scheduleService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.contracts = this.recordsOf(result.contracts);
            this.statuses = this.recordsOf(result.statuses);
            this.conditions = this.recordsOf(result.conditions);
            this.approvals = this.recordsOf(result.approvals);
            this.schedules = this.recordsOf(result.schedules);
            this.buildStatusChart();
        });
    }

    openContract(item: any): void { this.router.navigate(['/contracts/view', item.Id]); }
    statusName(item: any): string { return this.statuses.find(status => Number(status.Id) === Number(item.LeaseContractStatusId))?.StatusName || item.LeaseContractStatusName || 'Not set'; }
    statusSeverity(value: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const status = String(value || '').toLowerCase();
        if (status.includes('active') || status.includes('complete') || status.includes('satisf')) return 'success';
        if (status.includes('pending') || status.includes('draft') || status.includes('review')) return 'warn';
        if (status.includes('cancel') || status.includes('terminat') || status.includes('reject')) return 'danger';
        if (status.includes('execut') || status.includes('approv')) return 'info';
        return 'secondary';
    }
    contractLabel(contractId: any): string { const item = this.contracts.find(contract => Number(contract.Id) === Number(contractId)); return item?.ContractNo || item?.ContractTitle || `Contract ${contractId}`; }

    private buildStatusChart(): void {
        const counts = new Map<string, number>();
        this.contracts.forEach(item => { const name = this.statusName(item); counts.set(name, (counts.get(name) || 0) + 1); });
        const groups = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
        const styles = getComputedStyle(document.documentElement);
        const colors = ['--p-primary-color', '--p-blue-500', '--p-orange-500', '--p-purple-500', '--p-cyan-500', '--p-pink-500', '--p-yellow-500'].map(value => styles.getPropertyValue(value).trim());
        this.statusData = { labels: groups.map(item => item[0]), datasets: [{ data: groups.map(item => item[1]), backgroundColor: colors, borderWidth: 0 }] };
        this.statusOptions = { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, color: styles.getPropertyValue('--p-text-color').trim() } } } };
    }
    private isClosed(value: any): boolean { const status = String(value || '').toLowerCase(); return ['approved', 'completed', 'satisfied', 'closed', 'cancelled', 'rejected'].some(item => status.includes(item)); }
    private failedFeed() { this.hasLoadError = true; return of([]); }
    private recordsOf(response: any): any[] { const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response; return Array.isArray(records) ? records : []; }
    private asDate(value: any): Date | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
    private timeOf(value: any): number { return this.asDate(value)?.getTime() ?? 0; }
}
