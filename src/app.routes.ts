import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { Landing } from '@/views/landing/landing-component';
import { AuthGuard } from '@/shared/auth-guard.service';
import { PermissionGuard } from '@/shared/security/permission.guard';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'onboarding',
        pathMatch: 'full',
        /*   children: [
             {
                 path: '', 
                 redirectTo: 'onboarding',
                 pathMatch: 'full',
                 data: { breadcrumb: 'Onboarding' },
             } , 
             {
                 path: 'dashboard',
                 loadChildren: () => import('./app/views/dashboard/dashboard.module').then(c => c.DashboardModule),
                 data: { breadcrumb: 'Dashboard' },
             },
         ],   */
    },

    
    {
        path: 'dashboard',
        loadChildren: () => import('./app/views/dashboard/dashboard.module').then(c => c.DashboardModule),
        data: { breadcrumb: 'Dashboard' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard]
    },
    {
        path: 'dashboard/admin',
        loadChildren: () => import('./app/views/dashboard/dashboard.module').then(c => c.DashboardModule),
        data: { breadcrumb: 'Dashboard' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard]
    },
    {
        path: 'business',
        loadChildren: () => import('./app/views/business/business.routes').then(m => m.BUSINESS_ROUTES),
        data: { breadcrumb: 'Business' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard]
    },
    {
        path: 'contracts',
        loadChildren: () => import('./app/views/business/leaseContracts.routes').then(m => m.LEASE_CONTRACT_ROUTES),
        data: { breadcrumb: 'Lease Contracts' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard]
    },
    {
        path: 'billing-finance',
        loadChildren: () => import('./app/views/business/billingFinance.routes').then(m => m.BILLING_FINANCE_ROUTES),
        data: { breadcrumb: 'Billing & Finance' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard]
    },
    {
        path: 'maintenance-insurance',
        loadChildren: () => import('./app/views/business/maintenanceInsurance.routes').then(m => m.MAINTENANCE_INSURANCE_ROUTES),
        data: { breadcrumb: 'Maintenance & Insurance' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard]
    },
    {
        path: 'eol-disposal',
        loadChildren: () => import('./app/views/business/eolDisposal.routes').then(m => m.EOL_DISPOSAL_ROUTES),
        data: { breadcrumb: 'End-of-Lease & Disposal' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard]
    },
    
    /*   { path: 'notfound', component: Notfound }, */

    {
        path: 'auth',
        loadChildren: () => import('./app/auth/authentication.module').then(m => m.AuthenticationModule),
    },

    { path: '**', redirectTo: '/notfound' },

];
