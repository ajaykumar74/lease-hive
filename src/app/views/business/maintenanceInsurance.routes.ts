import { Route, Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceInsuranceDashboardComponent } from './maintenance-insurance-dashboard.component';

const featureRoutes: Routes = [
    feature('maintenance/requests', 'Maintenance Requests', () => import('@/views/maintenanceInsurances/maintenanceRequest/maintenanceRequest.module').then(m => m.MaintenanceRequestModule)),
    feature('maintenance/work-orders/tasks', 'Work Order Tasks', () => import('@/views/maintenanceInsurances/maintenanceWorkOrderTask/maintenanceWorkOrderTask.module').then(m => m.MaintenanceWorkOrderTaskModule)),
    feature('maintenance/work-orders/parts', 'Work Order Parts', () => import('@/views/maintenanceInsurances/maintenanceWorkOrderPart/maintenanceWorkOrderPart.module').then(m => m.MaintenanceWorkOrderPartModule)),
    feature('maintenance/work-orders/labour', 'Work Order Labour', () => import('@/views/maintenanceInsurances/maintenanceWorkOrderLabour/maintenanceWorkOrderLabour.module').then(m => m.MaintenanceWorkOrderLabourModule)),
    feature('maintenance/work-orders/services', 'Work Order Services', () => import('@/views/maintenanceInsurances/maintenanceWorkOrderService/maintenanceWorkOrderService.module').then(m => m.MaintenanceWorkOrderServiceModule)),
    feature('maintenance/work-orders/completions', 'Maintenance Completions', () => import('@/views/maintenanceInsurances/maintenanceCompletion/maintenanceCompletion.module').then(m => m.MaintenanceCompletionModule)),
    feature('maintenance/work-orders', 'Maintenance Work Orders', () => import('@/views/maintenanceInsurances/maintenanceWorkOrder/maintenanceWorkOrder.module').then(m => m.MaintenanceWorkOrderModule)),
    feature('maintenance/schedules', 'Maintenance Schedules', () => import('@/views/maintenanceInsurances/maintenanceSchedule/maintenanceSchedule.module').then(m => m.MaintenanceScheduleModule)),
    feature('maintenance/plans', 'Maintenance Plans', () => import('@/views/maintenanceInsurances/maintenancePlan/maintenancePlan.module').then(m => m.MaintenancePlanModule)),
    feature('maintenance/asset-plans', 'Asset Maintenance Plans', () => import('@/views/maintenanceInsurances/assetMaintenancePlan/assetMaintenancePlan.module').then(m => m.AssetMaintenancePlanModule)),
    feature('maintenance/service-agreements/coverage', 'Service Agreement Coverage', () => import('@/views/maintenanceInsurances/serviceAgreementCoverage/serviceAgreementCoverage.module').then(m => m.ServiceAgreementCoverageModule)),
    feature('maintenance/service-agreements', 'Service Agreements', () => import('@/views/maintenanceInsurances/serviceAgreement/serviceAgreement.module').then(m => m.ServiceAgreementModule)),
    feature('maintenance/history', 'Asset Downtime & History', () => import('@/views/maintenanceInsurances/assetDowntime/assetDowntime.module').then(m => m.AssetDowntimeModule)),
    feature('maintenance/exceptions', 'Maintenance Exceptions', () => import('@/views/maintenanceInsurances/maintenanceException/maintenanceException.module').then(m => m.MaintenanceExceptionModule)),
    feature('maintenance/configuration/types', 'Maintenance Types', () => import('@/views/maintenanceInsurances/maintenanceType/maintenanceType.module').then(m => m.MaintenanceTypeModule)),
    feature('insurance/policies/assets', 'Policy Asset Coverage', () => import('@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset.module').then(m => m.InsurancePolicyAssetModule)),
    feature('insurance/policies/endorsements', 'Policy Endorsements', () => import('@/views/maintenanceInsurances/insurancePolicyEndorsement/insurancePolicyEndorsement.module').then(m => m.InsurancePolicyEndorsementModule)),
    feature('insurance/policies', 'Insurance Policies', () => import('@/views/maintenanceInsurances/insurancePolicy/insurancePolicy.module').then(m => m.InsurancePolicyModule)),
    feature('insurance/renewals', 'Insurance Renewals', () => import('@/views/maintenanceInsurances/insuranceRenewal/insuranceRenewal.module').then(m => m.InsuranceRenewalModule)),
    feature('insurance/incidents', 'Insurance Incidents', () => import('@/views/maintenanceInsurances/insuranceIncident/insuranceIncident.module').then(m => m.InsuranceIncidentModule)),
    feature('insurance/claims/assessments', 'Claim Assessments', () => import('@/views/maintenanceInsurances/insuranceClaimAssessment/insuranceClaimAssessment.module').then(m => m.InsuranceClaimAssessmentModule)),
    feature('insurance/claims', 'Insurance Claims', () => import('@/views/maintenanceInsurances/insuranceClaim/insuranceClaim.module').then(m => m.InsuranceClaimModule)),
    feature('insurance/settlements', 'Claim Settlements', () => import('@/views/maintenanceInsurances/insuranceClaimSettlement/insuranceClaimSettlement.module').then(m => m.InsuranceClaimSettlementModule)),
    feature('insurance/recoveries', 'Insurance Recoveries', () => import('@/views/maintenanceInsurances/insuranceRecovery/insuranceRecovery.module').then(m => m.InsuranceRecoveryModule)),
    feature('insurance/configuration/coverage-types', 'Insurance Coverage Types', () => import('@/views/maintenanceInsurances/insuranceCoverageType/insuranceCoverageType.module').then(m => m.InsuranceCoverageTypeModule)),
    feature('insurance/configuration/policy-statuses', 'Policy Statuses', () => import('@/views/maintenanceInsurances/insurancePolicyStatus/insurancePolicyStatus.module').then(m => m.InsurancePolicyStatusModule)),
    feature('insurance/configuration/claim-statuses', 'Claim Statuses', () => import('@/views/maintenanceInsurances/insuranceClaimStatus/insuranceClaimStatus.module').then(m => m.InsuranceClaimStatusModule)),
    feature('exceptions', 'Maintenance & Insurance Exceptions', () => import('@/views/maintenanceInsurances/maintenanceInsuranceException/maintenanceInsuranceException.module').then(m => m.MaintenanceInsuranceExceptionModule)),
    feature('documents', 'Maintenance & Insurance Documents', () => import('@/views/maintenanceInsurances/maintenanceInsuranceDocumentLink/maintenanceInsuranceDocumentLink.module').then(m => m.MaintenanceInsuranceDocumentLinkModule)),
    feature('handoffs', 'Maintenance & Insurance Handoffs', () => import('@/views/maintenanceInsurances/maintenanceInsuranceHandoff/maintenanceInsuranceHandoff.module').then(m => m.MaintenanceInsuranceHandoffModule)),
    {
        path: 'dashboard',
        component: MaintenanceInsuranceDashboardComponent,
        data: { title: 'Maintenance & Insurance Dashboard', breadcrumb: 'Dashboard' }
    }
].sort((left, right) => (right.path?.split('/').length ?? 0) - (left.path?.split('/').length ?? 0));

export const MAINTENANCE_INSURANCE_ROUTES: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: featureRoutes
    }
];

function feature(path: string, title: string, loadChildren: NonNullable<Route['loadChildren']>): Route {
    return { path, data: { title, breadcrumb: title }, loadChildren };
}
