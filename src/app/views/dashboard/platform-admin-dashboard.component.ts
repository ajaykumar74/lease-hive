import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface PlatformAdminShortcut {
  label: string;
  detail: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-platform-admin-dashboard',
  standalone: false,
  templateUrl: './platform-admin-dashboard.component.html',
  styleUrl: './platform-admin-dashboard.component.css'
})
export class PlatformAdminDashboardComponent {
  readonly shortcuts: PlatformAdminShortcut[] = [
    { label: 'Platform settings', detail: 'Manage setting definitions and tenant defaults.', icon: 'pi-sliders-h', route: '/dashboard/platform-settings' },
    { label: 'Tenants', detail: 'Configure tenant identity and regional defaults.', icon: 'pi-building', route: '/dashboard/tenants' },
    { label: 'Subscription plans', detail: 'Define commercial limits and included features.', icon: 'pi-tags', route: '/dashboard/subscriptionPlans' },
    { label: 'Tenant subscriptions', detail: 'Assign plans and subscription dates.', icon: 'pi-calendar', route: '/dashboard/tenantSubscriptions' },
    { label: 'Security policies', detail: 'Set tenant MFA and session controls.', icon: 'pi-shield', route: '/dashboard/tenantSecurityPolicys' },
    { label: 'Usage', detail: 'Review tenant capacity and AI usage.', icon: 'pi-chart-bar', route: '/dashboard/tenantUsages' },
    { label: 'Tenant statuses', detail: 'Maintain lifecycle statuses for each tenant.', icon: 'pi-flag', route: '/dashboard/tenantStatuss' },
    { label: 'Invitations', detail: 'Manage tenant invitation records.', icon: 'pi-send', route: '/dashboard/tenantInvitations' }
  ];

  constructor(private readonly router: Router) {}

  open(shortcut: PlatformAdminShortcut): void {
    this.router.navigateByUrl(shortcut.route);
  }
}
