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
import { LeadService } from '@/views/crm/lead/lead.service';
import { LeadActivityService } from '@/views/crm/leadActivity/leadActivity.service';
import { OpportunityService } from '@/views/crm/opportunity/opportunity.service';
import { OpportunityStageService } from '@/views/crm/opportunityStage/opportunityStage.service';
import { LoggedInUserService, DataType, Operator } from '@/shared/LoggedInUserService';

interface DashboardOpportunity {
    id: number;
    name: string;
    customer: string;
    stage: string;
    stageId: number;
    amount: number;
    probability: number;
    closeDate: Date | null;
    nextStep: string;
}

interface DashboardActivity {
    id: number;
    subject: string;
    relatedTo: string;
    type: string;
    dueDate: Date | null;
    overdue: boolean;
}

@Component({
    selector: 'app-crm-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, ChartModule, SelectModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './crm-dashboard.component.html',
    styleUrl: './crm-dashboard.component.css'
})
export class CrmDashboardComponent implements OnInit {
    private readonly leadService = inject(LeadService);
    private readonly activityService = inject(LeadActivityService);
    private readonly opportunityService = inject(OpportunityService);
    private readonly stageService = inject(OpportunityStageService);
    private readonly loggedInUserService = inject(LoggedInUserService);
    private readonly router = inject(Router);

    readonly periodOptions = [
        { label: 'This month', value: 'month' },
        { label: 'This quarter', value: 'quarter' },
        { label: 'This year', value: 'year' }
    ];

    selectedPeriod = 'month';
    isLoading = true;
    hasLoadError = false;
    leads: any[] = [];
    opportunities: DashboardOpportunity[] = [];
    activities: DashboardActivity[] = [];
    stages: any[] = [];
    pipelineData: any;
    pipelineOptions: any;

    ngOnInit(): void {
        this.loadDashboard();
    }

    get activeLeadCount(): number {
        return this.leads.filter(item => this.isActive(item)).length;
    }

    get openOpportunities(): DashboardOpportunity[] {
        return this.opportunities.filter(item => !this.isClosedStage(item.stage));
    }

    get pipelineTotal(): number {
        return this.openOpportunities.reduce((total, item) => total + item.amount, 0);
    }

    get weightedPipeline(): number {
        return this.openOpportunities.reduce((total, item) => total + item.amount * (item.probability / 100), 0);
    }

    get dueActivities(): DashboardActivity[] {
        const end = new Date();
        end.setDate(end.getDate() + 7);
        return this.activities
            .filter(item => item.dueDate && item.dueDate <= end)
            .sort((a, b) => this.timeOf(a.dueDate) - this.timeOf(b.dueDate));
    }

    get overdueActivityCount(): number {
        return this.activities.filter(item => item.overdue).length;
    }

    get opportunitiesNeedingAttention(): DashboardOpportunity[] {
        const attentionDate = new Date();
        attentionDate.setDate(attentionDate.getDate() + 30);
        return [...this.openOpportunities]
            .filter(item => !item.closeDate || item.closeDate <= attentionDate || item.probability < 50)
            .sort((a, b) => this.timeOf(a.closeDate) - this.timeOf(b.closeDate))
            .slice(0, 5);
    }

    get qualifiedLeadCount(): number {
        return this.leads.filter(item => !!item.QualifiedOn || !!item.QualifiedPartyId).length;
    }

    get leadConversionRate(): number {
        return this.activeLeadCount ? (this.openOpportunities.length / this.activeLeadCount) * 100 : 0;
    }

    loadDashboard(): void {
        this.isLoading = true;
        this.hasLoadError = false;
        const searchParam = this.createSearchParam();

        forkJoin({
            leads: this.leadService.search(searchParam).pipe(catchError(() => this.failedFeed())),
            opportunities: this.opportunityService.search(searchParam).pipe(catchError(() => this.failedFeed())),
            activities: this.activityService.search(searchParam).pipe(catchError(() => this.failedFeed())),
            stages: this.stageService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        })
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(result => {
                this.stages = this.recordsOf(result.stages);
                this.leads = this.recordsOf(result.leads);
                this.opportunities = this.recordsOf(result.opportunities).map(item => this.mapOpportunity(item));
                this.activities = this.recordsOf(result.activities).map(item => this.mapActivity(item));
                this.buildPipelineChart();
            });
    }

    onPeriodChange(): void {
        this.loadDashboard();
    }

    openOpportunity(item: DashboardOpportunity): void {
        this.router.navigate(['/business/crm/opportunities/view', item.id]);
    }

    getActivityIcon(type: string): string {
        const normalized = type.toLowerCase();
        if (normalized.includes('call')) return 'pi pi-phone';
        if (normalized.includes('email')) return 'pi pi-envelope';
        if (normalized.includes('meeting')) return 'pi pi-calendar';
        return 'pi pi-check-square';
    }

    getStageSeverity(stage: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const normalized = stage.toLowerCase();
        if (normalized.includes('won') || normalized.includes('accept')) return 'success';
        if (normalized.includes('credit') || normalized.includes('review')) return 'warn';
        if (normalized.includes('lost')) return 'danger';
        if (normalized.includes('proposal') || normalized.includes('quote')) return 'info';
        return 'secondary';
    }

    private createSearchParam(): any {
        const tenantId = this.loggedInUserService.loggedInUser?.Tenant?.Id;
        const conditions = tenantId
            ? [{ DBName: 'TenantId', Value: tenantId.toString(), DataType: DataType.Int, Operator: Operator.EqualTo }]
            : [];
        conditions.push({
            DBName: 'CreatedDateTime',
            Value: this.loggedInUserService.formatDate(this.periodStart()),
            DataType: DataType.Date,
            Operator: Operator.GreaterThanEqualTo
        });
        return { Skip: 0, Take: 500, SortBy: 'Id', IsDescending: true, Conditions: conditions };
    }

    private periodStart(): Date {
        const today = new Date();
        if (this.selectedPeriod === 'year') return new Date(today.getFullYear(), 0, 1);
        if (this.selectedPeriod === 'quarter') return new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return new Date(today.getFullYear(), today.getMonth(), 1);
    }

    private failedFeed() {
        this.hasLoadError = true;
        return of([]);
    }

    private recordsOf(response: any): any[] {
        const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response;
        return Array.isArray(records) ? records : [];
    }

    private mapOpportunity(item: any): DashboardOpportunity {
        const stageId = Number(item.OpportunityStageId ?? 0);
        const stage = this.stages.find(candidate => Number(candidate.Id) === stageId || Number(candidate.OpportunityStageId) === stageId);
        return {
            id: Number(item.Id ?? 0),
            name: item.OpportunityName || `Opportunity ${item.OpportunityId ?? item.Id}`,
            customer: item.ProspectName || item.PartyName || item.CustomerName || 'Customer not assigned',
            stage: stage?.StageName || item.OpportunityStageName || 'Unassigned',
            stageId,
            amount: Number(item.EstimatedAmount ?? 0),
            probability: Number(item.ProbabilityPct ?? stage?.DefaultProbabilityPct ?? 0),
            closeDate: this.asDate(item.ExpectedCloseDate),
            nextStep: this.nextStepFor(stage?.StageName || item.OpportunityStageName || '')
        };
    }

    private mapActivity(item: any): DashboardActivity {
        const dueDate = this.asDate(item.DueDateTime || item.ActivityDateTime);
        return {
            id: Number(item.Id ?? 0),
            subject: item.Subject || item.ActivityType || 'CRM activity',
            relatedTo: item.OpportunityName || item.ProspectName || (item.OpportunityId ? `Opportunity ${item.OpportunityId}` : `Lead ${item.LeadId}`),
            type: item.ActivityType || 'Task',
            dueDate,
            overdue: !!dueDate && dueDate < new Date() && !item.CompletedOn
        };
    }

    private buildPipelineChart(): void {
        const configuredStages = [...this.stages].sort((a, b) => Number(a.SortOrder ?? 0) - Number(b.SortOrder ?? 0));
        const groups = configuredStages.length
            ? configuredStages.map(stage => ({ id: Number(stage.Id), label: stage.StageName || stage.StageCode }))
            : this.uniqueStageGroups();
        const visibleGroups = groups.slice(0, 7);
        const estimated = visibleGroups.map(group => this.openOpportunities.filter(item => item.stageId === group.id || item.stage === group.label).reduce((sum, item) => sum + item.amount, 0));
        const weighted = visibleGroups.map(group => this.openOpportunities.filter(item => item.stageId === group.id || item.stage === group.label).reduce((sum, item) => sum + item.amount * (item.probability / 100), 0));
        const styles = getComputedStyle(document.documentElement);
        const primary = styles.getPropertyValue('--p-primary-color').trim() || '#10b981';
        const textColor = styles.getPropertyValue('--p-text-color').trim() || '#334155';
        const mutedColor = styles.getPropertyValue('--p-text-muted-color').trim() || '#64748b';
        const borderColor = styles.getPropertyValue('--p-content-border-color').trim() || '#e2e8f0';

        this.pipelineData = {
            labels: visibleGroups.map(group => group.label),
            datasets: [
                { label: 'Estimated value', data: estimated, backgroundColor: primary, borderRadius: 5 },
                { label: 'Weighted value', data: weighted, backgroundColor: this.withAlpha(primary, 0.3), borderRadius: 5 }
            ]
        };
        this.pipelineOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor, usePointStyle: true, boxWidth: 8 } } },
            scales: {
                x: { stacked: false, ticks: { color: mutedColor }, grid: { display: false }, border: { color: borderColor } },
                y: { beginAtZero: true, ticks: { color: mutedColor, callback: (value: number) => this.compactCurrency(value) }, grid: { color: borderColor }, border: { display: false } }
            }
        };
    }

    private uniqueStageGroups(): Array<{ id: number; label: string }> {
        const result = new Map<string, { id: number; label: string }>();
        this.opportunities.forEach(item => result.set(`${item.stageId}-${item.stage}`, { id: item.stageId, label: item.stage }));
        return [...result.values()];
    }

    private isActive(item: any): boolean {
        return !item.RecordStatus || item.RecordStatus.toLowerCase() === 'active';
    }

    private isClosedStage(stage: string): boolean {
        const normalized = stage.toLowerCase();
        return normalized.includes('won') || normalized.includes('lost') || normalized.includes('closed');
    }

    private nextStepFor(stage: string): string {
        const normalized = stage.toLowerCase();
        if (normalized.includes('credit')) return 'Complete credit review';
        if (normalized.includes('proposal') || normalized.includes('quote')) return 'Follow up quote';
        if (normalized.includes('negotiat')) return 'Confirm final terms';
        if (normalized.includes('qualif')) return 'Complete qualification';
        return 'Schedule next activity';
    }

    private compactCurrency(value: number): string {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', notation: 'compact', maximumFractionDigits: 1 }).format(value);
    }

    private withAlpha(color: string, alpha: number): string {
        if (/^#[0-9a-f]{6}$/i.test(color)) {
            const red = parseInt(color.slice(1, 3), 16);
            const green = parseInt(color.slice(3, 5), 16);
            const blue = parseInt(color.slice(5, 7), 16);
            return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        }
        return color;
    }

    private asDate(value: any): Date | null {
        if (!value) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    private timeOf(value: Date | null): number {
        return value?.getTime() ?? Number.MAX_SAFE_INTEGER;
    }
}
