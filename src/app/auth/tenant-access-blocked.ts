import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PermissionService } from '@/shared/security/permission.service';

@Component({
    selector: 'app-tenant-access-blocked',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
        <main class="blocked-access-page">
            <section class="blocked-access-card">
                <i class="pi pi-lock text-5xl text-orange-500 mb-4"></i>
                <h1 class="text-2xl mt-0 mb-3">Tenant access is unavailable</h1>
                <p class="line-height-3 text-color-secondary m-0">
                    {{ tenantName }} is currently <strong>{{ tenantStatus }}</strong> and cannot access business features.
                </p>
                <button pButton type="button" class="mt-5" label="Try Login Again" (click)="tryLoginAgain()"></button>
            </section>
        </main>
    `,
    styles: [`
        .blocked-access-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            background: var(--surface-ground);
        }

        .blocked-access-card {
            width: min(100%, 34rem);
            padding: 2.5rem;
            text-align: center;
            background: var(--surface-card);
            border-radius: 0.75rem;
            box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.12);
        }
    `]
})
export class TenantAccessBlocked {
    tenantName = 'This tenant';
    tenantStatus = 'not active';

    constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly permissionService: PermissionService) {
        this.tenantName = this.route.snapshot.queryParamMap.get('tenantName') || this.tenantName;
        this.tenantStatus = this.route.snapshot.queryParamMap.get('tenantStatus') || this.tenantStatus;
    }

    tryLoginAgain(): void {
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
        this.permissionService.clear();
        this.router.navigate(['/auth/login']);
    }
}
