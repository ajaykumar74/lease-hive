import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { BusinessFeatureComponent } from './business-feature.component';

interface BusinessPage {
    path: string;
    title: string;
    area: 'CRM' | 'Origination';
    icon?: string;
}

const pages: BusinessPage[] = [
    { path: 'crm/dashboard', title: 'CRM Dashboard', area: 'CRM', icon: 'pi pi-chart-bar' },
    { path: 'crm/leads', title: 'All Leads', area: 'CRM', icon: 'pi pi-list' },
    { path: 'crm/leads/new', title: 'New Lead', area: 'CRM', icon: 'pi pi-plus' },
    { path: 'crm/leads/my', title: 'My Leads', area: 'CRM', icon: 'pi pi-user' },
    { path: 'crm/activities', title: 'Lead Activities', area: 'CRM', icon: 'pi pi-calendar' },
    { path: 'crm/opportunities/pipeline', title: 'Opportunity Pipeline', area: 'CRM', icon: 'pi pi-chart-line' },
    { path: 'crm/opportunities', title: 'All Opportunities', area: 'CRM', icon: 'pi pi-list' },
    { path: 'crm/opportunities/new', title: 'New Opportunity', area: 'CRM', icon: 'pi pi-plus' },
    { path: 'origination/requirements', title: 'Lease Requirements', area: 'Origination', icon: 'pi pi-file-edit' },
    { path: 'origination/requirements/new', title: 'New Lease Requirement', area: 'Origination', icon: 'pi pi-plus' },
    { path: 'origination/quotes', title: 'All Quotes', area: 'Origination', icon: 'pi pi-file' },
    { path: 'origination/quotes/approvals', title: 'Quotes for Approval', area: 'Origination', icon: 'pi pi-check-square' },
    { path: 'origination/quotes/issued', title: 'Issued Quotes', area: 'Origination', icon: 'pi pi-send' },
    { path: 'origination/credit/applications', title: 'Credit Applications', area: 'Origination', icon: 'pi pi-list' },
    { path: 'origination/credit/review', title: 'Credit Review', area: 'Origination', icon: 'pi pi-search' },
    { path: 'origination/credit/approvals', title: 'Credit Approvals', area: 'Origination', icon: 'pi pi-check-circle' },
    { path: 'origination/credit/limits', title: 'Credit Limits', area: 'Origination', icon: 'pi pi-wallet' },
    { path: 'origination/approvals', title: 'Approvals', area: 'Origination', icon: 'pi pi-verified' },
    { path: 'origination/handoffs', title: 'Contract Handoffs', area: 'Origination', icon: 'pi pi-arrow-right-arrow-left' },
    { path: 'crm/config/lead-statuses', title: 'Lead Statuses', area: 'CRM', icon: 'pi pi-cog' },
    { path: 'crm/config/opportunity-stages', title: 'Opportunity Stages', area: 'CRM', icon: 'pi pi-cog' },
    { path: 'origination/config/quote-statuses', title: 'Quote Statuses', area: 'Origination', icon: 'pi pi-cog' },
    { path: 'origination/config/credit-statuses', title: 'Credit Statuses', area: 'Origination', icon: 'pi pi-cog' }
];
///business/crm/config/lead-sources

export const BUSINESS_ROUTES: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'crm/dashboard',
                pathMatch: 'full'
            },
            {
                path: 'crm/config/lead-sources',
                data: { title: 'Lead Sources', breadcrumb: 'Lead Sources' },
                loadChildren: () => import('@/views/crm/leadSource/leadSource.module').then(m => m.LeadSourceModule)
            },
            {
                path: 'crm/config/lead-statuses',
                data: { title: 'Lead Statuses', breadcrumb: 'Lead Statuses' },
                loadChildren: () => import('@/views/crm/leadStatus/leadStatus.module').then(m => m.LeadStatusModule)
            },            
            {
                path: 'crm/config/opportunity-stages',
                data: { title: 'Opportunity Stages', breadcrumb: 'Opportunity Stages' },
                loadChildren: () => import('@/views/crm/opportunityStage/opportunityStage.module').then(m => m.OpportunityStageModule)
            }, 
            {
                path: 'origination/config/quote-statuses',
                data: { title: 'Quote Statuses', breadcrumb: 'Quote Statuses' },
                loadChildren: () => import('@/views/crm/quoteStatus/quoteStatus.module').then(m => m.QuoteStatusModule)
            },
            {
                path: 'origination/config/credit-statuses',
                data: { title: 'Credit Statuses', breadcrumb: 'Credit Statuses' },
                loadChildren: () => import('@/views/crm/creditApplicationStatus/creditApplicationStatus.module').then(m => m.CreditApplicationStatusModule)
            },

            ...pages.map(page => ({
                path: page.path,
                component: BusinessFeatureComponent,
                data: {
                    title: page.title,
                    area: page.area,
                    icon: page.icon,
                    breadcrumb: page.title
                }
            }))
        ]
    }
];
