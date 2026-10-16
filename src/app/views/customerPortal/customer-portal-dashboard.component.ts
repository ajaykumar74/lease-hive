import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { CustomerPortalDashboard, CustomerPortalWorkspaceService } from './customer-portal-workspace.service';

@Component({
    selector: 'app-customer-portal-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, CurrencyPipe],
    templateUrl: './customer-portal-dashboard.component.html',
    styleUrls: ['./customer-portal-dashboard.component.css']
})
export class CustomerPortalDashboardComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    summary?: CustomerPortalDashboard;
    loading = true;

    constructor(
        private readonly loggedInUserService: LoggedInUserService,
        private readonly workspace: CustomerPortalWorkspaceService
    ) {}

    ngOnInit(): void {
        this.workspace.dashboard().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: summary => this.summary = summary,
            complete: () => this.loading = false,
            error: () => this.loading = false
        });
    }

    get name(): string {
        return this.loggedInUserService.loggedInUser?.Name
            || this.loggedInUserService.loggedInUser?.Username
            || 'Customer';
    }

    get isAdmin(): boolean {
        return this.loggedInUserService.isCustomerPortalAdmin;
    }
}
