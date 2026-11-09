import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { SupplierPortalDashboard, SupplierPortalService } from './supplier-portal.service';

@Component({
    selector: 'app-supplier-portal-dashboard',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
    templateUrl: './supplier-portal-dashboard.component.html',
    styleUrls: ['./supplier-portal-dashboard.component.css']
})
export class SupplierPortalDashboardComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    dashboard?: SupplierPortalDashboard;
    loading = true;
    error = '';

    constructor(
        private readonly loggedInUserService: LoggedInUserService,
        private readonly supplierPortal: SupplierPortalService
    ) {}

    ngOnInit(): void {
        this.supplierPortal.dashboard().pipe(
            finalize(() => this.loading = false),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: dashboard => this.dashboard = dashboard,
            error: () => this.error = 'Unable to load your supplier dashboard.'
        });
    }

    get name(): string {
        return this.loggedInUserService.loggedInUser?.Name
            || this.loggedInUserService.loggedInUser?.Username
            || 'Supplier user';
    }
}
