import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { PermissionGuard } from '@/shared/security/permission.guard';
import { CustomerPortalGuard } from './customer-portal.guard';
import { CustomerPortalDashboardComponent } from './customer-portal-dashboard.component';
import { CustomerPortalQuotesComponent } from './customer-portal-quotes.component';
import { CustomerPortalWorkspaceComponent } from './customer-portal-workspace.component';
import { CustomerPortalInvitationComponent } from './customer-portal-invitation.component';
import { CustomerPortalContractsComponent } from './customer-portal-contracts.component';
import { CustomerPortalContractDetailComponent } from './customer-portal-contract-detail.component';
import { CustomerPortalAssetsComponent } from './customer-portal-assets.component';
import { CustomerPortalInvoicesComponent } from './customer-portal-invoices.component';
import { CustomerPortalDocumentsComponent } from './customer-portal-documents.component';
import { CustomerPortalSupportComponent } from './customer-portal-support.component';
import { CustomerPortalSupportCreateComponent } from './customer-portal-support-create.component';
import { CustomerPortalSupportDetailComponent } from './customer-portal-support-detail.component';

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
            { path: 'quotes', component: CustomerPortalQuotesComponent, canActivate: [CustomerPortalGuard], data: { title: 'Quotations' } },
            { path: 'contracts', component: CustomerPortalContractsComponent, canActivate: [CustomerPortalGuard], data: { title: 'Contracts' } },
            { path: 'contracts/:id', component: CustomerPortalContractDetailComponent, canActivate: [CustomerPortalGuard], data: { title: 'Contract' } },
            { path: 'assets', component: CustomerPortalAssetsComponent, canActivate: [CustomerPortalGuard], data: { title: 'Leased assets' } },
            { path: 'documents', component: CustomerPortalDocumentsComponent, canActivate: [CustomerPortalGuard], data: { title: 'Documents' } },
            { path: 'invoices', component: CustomerPortalInvoicesComponent, canActivate: [CustomerPortalGuard], data: { title: 'Invoices & payments' } },
            { path: 'maintenance', ...workspace('Maintenance', 'Maintenance schedules and service requests will be connected in the next portal phase.') },
            { path: 'end-of-lease', ...workspace('End of Lease', 'Return instructions, inspections, and settlement steps will be connected in the next portal phase.') },
            { path: 'support', component: CustomerPortalSupportComponent, canActivate: [CustomerPortalGuard], data: { title: 'Support Tickets' } },
            { path: 'support/create', component: CustomerPortalSupportCreateComponent, canActivate: [CustomerPortalGuard], data: { title: 'Create Support Ticket' } },
            { path: 'support/:id', component: CustomerPortalSupportDetailComponent, canActivate: [CustomerPortalGuard], data: { title: 'Support Ticket' } },
            { path: 'contacts', ...workspace('Party Contacts', 'Manage authorised contacts for your party here.') },
            { path: 'users', ...workspace('Customer Users', 'Manage customer users for your party here.') },
            { path: 'profile', ...workspace('Profile', 'Review your portal profile and contact preferences here.') },
            // This staff-only route is further restricted to tenant administrators.
            { path: 'invite', component: CustomerPortalInvitationComponent, canActivate: [PermissionGuard], data: { title: 'Invite customer user' } }
        ]
    }
];
