import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { PermissionGuard } from '@/shared/security/permission.guard';
import { AssetPortfolioOverviewComponent } from './assets/overview/asset-portfolio-overview.component';
import { AssetExpiryRiskComponent } from './assets/expiry-risk/asset-expiry-risk.component';
import { AssetProfitabilityComponent } from './assets/profitability/asset-profitability.component';
import { AssetStatusAllocationComponent } from './assets/status-allocation/asset-status-allocation.component';
import { AssetUtilizationComponent } from './assets/utilization/asset-utilization.component';

export const REPORTS_ROUTES: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard],
        children: [
            {
                path: 'assets/overview',
                component: AssetPortfolioOverviewComponent,
                data: { title: 'Asset Portfolio Overview', breadcrumb: 'Asset Portfolio Overview' }
            },
            {
                path: 'assets/status-allocation',
                component: AssetStatusAllocationComponent,
                data: { title: 'Asset Status & Allocation', breadcrumb: 'Asset Status & Allocation' }
            },
            {
                path: 'assets/utilization',
                component: AssetUtilizationComponent,
                data: { title: 'Asset Utilization & Idle Aging', breadcrumb: 'Asset Utilization & Idle Aging' }
            },
            {
                path: 'assets/profitability',
                component: AssetProfitabilityComponent,
                data: { title: 'Asset Revenue & Profitability', breadcrumb: 'Asset Revenue & Profitability' }
            },
            {
                path: 'assets/expiry-risk',
                component: AssetExpiryRiskComponent,
                data: { title: 'Asset Lease Expiry & Risk', breadcrumb: 'Asset Lease Expiry & Risk' }
            },
            { path: '', redirectTo: 'assets/overview', pathMatch: 'full' }
        ]
    }
];
