import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { forkJoin } from 'rxjs';
import { PermissionService } from '@/shared/security/permission.service';
import {
    AiUsageDashboard,
    AiUsageQuery,
    AiUsageRequest,
    AiUsageRequestPage
} from './ai-usage.models';
import { AiUsageService } from './ai-usage.service';

@Component({
    selector: 'app-ai-usage-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, TableModule, TagModule],
    templateUrl: './ai-usage-dashboard.component.html'
})
export class AiUsageDashboardComponent implements OnInit {
    readonly pageSize = 20;
    fromDate = this.toDateInput(this.daysAgo(29));
    toDate = this.toDateInput(new Date());

    dashboard: AiUsageDashboard | null = null;
    requestPage: AiUsageRequestPage | null = null;
    loading = false;
    loadingRequests = false;
    error = '';
    requestError = '';

    constructor(
        private readonly usageService: AiUsageService,
        private readonly permissionService: PermissionService
    ) {}

    get canView(): boolean {
        return this.permissionService.hasPermission('ai.aiusage.view');
    }

    get pageNumber(): number {
        return this.requestPage?.PageNumber ?? 1;
    }

    get totalPages(): number {
        const total = this.requestPage?.TotalCount ?? 0;
        return Math.max(1, Math.ceil(total / this.pageSize));
    }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        if (!this.canView) {
            return;
        }

        const query = this.createQuery();
        if (!query) {
            return;
        }

        this.loading = true;
        this.loadingRequests = true;
        this.error = '';
        this.requestError = '';
        forkJoin({
            dashboard: this.usageService.getSummary(query),
            requests: this.usageService.getRequests({ ...query, PageNumber: 1, PageSize: this.pageSize })
        }).subscribe({
            next: result => {
                this.dashboard = result.dashboard;
                this.requestPage = result.requests;
            },
            error: error => {
                this.error = typeof error === 'string' ? error : 'AI usage could not be loaded.';
                this.dashboard = null;
                this.requestPage = null;
            },
            complete: () => {
                this.loading = false;
                this.loadingRequests = false;
            }
        });
    }

    changePage(pageNumber: number): void {
        if (this.loadingRequests || pageNumber < 1 || pageNumber > this.totalPages) {
            return;
        }

        const query = this.createQuery();
        if (!query) {
            return;
        }

        this.loadingRequests = true;
        this.requestError = '';
        this.usageService.getRequests({ ...query, PageNumber: pageNumber, PageSize: this.pageSize }).subscribe({
            next: page => this.requestPage = page,
            error: error => this.requestError = typeof error === 'string' ? error : 'Request details could not be loaded.',
            complete: () => this.loadingRequests = false
        });
    }

    statusSeverity(status: string): 'success' | 'danger' | 'warn' | 'info' {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'FAILED': return 'danger';
            case 'DENIED': return 'warn';
            default: return 'info';
        }
    }

    shortRequestId(request: AiUsageRequest): string {
        return request.RequestId?.slice(0, 8) ?? '';
    }

    private createQuery(): AiUsageQuery | null {
        if (!this.fromDate || !this.toDate || this.fromDate > this.toDate) {
            this.error = 'Choose a valid usage period.';
            return null;
        }

        const from = new Date(`${this.fromDate}T00:00:00.000Z`);
        const to = new Date(`${this.toDate}T00:00:00.000Z`);
        to.setUTCDate(to.getUTCDate() + 1);
        return { FromUtc: from.toISOString(), ToUtc: to.toISOString() };
    }

    private daysAgo(days: number): Date {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    }

    private toDateInput(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
