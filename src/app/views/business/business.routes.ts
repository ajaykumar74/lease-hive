import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { BusinessFeatureComponent } from './business-feature.component';
import { CrmDashboardComponent } from './crm-dashboard.component';
import { ASSET_ROUTES } from './assets.routes';
import { PARTY_ROUTES } from './parties.routes';
import { ORGANISATION_ROUTES } from './organisations.routes';

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
    { path: 'crm/leaseRequirementAssets', title: 'Lease Requirement Asset', area: 'CRM', icon: 'pi pi-calendar' },
    { path: 'crm/opportunities/pipeline', title: 'Opportunity Pipeline', area: 'CRM', icon: 'pi pi-chart-line' },
    { path: 'crm/opportunities', title: 'All Opportunities', area: 'CRM', icon: 'pi pi-list' },
    { path: 'crm/opportunities/new', title: 'New Opportunity', area: 'CRM', icon: 'pi pi-plus' },
    { path: 'origination/requirements', title: 'Lease Requirements', area: 'Origination', icon: 'pi pi-file-edit' },
    { path: 'origination/requirements/new', title: 'New Lease Requirement', area: 'Origination', icon: 'pi pi-plus' },
    { path: 'origination/quotes', title: 'All Quotes', area: 'Origination', icon: 'pi pi-file' },
    { path: 'origination/quotes/approvals', title: 'Quotes for Approval', area: 'Origination', icon: 'pi pi-check-square' },
    { path: 'origination/quotes/issued', title: 'Issued Quotes', area: 'Origination', icon: 'pi pi-send' },
    { path: 'origination/quotes/snapshot', title: 'Quote Snapshots', area: 'Origination', icon: 'pi pi-send' },
    { path: 'origination/quotes/charges', title: 'Quote Charges', area: 'Origination', icon: 'pi pi-send' },
    { path: 'origination/quotes/discount', title: 'Quote Discounts', area: 'Origination', icon: 'pi pi-send' },
    { path: 'origination/quotes/acceptances', title: 'Quote Acceptances', area: 'Origination', icon: 'pi pi-send' },
    { path: 'origination/credit/applications', title: 'Credit Applications', area: 'Origination', icon: 'pi pi-list' },
    { path: 'origination/credit/ApplicantPartys', title: 'Credit Applicant Partys', area: 'Origination', icon: 'pi pi-list' },
    { path: 'origination/credit/review', title: 'Credit Review', area: 'Origination', icon: 'pi pi-search' },
    { path: 'origination/credit/CreditBureauResult', title: 'Credit  BureauResult ', area: 'Origination', icon: 'pi pi-search' },
    { path: 'origination/credit/exposure', title: 'Credit Exposure', area: 'Origination', icon: 'pi pi-search' },
    { path: 'origination/credit/snapshot', title: 'Credit Snapshot', area: 'Origination', icon: 'pi pi-search' },
    { path: 'origination/credit/document', title: 'Credit Documents', area: 'Origination', icon: 'pi pi-search' },
    { path: 'origination/credit/decision', title: 'Credit Decision', area: 'Origination', icon: 'pi pi-search' },
    { path: 'origination/credit/approvals', title: 'Credit Approvals', area: 'Origination', icon: 'pi pi-check-circle' },
    { path: 'origination/credit/limits', title: 'Credit Limits', area: 'Origination', icon: 'pi pi-wallet' },
        { path: 'origination/credit/Conditions', title: 'Credit Conditions', area: 'Origination', icon: 'pi pi-wallet' },
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
                path: 'crm/dashboard',
                component: CrmDashboardComponent,
                data: { title: 'CRM Dashboard', breadcrumb: 'CRM Dashboard' }
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
            {
                path: 'crm/leads',
                data: { title: 'Leads', breadcrumb: 'Leads' },
                loadChildren: () => import('@/views/crm/lead/lead.module').then(m => m.LeadModule)
            },
            {
                path: 'crm/activities',
                data: { title: 'Activities', breadcrumb: 'Activities' },
                loadChildren: () => import('@/views/crm/leadActivity/leadActivity.module').then(m => m.LeadActivityModule)
            },
            {
                path: 'crm/opportunities',
                data: { title: 'Opportunities', breadcrumb: 'Opportunities' },
                loadChildren: () => import('@/views/crm/opportunity/opportunity.module').then(m => m.OpportunityModule)
            },
            {
                path: 'origination/requirements',
                data: { title: 'Lease Requirement', breadcrumb: 'Lease Requirement' },
                loadChildren: () => import('@/views/crm/leaseRequirement/leaseRequirement.module').then(m => m.LeaseRequirementModule)

            },
            {
                path: 'crm/leaseRequirementAssets',
                data: { title: 'Lease Requirement Assets', breadcrumb: 'Lease Requirement Assets' },
                loadChildren: () => import('@/views/crm/leaseRequirementAsset/leaseRequirementAsset.module').then(m => m.LeaseRequirementAssetModule)

            },
            {
                path: 'origination/quotes',
                data: { title: 'Quotes', breadcrumb: 'Quotes' },
                loadChildren: () => import('@/views/crm/quote/quote.module').then(m => m.QuoteModule)
            },
            {
                path: 'origination/quotes/snapshot',
                data: { title: 'Quote Snapshots', breadcrumb: 'Quote Snapshots' },
                loadChildren: () => import('@/views/crm/quotePartySnapshot/quotePartySnapshot.module').then(m => m.QuotePartySnapshotModule)
            },
            {
                path: 'origination/quotes/charges',
                data: { title: 'Quote Charges', breadcrumb: 'Quote Charges' },
                loadChildren: () => import('@/views/crm/quoteCharge/quoteCharge.module').then(m => m.QuoteChargeModule)
            },
            {
                path: 'origination/quotes/discount',
                data: { title: 'Quote Discounts', breadcrumb: 'Quote Discounts' },
                loadChildren: () => import('@/views/crm/quoteDiscount/quoteDiscount.module').then(m => m.QuoteDiscountModule)
            },
            {
                path: 'origination/quotes/acceptances',
                data: { title: 'Quote Acceptances', breadcrumb: 'Quote Acceptances' },
                loadChildren: () => import('@/views/crm/quoteAcceptance/quoteAcceptance.module').then(m => m.QuoteAcceptanceModule)
            },
            {
                path: 'origination/credit/applications',
                data: { title: 'Credit Applications', breadcrumb: 'Credit Applications' },
                loadChildren: () => import('@/views/crm/creditApplication/creditApplication.module').then(m => m.CreditApplicationModule)
            },
            {
                path: 'origination/credit/ApplicantPartys',
                data: { title: 'Credit Applicant Partys', breadcrumb: 'Credit Applicant Partys' },
                loadChildren: () => import('@/views/crm/creditApplicantParty/creditApplicantParty.module').then(m => m.CreditApplicantPartyModule)
            },

            {
                path: 'origination/credit/review',
                data: { title: 'Credit Assessment', breadcrumb: 'Credit Assessment' },
                loadChildren: () => import('@/views/crm/creditAssessment/creditAssessment.module').then(m => m.CreditAssessmentModule)
            },
            {
                path: 'origination/credit/snapshot',
                data: { title: 'Credit Snapshot', breadcrumb: 'Credit Snapshot' },
                loadChildren: () => import('@/views/crm/creditFinancialSnapshot/creditFinancialSnapshot.module').then(m => m.CreditFinancialSnapshotModule)
            },
            {
                path: 'origination/credit/CreditBureauResult',
                data: { title: 'Credit BureauResult', breadcrumb: 'Credit BureauResult' },
                loadChildren: () => import('@/views/crm/creditBureauResult/creditBureauResult.module').then(m => m.CreditBureauResultModule)
            },
            {
                path: 'origination/credit/exposure',
                data: { title: 'Credit Snapshot', breadcrumb: 'Credit Snapshot' },
                loadChildren: () => import('@/views/crm/creditExposure/creditExposure.module').then(m => m.CreditExposureModule)
            },
            {
                path: 'origination/credit/document',
                data: { title: 'Credit Snapshot', breadcrumb: 'Credit Snapshot' },
                loadChildren: () => import('@/views/crm/creditDocumentChecklist/creditDocumentChecklist.module').then(m => m.CreditDocumentChecklistModule)
            },
            {
                path: 'origination/credit/decision',
                data: { title: 'Credit Decision', breadcrumb: 'Credit Decision' },
                loadChildren: () => import('@/views/crm/creditDecision/creditDecision.module').then(m => m.CreditDecisionModule)
            },
              {
                path: 'origination/credit/limits',
                data: { title: 'Credit Limits', breadcrumb: 'Credit Limits' },
                loadChildren: () => import('@/views/crm/creditLimit/creditLimit.module').then(m => m.CreditLimitModule)
            },
              {
                path: 'origination/credit/Conditions',
                data: { title: 'Credit Conditions', breadcrumb: 'Credit Conditions' },
                loadChildren: () => import('@/views/crm/creditCondition/creditCondition.module').then(m => m.CreditConditionModule)
            },
             {
                path: 'origination/credit/approvals',
                data: { title: 'Credit Approvals', breadcrumb: 'Credit Approvals' },
                loadChildren: () => import('@/views/crm/approvalRequest/approvalRequest.module').then(m => m.ApprovalRequestModule)
            },
            {
                path: 'origination/handoffs',
                data: { title: 'Handoffs', breadcrumb: 'Handoffs' },
                loadChildren: () => import('@/views/crm/originationHandoff/originationHandoff.module').then(m => m.OriginationHandoffModule)
            },
            ...ASSET_ROUTES,
            ...PARTY_ROUTES,
            ...ORGANISATION_ROUTES,
            
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
