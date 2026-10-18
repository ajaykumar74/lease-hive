import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, take, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionService } from '@/shared/security/permission.service';
import { AiUsageDashboardService } from './ai-usage-dashboard.service';
import {
    AiUsageCurrencyTotal,
    AiUsageDashboard,
    AiUsageFeatureBreakdown,
    AiUsageMetadataPage
} from './ai-usage-dashboard.models';

@Component({
    selector: 'app-ai-usage-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        ButtonModule,
        SkeletonModule,
        TableModule,
        TagModule,
        PaginatorModule,
        DecimalPipe,
        DatePipe
    ],
    templateUrl: './ai-usage-dashboard.component.html',
    styleUrl: './ai-usage-dashboard.component.css'
})
export class AiUsageDashboardComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();
    private readonly usageService = inject(AiUsageDashboardService);
    private readonly permissionService = inject(PermissionService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    readonly usagePermission = 'ai.usageadministration.view';
    readonly form = new FormGroup({
        fromUtc: new FormControl(this.monthStart()),
        toExclusiveUtc: new FormControl(this.nextUtcDay())
    });

    dashboard?: AiUsageDashboard;
    activity?: AiUsageMetadataPage;
    hasPermission = false;
    isLoading = false;
    isActivityLoading = false;
    errorMessage = '';
    selectedFeature?: string;
    selectedStatus?: string;
    currentPage = 1;

    ngOnInit(): void {
        this.permissionService.ensurePermissionsLoaded().pipe(take(1)).subscribe(() => {
            this.hasPermission = this.permissionService.hasPermission(this.usagePermission);
            if (!this.hasPermission) {
                return;
            }

            this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
                this.selectedFeature = params.get('feature') || undefined;
                this.selectedStatus = params.get('status') || undefined;
                this.currentPage = Math.max(1, Number(params.get('page')) || 1);
                this.loadDashboard();
                this.loadActivity();
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    applyRange(): void {
        const fromUtc = this.form.controls.fromUtc.value;
        const toExclusiveUtc = this.form.controls.toExclusiveUtc.value;
        if (!fromUtc || !toExclusiveUtc || fromUtc >= toExclusiveUtc) {
            this.errorMessage = 'Choose a valid inclusive start date and an end date after it.';
            return;
        }

        this.errorMessage = '';
        this.currentPage = 1;
        this.loadDashboard();
        this.loadActivity();
    }

    clearActivityFilters(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { feature: null, status: null, page: 1 },
            queryParamsHandling: 'merge',
            fragment: 'activity'
        });
    }

    setStatus(statusCode: string): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { status: statusCode || null, page: 1 },
            queryParamsHandling: 'merge',
            fragment: 'activity'
        });
    }

    onPageChange(event: { page?: number }): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: (event.page ?? 0) + 1 },
            queryParamsHandling: 'merge',
            fragment: 'activity'
        });
    }

    featureCost(feature: AiUsageFeatureBreakdown): string {
        return this.formatCosts(feature.EstimatedCosts);
    }

    formatCosts(costs: AiUsageCurrencyTotal[] | undefined): string {
        if (!costs?.length) {
            return 'No measured cost';
        }

        return costs.map(cost => `${cost.CurrencyCode} ${Number(cost.CostAmount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        })}`).join(' · ');
    }

    statusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch ((status || '').toUpperCase()) {
            case 'SUCCEEDED': return 'success';
            case 'CACHED': return 'info';
            case 'DENIED': return 'warn';
            case 'CANCELLED': return 'secondary';
            default: return 'danger';
        }
    }

    tokenUtilisation(): number {
        const limits = this.dashboard?.Limits;
        if (!limits?.MonthlyTokenLimit) {
            return 0;
        }

        return Math.min(100, (limits.CurrentMonthConsumedTokenCount + limits.CurrentMonthReservedTokenCount) * 100 / limits.MonthlyTokenLimit);
    }

    spendUtilisation(): number {
        const limits = this.dashboard?.Limits;
        if (!limits?.MonthlySpendLimit) {
            return 0;
        }

        return Math.min(100, Number(limits.CurrentMonthConsumedSpendAmount + limits.CurrentMonthReservedSpendAmount) * 100 / Number(limits.MonthlySpendLimit));
    }

    private loadDashboard(): void {
        const range = this.range();
        if (!range || !this.hasPermission) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.usageService.getDashboard(range.fromUtc, range.toExclusiveUtc)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: dashboard => this.dashboard = dashboard,
                error: error => this.errorMessage = this.errorText(error)
            });
    }

    private loadActivity(): void {
        const range = this.range();
        if (!range || !this.hasPermission) {
            return;
        }

        this.isActivityLoading = true;
        this.usageService.getActivity(
            range.fromUtc,
            range.toExclusiveUtc,
            this.currentPage,
            this.selectedFeature,
            this.selectedStatus)
            .pipe(finalize(() => this.isActivityLoading = false))
            .subscribe({
                next: activity => this.activity = activity,
                error: error => this.errorMessage = this.errorText(error)
            });
    }

    private range(): { fromUtc: string; toExclusiveUtc: string } | null {
        const fromDate = this.form.controls.fromUtc.value;
        const toDate = this.form.controls.toExclusiveUtc.value;
        if (!fromDate || !toDate || fromDate >= toDate) {
            return null;
        }

        return { fromUtc: `${fromDate}T00:00:00Z`, toExclusiveUtc: `${toDate}T00:00:00Z` };
    }

    private monthStart(): string {
        const now = new Date();
        return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-01`;
    }

    private nextUtcDay(): string {
        const now = new Date();
        now.setUTCDate(now.getUTCDate() + 1);
        return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
    }

    private errorText(error: unknown): string {
        return typeof error === 'string' && error.trim()
            ? error
            : 'AI usage data could not be loaded. Try again or confirm your administration access.';
    }
}
