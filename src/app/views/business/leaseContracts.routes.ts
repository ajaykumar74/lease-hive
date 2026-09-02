import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { BusinessFeatureComponent } from './business-feature.component';

interface LeaseContractPage {
    path: string;
    title: string;
    icon: string;
}

const placeholderPages: LeaseContractPage[] = [
    { path: 'dashboard', title: 'Contract Dashboard', icon: 'pi pi-chart-bar' },
    { path: '', title: 'All Contracts', icon: 'pi pi-list' },
    { path: 'create', title: 'Create Contract', icon: 'pi pi-plus-circle' },
    { path: 'drafts', title: 'Draft Contracts', icon: 'pi pi-pencil' },
    { path: 'pending-approval', title: 'Pending Approval', icon: 'pi pi-clock' },
    { path: 'pending-execution', title: 'Pending Execution', icon: 'pi pi-file-signature' },
    { path: 'pending-activation', title: 'Pending Activation', icon: 'pi pi-play-circle' },
    { path: 'active', title: 'Active Contracts', icon: 'pi pi-check-circle' },
    { path: 'parties', title: 'Contract Parties', icon: 'pi pi-users' },
    { path: 'terms', title: 'Commercial Terms', icon: 'pi pi-percentage' },
    { path: 'assets', title: 'Contract Assets', icon: 'pi pi-box' },
    { path: 'charges', title: 'Charges & Fees', icon: 'pi pi-wallet' },
    { path: 'deposits', title: 'Security Deposits', icon: 'pi pi-shield' },
    { path: 'payment-schedules', title: 'Payment Schedules', icon: 'pi pi-calendar' },
    { path: 'conditions', title: 'Conditions', icon: 'pi pi-check-square' },
    { path: 'obligations', title: 'Contract Obligations', icon: 'pi pi-clipboard' },
    { path: 'assets/pending-allocation', title: 'Pending Allocation', icon: 'pi pi-clock' },
    { path: 'assets/allocated', title: 'Allocated Assets', icon: 'pi pi-link' },
    { path: 'assets/replacement', title: 'Asset Replacement', icon: 'pi pi-sync' },
    { path: 'assets/history', title: 'Allocation History', icon: 'pi pi-history' },
    { path: 'conditions/checklist', title: 'Conditions Checklist', icon: 'pi pi-list-check' },
    { path: 'conditions/pending', title: 'Pending Conditions', icon: 'pi pi-exclamation-circle' },
    { path: 'conditions/evidence', title: 'Condition Evidence', icon: 'pi pi-paperclip' },
    { path: 'conditions/waivers', title: 'Waiver Requests', icon: 'pi pi-exclamation-triangle' },
    { path: 'activation-readiness', title: 'Activation Readiness', icon: 'pi pi-check-circle' },
    { path: 'document-packs', title: 'Document Packs', icon: 'pi pi-folder' },
    { path: 'documents', title: 'Contract Documents', icon: 'pi pi-file-pdf' },
    { path: 'documents/generate', title: 'Generate Agreement', icon: 'pi pi-file-export' },
    { path: 'execution/send', title: 'Send for Signature', icon: 'pi pi-send' },
    { path: 'execution', title: 'Execution Tracker', icon: 'pi pi-file-signature' },
    { path: 'executed', title: 'Executed Contracts', icon: 'pi pi-check-square' },
    { path: 'approvals/my-queue', title: 'My Approval Queue', icon: 'pi pi-inbox' },
    { path: 'approvals/contracts', title: 'Contract Approvals', icon: 'pi pi-file-check' },
    { path: 'approvals/amendments', title: 'Amendment Approvals', icon: 'pi pi-pencil' },
    { path: 'approvals/terminations', title: 'Termination Approvals', icon: 'pi pi-times-circle' },
    { path: 'approvals/waivers', title: 'Waiver Approvals', icon: 'pi pi-exclamation-triangle' },
    { path: 'approvals/history', title: 'Approval History', icon: 'pi pi-history' },
    { path: 'activation/ready', title: 'Ready for Activation', icon: 'pi pi-check-circle' },
    { path: 'activation/exceptions', title: 'Activation Exceptions', icon: 'pi pi-exclamation-circle' },
    { path: 'activation/history', title: 'Activation History', icon: 'pi pi-history' },
    { path: 'handoffs', title: 'Handoff Status', icon: 'pi pi-directions-alt' },
    { path: 'in-life', title: 'Active Contract Workbench', icon: 'pi pi-briefcase' },
    { path: 'amendments/create', title: 'Create Amendment', icon: 'pi pi-plus' },
    { path: 'amendments', title: 'Amendment Worklist', icon: 'pi pi-list' },
    { path: 'amendments/history', title: 'Amendment History', icon: 'pi pi-history' },
    { path: 'assets/release', title: 'Asset Release', icon: 'pi pi-sign-out' },
    { path: 'suspensions', title: 'Suspensions', icon: 'pi pi-pause-circle' },
    { path: 'obligations/worklist', title: 'Contract Obligations', icon: 'pi pi-clipboard' },
    { path: 'notices', title: 'Notices', icon: 'pi pi-envelope' },
    { path: 'maturity/upcoming', title: 'Upcoming Maturities', icon: 'pi pi-calendar-times' },
    { path: 'renewals', title: 'Renewal Options', icon: 'pi pi-refresh' },
    { path: 'extensions', title: 'Extension Requests', icon: 'pi pi-calendar-plus' },
    { path: 'purchase-options', title: 'Purchase Options', icon: 'pi pi-shopping-cart' },
    { path: 'asset-return/due', title: 'Asset Return Due', icon: 'pi pi-undo' },
    { path: 'terminations', title: 'Termination Requests', icon: 'pi pi-file-edit' },
    { path: 'terminations/early', title: 'Early Terminations', icon: 'pi pi-fast-forward' },
    { path: 'terminations/charges', title: 'Termination Charges', icon: 'pi pi-money-bill' },
    { path: 'asset-return', title: 'Asset Return Instructions', icon: 'pi pi-reply' },
    { path: 'closure/pending', title: 'Contracts Pending Closure', icon: 'pi pi-lock-open' },
    { path: 'closed', title: 'Closed Contracts', icon: 'pi pi-lock' },
    { path: 'events', title: 'Contract Events', icon: 'pi pi-history' },
    { path: 'handoffs/monitor', title: 'Handoff Monitor', icon: 'pi pi-share-alt' },
    { path: 'handoffs/failed', title: 'Failed Handoffs', icon: 'pi pi-exclamation-triangle' },
    { path: 'external-references', title: 'External References', icon: 'pi pi-external-link' },
    { path: 'audit', title: 'Contract Audit Trail', icon: 'pi pi-history' },
    { path: 'config/numbering', title: 'Contract Numbering', icon: 'pi pi-sort-numeric-up' },
    { path: 'config/templates', title: 'Contract Templates', icon: 'pi pi-file' },
    { path: 'config/condition-types', title: 'Condition Types', icon: 'pi pi-check-square' },
    { path: 'config/charge-types', title: 'Charge Types', icon: 'pi pi-wallet' },
    { path: 'config/lease-types', title: 'Lease Types', icon: 'pi pi-tags' },
    { path: 'config/payment-frequency', title: 'Payment Frequencies', icon: 'pi pi-calendar' },
    { path: 'config/termination-reasons', title: 'Termination Reasons', icon: 'pi pi-times' },
    { path: 'config/approval-rules', title: 'Approval Rules', icon: 'pi pi-sitemap' }
];

export const LEASE_CONTRACT_ROUTES: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'config/statuses',
                data: { title: 'Contract Statuses', breadcrumb: 'Contract Statuses' },
                loadChildren: () => import('@/views/leaseContracts/leaseContractStatus/leaseContractStatus.module').then(m => m.LeaseContractStatusModule)
            },
            ...placeholderPages.map(page => ({
                path: page.path,
                component: BusinessFeatureComponent,
                data: {
                    title: page.title,
                    area: 'Lease Contracts',
                    icon: page.icon,
                    breadcrumb: page.title
                }
            }))
        ]
    }
];
