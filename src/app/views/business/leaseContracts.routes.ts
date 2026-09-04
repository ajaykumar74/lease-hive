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

const moduleRoutes: Routes = [
    {
        path: 'parties',
        data: { title: 'Contract Parties', breadcrumb: 'Contract Parties' },
        loadChildren: () => import('@/views/leaseContracts/leaseContractParty/leaseContractParty.module').then(m => m.LeaseContractPartyModule)
    },
    {
        path: 'terms',
        data: { title: 'Commercial Terms', breadcrumb: 'Commercial Terms' },
        loadChildren: () => import('@/views/leaseContracts/leaseContractTerm/leaseContractTerm.module').then(m => m.LeaseContractTermModule)
    },
    {
        path: 'assets',
        data: { title: 'Contract Assets', breadcrumb: 'Contract Assets' },
        loadChildren: () => import('@/views/leaseContracts/leaseContractAsset/leaseContractAsset.module').then(m => m.LeaseContractAssetModule)
    },
    {
        path: 'charges',
        data: { title: 'Charges & Fees', breadcrumb: 'Charges & Fees' },
        loadChildren: () => import('@/views/leaseContracts/leaseContractCharge/leaseContractCharge.module').then(m => m.LeaseContractChargeModule)
    },
    {
        path: 'deposits',
        data: { title: 'Security Deposits', breadcrumb: 'Security Deposits' },
        loadChildren: () => import('@/views/leaseContracts/leaseContractDeposit/leaseContractDeposit.module').then(m => m.LeaseContractDepositModule)
    },
    {
        path: 'payment-schedules/lines',
        data: { title: 'Payment Schedule Lines', breadcrumb: 'Payment Schedule Lines' },
        loadChildren: () => import('@/views/leaseContracts/leasePaymentScheduleLine/leasePaymentScheduleLine.module').then(m => m.LeasePaymentScheduleLineModule)
    },
    {
        path: 'payment-schedules',
        data: { title: 'Payment Schedules', breadcrumb: 'Payment Schedules' },
        loadChildren: () => import('@/views/leaseContracts/leasePaymentSchedule/leasePaymentSchedule.module').then(m => m.LeasePaymentScheduleModule)
    },
    {
        path: 'conditions/evidence',
        data: { title: 'Condition Evidence', breadcrumb: 'Condition Evidence' },
        loadChildren: () => import('@/views/leaseContracts/contractConditionEvidence/contractConditionEvidence.module').then(m => m.ContractConditionEvidenceModule)
    },
    {
        path: 'conditions',
        data: { title: 'Contract Conditions', breadcrumb: 'Contract Conditions' },
        loadChildren: () => import('@/views/leaseContracts/contractCondition/contractCondition.module').then(m => m.ContractConditionModule)
    },
    {
        path: 'assets/history',
        data: { title: 'Asset Allocation Events', breadcrumb: 'Asset Allocation Events' },
        loadChildren: () => import('@/views/leaseContracts/leaseAssetAllocationEvent/leaseAssetAllocationEvent.module').then(m => m.LeaseAssetAllocationEventModule)
    },
    {
        path: 'documents',
        data: { title: 'Contract Documents', breadcrumb: 'Contract Documents' },
        loadChildren: () => import('@/views/leaseContracts/leaseContractDocumentLink/leaseContractDocumentLink.module').then(m => m.LeaseContractDocumentLinkModule)
    },
    {
        path: 'execution/parties',
        data: { title: 'Execution Parties', breadcrumb: 'Execution Parties' },
        loadChildren: () => import('@/views/leaseContracts/contractExecutionParty/contractExecutionParty.module').then(m => m.ContractExecutionPartyModule)
    },
    {
        path: 'execution',
        data: { title: 'Contract Execution', breadcrumb: 'Contract Execution' },
        loadChildren: () => import('@/views/leaseContracts/contractExecution/contractExecution.module').then(m => m.ContractExecutionModule)
    },
    {
        path: 'approvals/actions',
        data: { title: 'Approval Actions', breadcrumb: 'Approval Actions' },
        loadChildren: () => import('@/views/leaseContracts/contractApprovalAction/contractApprovalAction.module').then(m => m.ContractApprovalActionModule)
    },
    {
        path: 'approvals/contracts',
        data: { title: 'Contract Approvals', breadcrumb: 'Contract Approvals' },
        loadChildren: () => import('@/views/leaseContracts/contractApprovalRequest/contractApprovalRequest.module').then(m => m.ContractApprovalRequestModule)
    },
    {
        path: 'handoffs',
        data: { title: 'Contract Handoffs', breadcrumb: 'Contract Handoffs' },
        loadChildren: () => import('@/views/leaseContracts/contractHandoff/contractHandoff.module').then(m => m.ContractHandoffModule)
    },
    {
        path: 'amendments/changes',
        data: { title: 'Amendment Changes', breadcrumb: 'Amendment Changes' },
        loadChildren: () => import('@/views/leaseContracts/contractAmendmentChange/contractAmendmentChange.module').then(m => m.ContractAmendmentChangeModule)
    },
    {
        path: 'amendments',
        data: { title: 'Contract Amendments', breadcrumb: 'Contract Amendments' },
        loadChildren: () => import('@/views/leaseContracts/contractAmendment/contractAmendment.module').then(m => m.ContractAmendmentModule)
    },
    {
        path: 'suspensions',
        data: { title: 'Contract Suspensions', breadcrumb: 'Contract Suspensions' },
        loadChildren: () => import('@/views/leaseContracts/contractSuspension/contractSuspension.module').then(m => m.ContractSuspensionModule)
    },
    {
        path: 'obligations/events',
        data: { title: 'Obligation Events', breadcrumb: 'Obligation Events' },
        loadChildren: () => import('@/views/leaseContracts/contractObligationEvent/contractObligationEvent.module').then(m => m.ContractObligationEventModule)
    },
    {
        path: 'obligations',
        data: { title: 'Contract Obligations', breadcrumb: 'Contract Obligations' },
        loadChildren: () => import('@/views/leaseContracts/contractObligation/contractObligation.module').then(m => m.ContractObligationModule)
    },
    {
        path: 'notices',
        data: { title: 'Contract Notices', breadcrumb: 'Contract Notices' },
        loadChildren: () => import('@/views/leaseContracts/contractNotice/contractNotice.module').then(m => m.ContractNoticeModule)
    },
    {
        path: 'renewals',
        data: { title: 'Renewal Options', breadcrumb: 'Renewal Options' },
        loadChildren: () => import('@/views/leaseContracts/contractRenewalOption/contractRenewalOption.module').then(m => m.ContractRenewalOptionModule)
    },
    {
        path: 'asset-return',
        data: { title: 'Asset Return Instructions', breadcrumb: 'Asset Return Instructions' },
        loadChildren: () => import('@/views/leaseContracts/contractAssetReturnInstruction/contractAssetReturnInstruction.module').then(m => m.ContractAssetReturnInstructionModule)
    },
    {
        path: 'terminations/charges',
        data: { title: 'Termination Charges', breadcrumb: 'Termination Charges' },
        loadChildren: () => import('@/views/leaseContracts/contractTerminationCharge/contractTerminationCharge.module').then(m => m.ContractTerminationChargeModule)
    },
    {
        path: 'terminations',
        data: { title: 'Contract Terminations', breadcrumb: 'Contract Terminations' },
        loadChildren: () => import('@/views/leaseContracts/contractTermination/contractTermination.module').then(m => m.ContractTerminationModule)
    },
    {
        path: 'events',
        data: { title: 'Contract Events', breadcrumb: 'Contract Events' },
        loadChildren: () => import('@/views/leaseContracts/contractEvent/contractEvent.module').then(m => m.ContractEventModule)
    },
    {
        path: 'external-references',
        data: { title: 'External References', breadcrumb: 'External References' },
        loadChildren: () => import('@/views/leaseContracts/contractExternalReference/contractExternalReference.module').then(m => m.ContractExternalReferenceModule)
    },
    {
        path: 'config/statuses',
        data: { title: 'Contract Statuses', breadcrumb: 'Contract Statuses' },
        loadChildren: () => import('@/views/leaseContracts/leaseContractStatus/leaseContractStatus.module').then(m => m.LeaseContractStatusModule)
    }
];

const modulePaths = new Set(moduleRoutes.map(route => route.path));

const featureRoutes: Routes = [
    ...moduleRoutes,
    ...placeholderPages.filter(page => page.path !== '' && page.path !== 'create' && !modulePaths.has(page.path)).map(page => ({
        path: page.path,
        component: BusinessFeatureComponent,
        data: {
            title: page.title,
            area: 'Lease Contracts',
            icon: page.icon,
            breadcrumb: page.title
        }
    }))
].sort((left, right) => (right.path?.split('/').length ?? 0) - (left.path?.split('/').length ?? 0));

export const LEASE_CONTRACT_ROUTES: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            ...featureRoutes,
            {
                path: '',
                data: { title: 'Lease Contracts', breadcrumb: 'Lease Contracts' },
                loadChildren: () => import('@/views/leaseContracts/leaseContract/leaseContract.module').then(m => m.LeaseContractModule)
            }
        ]
    }
];
