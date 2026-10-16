import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { CustomerPortalGuard } from './customer-portal.guard';
import { CustomerPortalDashboardComponent } from './customer-portal-dashboard.component';
import { CustomerPortalWorkspaceComponent } from './customer-portal-workspace.component';
import { CustomerPortalInvitationComponent } from './customer-portal-invitation.component';

const workspace = (title: string, description: string) => ({
    component: CustomerPortalWorkspaceComponent,
    canActivate: [CustomerPortalGuard],
    data: { title, description }
});

export const CUSTOMER_PORTAL_ROUTES: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: CustomerPortalDashboardComponent, canActivate: [CustomerPortalGuard], data: { title: 'Customer Portal Dashboard' } },
            { path: 'contracts', ...workspace('Contracts', 'Your party’s lease contracts will be available here.') },
            { path: 'assets', ...workspace('Assets', 'Assets attached to your permitted contracts will be available here.') },
            { path: 'documents', ...workspace('My Documents', 'Required documents and approved files for your party will be available here.') },
            { path: 'invoices', ...workspace('Invoices & Payments', 'Invoices, statements and payment history will be available here.') },
            { path: 'service-requests', ...workspace('Service Requests', 'Create and track requests related to your permitted assets here.') },
            { path: 'contacts', ...workspace('Party Contacts', 'Manage authorised contacts for your party here.') },
            { path: 'users', ...workspace('Customer Users', 'Manage customer users for your party here.') },
            { path: 'profile', ...workspace('Profile', 'Review your portal profile and contact preferences here.') },
            // This route is intentionally staff-authenticated, not customer-role guarded.
            { path: 'invite', component: CustomerPortalInvitationComponent, data: { title: 'Invite customer user' } }
        ]
    }
];
