import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { TenantPlanSubscriptionSnapshot } from './tenant-plan-subscription.models';
import { TenantPlanSubscriptionService } from './tenant-plan-subscription.service';

@Component({
    selector: 'app-tenant-plan-subscription',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule, TabsModule, TagModule],
    templateUrl: './tenant-plan-subscription.component.html',
    styleUrl: './tenant-plan-subscription.component.scss'
})
export class TenantPlanSubscriptionComponent implements OnInit {
    snapshot: TenantPlanSubscriptionSnapshot | null = null;
    loading = true;
    error = '';

    constructor(
        private readonly service: TenantPlanSubscriptionService,
        private readonly loggedInUserService: LoggedInUserService
    ) {}

    get canView(): boolean {
        return this.loggedInUserService.isTenantAdministrator;
    }

    get userPercentage(): number | null {
        const plan = this.snapshot?.Plan;
        const usage = this.snapshot?.Usage;
        return plan && usage && plan.MaxUsers > 0 ? Math.min(100, Math.round((usage.ActiveUsers / plan.MaxUsers) * 100)) : null;
    }

    get assetPercentage(): number | null {
        const plan = this.snapshot?.Plan;
        const usage = this.snapshot?.Usage;
        return plan && usage && plan.MaxAssets > 0 ? Math.min(100, Math.round((usage.ActiveAssets / plan.MaxAssets) * 100)) : null;
    }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        if (!this.canView) {
            this.loading = false;
            return;
        }

        this.loading = true;
        this.error = '';
        this.service.getCurrent().subscribe({
            next: snapshot => {
                this.snapshot = snapshot;
                this.loading = false;
            },
            error: error => {
                this.error = typeof error === 'string' ? error : 'Plan and subscription information could not be loaded.';
                this.loading = false;
            }
        });
    }

    statusSeverity(status: string | undefined): 'success' | 'warn' | 'danger' | 'info' {
        switch ((status ?? '').toUpperCase()) {
            case 'ACTIVE': return 'success';
            case 'TRIAL': return 'info';
            case 'EXPIRED':
            case 'SUSPENDED': return 'danger';
            default: return 'warn';
        }
    }
}
