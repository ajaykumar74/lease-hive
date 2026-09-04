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
import { EndOfLeaseCaseService } from '@/views/eolDisposals/endOfLeaseCase/endOfLeaseCase.service';
import { AssetReturnService } from '@/views/eolDisposals/assetReturn/assetReturn.service';
import { ReturnAssessmentService } from '@/views/eolDisposals/returnAssessment/returnAssessment.service';
import { EndOfLeaseSettlementService } from '@/views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement.service';
import { DisposalCaseService } from '@/views/eolDisposals/disposalCase/disposalCase.service';
import { EndOfLeaseDisposalExceptionService } from '@/views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException.service';

@Component({
    selector: 'app-eol-disposal-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule, ChartModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './eol-disposal-dashboard.component.html',
    styleUrl: './operations-dashboard.component.css'
})
export class EolDisposalDashboardComponent implements OnInit {
    private readonly caseService = inject(EndOfLeaseCaseService);
    private readonly returnService = inject(AssetReturnService);
    private readonly assessmentService = inject(ReturnAssessmentService);
    private readonly settlementService = inject(EndOfLeaseSettlementService);
    private readonly disposalService = inject(DisposalCaseService);
    private readonly exceptionService = inject(EndOfLeaseDisposalExceptionService);
    private readonly router = inject(Router);

    isLoading = true;
    hasLoadError = false;
    cases: any[] = [];
    returns: any[] = [];
    assessments: any[] = [];
    settlements: any[] = [];
    disposals: any[] = [];
    exceptions: any[] = [];
    lifecycleData: any;
    lifecycleOptions: any;

    ngOnInit(): void { this.loadDashboard(); }

    get openCases(): any[] { return this.cases.filter(item => !item.ClosedAt && !this.isClosed(this.caseStatus(item))); }
    get completedReturns(): any[] { return this.returns.filter(item => item.ReturnedAt || this.isClosed(item.ReturnStatusCode)); }
    get openDisposals(): any[] { return this.disposals.filter(item => !item.ClosedAt && !this.isClosed(item.StatusCode)); }
    get openExceptions(): any[] { return this.exceptions.filter(item => !item.ResolvedAt && !this.isClosed(item.StatusCode)); }
    get netSettlementAmount(): number { return this.settlements.reduce((sum, item) => sum + Number(item.NetSettlementAmount || 0), 0); }
    get currencyCode(): string { return this.settlements.find(item => item.CurrencyCode)?.CurrencyCode || 'GBP'; }
    get returnCompletionRate(): number { return this.openCases.length ? Math.min(100, this.completedReturns.length / this.openCases.length * 100) : (this.cases.length ? 100 : 0); }
    get upcomingCases(): any[] {
        const now = new Date(); const limit = new Date(); limit.setDate(limit.getDate() + 60);
        return this.openCases.filter(item => { const due = this.asDate(item.TargetReturnDate || item.ContractEndDate); return due && due >= now && due <= limit; })
            .sort((a, b) => this.timeOf(a.TargetReturnDate || a.ContractEndDate) - this.timeOf(b.TargetReturnDate || b.ContractEndDate));
    }
    get recentCases(): any[] { return [...this.cases].sort((a, b) => this.timeOf(b.OpenedAt || b.CreatedDateTime) - this.timeOf(a.OpenedAt || a.CreatedDateTime)).slice(0, 7); }

    loadDashboard(): void {
        this.isLoading = true; this.hasLoadError = false;
        forkJoin({
            cases: this.caseService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            returns: this.returnService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            assessments: this.assessmentService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            settlements: this.settlementService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            disposals: this.disposalService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            exceptions: this.exceptionService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.cases = this.recordsOf(result.cases);
            this.returns = this.recordsOf(result.returns);
            this.assessments = this.recordsOf(result.assessments);
            this.settlements = this.recordsOf(result.settlements);
            this.disposals = this.recordsOf(result.disposals);
            this.exceptions = this.recordsOf(result.exceptions);
            this.buildLifecycleChart();
        });
    }

    openCase(item: any): void { this.router.navigate(['/eol-disposal/cases/view', item.Id]); }
    caseStatus(item: any): string { return item.EndOfLeaseStatusName || item.StatusCode || item.RecordStatus || 'Not set'; }
    severity(value: any): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const status = String(value || '').toLowerCase();
        if (status.includes('complete') || status.includes('closed') || status.includes('resolved') || status.includes('returned') || status.includes('approved')) return 'success';
        if (status.includes('critical') || status.includes('overdue') || status.includes('failed') || status.includes('high')) return 'danger';
        if (status.includes('pending') || status.includes('scheduled') || status.includes('medium')) return 'warn';
        if (status.includes('open') || status.includes('progress') || status.includes('active')) return 'info';
        return 'secondary';
    }

    private buildLifecycleChart(): void {
        const styles = getComputedStyle(document.documentElement);
        this.lifecycleData = {
            labels: ['Open cases', 'Returns', 'Assessments', 'Settlements', 'Disposals'],
            datasets: [{ data: [this.openCases.length, this.returns.length, this.assessments.length, this.settlements.length, this.disposals.length], backgroundColor: ['--p-primary-color', '--p-blue-500', '--p-cyan-500', '--p-green-500', '--p-purple-500'].map(value => styles.getPropertyValue(value).trim()), borderWidth: 0 }]
        };
        this.lifecycleOptions = { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, color: styles.getPropertyValue('--p-text-color').trim() } } } };
    }
    private isClosed(value: any): boolean { const status = String(value || '').toLowerCase(); return ['complete', 'closed', 'cancelled', 'resolved', 'returned'].some(item => status.includes(item)); }
    private failedFeed() { this.hasLoadError = true; return of([]); }
    private recordsOf(response: any): any[] { const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response; return Array.isArray(records) ? records : []; }
    private asDate(value: any): Date | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
    private timeOf(value: any): number { return this.asDate(value)?.getTime() ?? 0; }
}
