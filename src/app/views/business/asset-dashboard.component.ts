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
import { AssetService } from '@/views/assets/asset/asset.service';
import { AssetAssignmentService } from '@/views/assets/assetAssignment/assetAssignment.service';
import { AssetInspectionService } from '@/views/assets/assetInspection/assetInspection.service';
import { AssetStatusService } from '@/views/assets/assetStatus/assetStatus.service';
import { AssetCategoryService } from '@/views/assets/assetCategory/assetCategory.service';

@Component({
    selector: 'app-asset-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, ChartModule, SelectModule, SkeletonModule, TableModule, TagModule],
    templateUrl: './asset-dashboard.component.html',
    styleUrl: './asset-dashboard.component.css'
})
export class AssetDashboardComponent implements OnInit {
    private readonly assetService = inject(AssetService);
    private readonly assignmentService = inject(AssetAssignmentService);
    private readonly inspectionService = inject(AssetInspectionService);
    private readonly statusService = inject(AssetStatusService);
    private readonly categoryService = inject(AssetCategoryService);
    private readonly router = inject(Router);

    readonly scopeOptions = [
        { label: 'All active assets', value: 'all' },
        { label: 'Leaseable only', value: 'leaseable' },
        { label: 'Currently assigned', value: 'assigned' }
    ];

    selectedScope = 'all';
    isLoading = true;
    hasLoadError = false;
    assets: any[] = [];
    assignments: any[] = [];
    inspections: any[] = [];
    statuses: any[] = [];
    categories: any[] = [];
    categoryData: any;
    categoryOptions: any;

    ngOnInit(): void { this.loadDashboard(); }

    get activeAssets(): any[] { return this.assets.filter(item => !item.RecordStatus || String(item.RecordStatus).toLowerCase() === 'active'); }
    get currentAssignments(): any[] { return this.assignments.filter(item => this.isCurrentAssignment(item)); }
    get scopedAssets(): any[] {
        if (this.selectedScope === 'leaseable') return this.activeAssets.filter(item => this.asBoolean(item.IsLeaseable));
        if (this.selectedScope === 'assigned') {
            const assignedIds = new Set(this.currentAssignments.map(item => Number(item.AssetId)));
            return this.activeAssets.filter(item => assignedIds.has(Number(item.Id)));
        }
        return this.activeAssets;
    }
    get leaseableCount(): number { return this.scopedAssets.filter(item => this.asBoolean(item.IsLeaseable)).length; }
    get assignedCount(): number {
        const scopedIds = new Set(this.scopedAssets.map(item => Number(item.Id)));
        return new Set(this.currentAssignments.filter(item => scopedIds.has(Number(item.AssetId))).map(item => Number(item.AssetId))).size;
    }
    get availableToLease(): number { return Math.max(0, this.leaseableCount - this.assignedCount); }
    get utilizationRate(): number { return this.leaseableCount ? this.assignedCount / this.leaseableCount * 100 : 0; }
    get acquisitionValue(): number { return this.scopedAssets.reduce((sum, item) => sum + Number(item.AcquisitionCost || 0), 0); }
    get residualValue(): number { return this.scopedAssets.reduce((sum, item) => sum + Number(item.ResidualValueAmount || 0), 0); }
    get residualExposurePct(): number { return this.acquisitionValue ? this.residualValue / this.acquisitionValue * 100 : 0; }
    get currencyCode(): string { return this.scopedAssets.find(item => item.AcquisitionCurrencyCode)?.AcquisitionCurrencyCode || 'GBP'; }

    get recentAssets(): any[] {
        return [...this.scopedAssets].sort((a, b) => this.timeOf(b.CreatedDateTime || b.AcquisitionDate) - this.timeOf(a.CreatedDateTime || a.AcquisitionDate)).slice(0, 6);
    }
    get expiringAssignments(): any[] {
        const limit = new Date(); limit.setDate(limit.getDate() + 30);
        return this.currentAssignments.filter(item => {
            const end = this.asDate(item.AssignedTo || item.EffectiveTo);
            return end && end <= limit;
        }).sort((a, b) => this.timeOf(a.AssignedTo || a.EffectiveTo) - this.timeOf(b.AssignedTo || b.EffectiveTo)).slice(0, 5);
    }
    get inspectionsNeedingAttention(): any[] {
        return [...this.inspections].filter(item => !item.CompletedOn || Number(item.OverallScore || 0) < 60)
            .sort((a, b) => this.timeOf(b.InspectionDateTime) - this.timeOf(a.InspectionDateTime)).slice(0, 5);
    }

    loadDashboard(): void {
        this.isLoading = true; this.hasLoadError = false;
        forkJoin({
            assets: this.assetService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            assignments: this.assignmentService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            inspections: this.inspectionService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            statuses: this.statusService.GetAll(false).pipe(catchError(() => this.failedFeed())),
            categories: this.categoryService.GetAll(false).pipe(catchError(() => this.failedFeed()))
        }).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
            this.assets = this.recordsOf(result.assets);
            this.assignments = this.recordsOf(result.assignments);
            this.inspections = this.recordsOf(result.inspections);
            this.statuses = this.recordsOf(result.statuses);
            this.categories = this.recordsOf(result.categories);
            this.buildCategoryChart();
        });
    }

    onScopeChange(): void { this.buildCategoryChart(); }
    openAsset(item: any): void { this.router.navigate(['/business/assets/view', item.Id]); }
    assetLabel(assetId: any): string { const asset = this.assets.find(item => Number(item.Id) === Number(assetId)); return asset?.AssetNo || asset?.PrimarySerialNo || `Asset ${assetId}`; }
    categoryName(item: any): string { return this.categories.find(category => Number(category.Id) === Number(item.AssetCategoryId))?.CategoryName || item.AssetCategoryName || 'Unclassified'; }
    statusName(item: any): string { return this.statuses.find(status => Number(status.Id) === Number(item.AssetStatusId))?.StatusName || item.AssetStatusName || 'Not set'; }
    statusSeverity(name: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const value = name.toLowerCase();
        if (value.includes('available') || value.includes('active')) return 'success';
        if (value.includes('lease') || value.includes('assign')) return 'info';
        if (value.includes('maintenance') || value.includes('repair')) return 'warn';
        if (value.includes('retired') || value.includes('disposed')) return 'danger';
        return 'secondary';
    }

    private buildCategoryChart(): void {
        const counts = new Map<string, number>();
        this.scopedAssets.forEach(item => { const name = this.categoryName(item); counts.set(name, (counts.get(name) || 0) + 1); });
        const groups = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
        const styles = getComputedStyle(document.documentElement);
        const colors = ['--p-primary-color', '--p-blue-500', '--p-orange-500', '--p-purple-500', '--p-cyan-500', '--p-pink-500', '--p-yellow-500'].map(v => styles.getPropertyValue(v).trim());
        this.categoryData = { labels: groups.map(x => x[0]), datasets: [{ data: groups.map(x => x[1]), backgroundColor: colors, borderWidth: 0 }] };
        this.categoryOptions = { responsive: true, maintainAspectRatio: false, cutout: '66%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, color: styles.getPropertyValue('--p-text-color').trim() } } } };
    }
    private isCurrentAssignment(item: any): boolean { const now = new Date(); const from = this.asDate(item.AssignedFrom || item.EffectiveFrom); const to = this.asDate(item.AssignedTo || item.EffectiveTo); return (!from || from <= now) && (!to || to >= now) && (!item.RecordStatus || String(item.RecordStatus).toLowerCase() === 'active'); }
    private failedFeed() { this.hasLoadError = true; return of([]); }
    private recordsOf(response: any): any[] { const records = response?.data?.Records ?? response?.Data?.Records ?? response?.Records ?? response?.data ?? response; return Array.isArray(records) ? records : []; }
    private asBoolean(value: any): boolean { return value === true || value === 1 || String(value).toLowerCase() === 'true'; }
    private asDate(value: any): Date | null { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
    private timeOf(value: any): number { return this.asDate(value)?.getTime() ?? 0; }
}
