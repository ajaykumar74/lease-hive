import { Route, Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { BusinessFeatureComponent } from './business-feature.component';
import { EolDisposalDashboardComponent } from './eol-disposal-dashboard.component';

const featureRoutes: Routes = [
    feature('cases', 'End-of-Lease Cases', () => import('@/views/eolDisposals/endOfLeaseCase/endOfLeaseCase.module').then(m => m.EndOfLeaseCaseModule)),
    feature('notices', 'End-of-Lease Notices', () => import('@/views/eolDisposals/endOfLeaseNotice/endOfLeaseNotice.module').then(m => m.EndOfLeaseNoticeModule)),
    feature('options', 'End-of-Lease Options', () => import('@/views/eolDisposals/endOfLeaseOption/endOfLeaseOption.module').then(m => m.EndOfLeaseOptionModule)),
    feature('returns/schedule', 'Return Schedule', () => import('@/views/eolDisposals/assetReturnSchedule/assetReturnSchedule.module').then(m => m.AssetReturnScheduleModule)),
    feature('returns/checklists', 'Return Item Checklists', () => import('@/views/eolDisposals/returnItemChecklist/returnItemChecklist.module').then(m => m.ReturnItemChecklistModule)),
    feature('returns/supplier', 'Supplier Returns', () => import('@/views/eolDisposals/supplierReturn/supplierReturn.module').then(m => m.SupplierReturnModule)),
    feature('returns', 'Asset Returns', () => import('@/views/eolDisposals/assetReturn/assetReturn.module').then(m => m.AssetReturnModule)),
    feature('assessments/damages', 'Return Assessment Damages', () => import('@/views/eolDisposals/returnAssessmentDamage/returnAssessmentDamage.module').then(m => m.ReturnAssessmentDamageModule)),
    feature('assessments/excess-usage', 'Excess Usage Assessments', () => import('@/views/eolDisposals/excessUsageAssessment/excessUsageAssessment.module').then(m => m.ExcessUsageAssessmentModule)),
    feature('assessments', 'Return Assessments', () => import('@/views/eolDisposals/returnAssessment/returnAssessment.module').then(m => m.ReturnAssessmentModule)),
    feature('settlements/lines', 'Settlement Lines', () => import('@/views/eolDisposals/endOfLeaseSettlementLine/endOfLeaseSettlementLine.module').then(m => m.EndOfLeaseSettlementLineModule)),
    feature('settlements/acknowledgements', 'Settlement Acknowledgements', () => import('@/views/eolDisposals/settlementAcknowledgement/settlementAcknowledgement.module').then(m => m.SettlementAcknowledgementModule)),
    feature('settlements', 'End-of-Lease Settlements', () => import('@/views/eolDisposals/endOfLeaseSettlement/endOfLeaseSettlement.module').then(m => m.EndOfLeaseSettlementModule)),
    feature('purchase-options', 'Purchase Option Exercises', () => import('@/views/eolDisposals/purchaseOptionExercise/purchaseOptionExercise.module').then(m => m.PurchaseOptionExerciseModule)),
    feature('disposition/decisions', 'Asset Disposition Decisions', () => import('@/views/eolDisposals/assetDispositionDecision/assetDispositionDecision.module').then(m => m.AssetDispositionDecisionModule)),
    feature('disposition/cases', 'Disposal Cases', () => import('@/views/eolDisposals/disposalCase/disposalCase.module').then(m => m.DisposalCaseModule)),
    feature('disposition/market/offers', 'Disposal Offers', () => import('@/views/eolDisposals/disposalOffer/disposalOffer.module').then(m => m.DisposalOfferModule)),
    feature('disposition/market/bids', 'Disposal Bids', () => import('@/views/eolDisposals/disposalBid/disposalBid.module').then(m => m.DisposalBidModule)),
    feature('disposition/market/auctions', 'Disposal Auctions', () => import('@/views/eolDisposals/disposalAuction/disposalAuction.module').then(m => m.DisposalAuctionModule)),
    feature('disposition/market/awards', 'Disposal Awards', () => import('@/views/eolDisposals/disposalAward/disposalAward.module').then(m => m.DisposalAwardModule)),
    feature('disposition/valuations', 'Disposal Valuation References', () => import('@/views/eolDisposals/disposalValuationReference/disposalValuationReference.module').then(m => m.DisposalValuationReferenceModule)),
    feature('disposition/sales', 'Asset Sales', () => import('@/views/eolDisposals/assetSale/assetSale.module').then(m => m.AssetSaleModule)),
    feature('disposition/scrap', 'Asset Scrap', () => import('@/views/eolDisposals/assetScrap/assetScrap.module').then(m => m.AssetScrapModule)),
    feature('disposition/write-offs', 'Asset Write-Offs', () => import('@/views/eolDisposals/assetWriteOff/assetWriteOff.module').then(m => m.AssetWriteOffModule)),
    feature('disposition/refurbishment-handoffs', 'Refurbishment Handoffs', () => import('@/views/eolDisposals/refurbishmentHandoff/refurbishmentHandoff.module').then(m => m.RefurbishmentHandoffModule)),
    feature('configuration/statuses', 'End-of-Lease Statuses', () => import('@/views/eolDisposals/endOfLeaseStatus/endOfLeaseStatus.module').then(m => m.EndOfLeaseStatusModule)),
    feature('configuration/reasons', 'End-of-Lease Reasons', () => import('@/views/eolDisposals/endOfLeaseReason/endOfLeaseReason.module').then(m => m.EndOfLeaseReasonModule)),
    feature('configuration/disposition-methods', 'Disposition Methods', () => import('@/views/eolDisposals/dispositionMethod/dispositionMethod.module').then(m => m.DispositionMethodModule)),
    feature('configuration/settlement-charge-types', 'Settlement Charge Types', () => import('@/views/eolDisposals/settlementChargeType/settlementChargeType.module').then(m => m.SettlementChargeTypeModule)),
    feature('exceptions', 'End-of-Lease & Disposal Exceptions', () => import('@/views/eolDisposals/endOfLeaseDisposalException/endOfLeaseDisposalException.module').then(m => m.EndOfLeaseDisposalExceptionModule)),
    feature('documents', 'End-of-Lease & Disposal Documents', () => import('@/views/eolDisposals/endOfLeaseDisposalDocumentLink/endOfLeaseDisposalDocumentLink.module').then(m => m.EndOfLeaseDisposalDocumentLinkModule)),
    feature('handoffs', 'End-of-Lease & Disposal Handoffs', () => import('@/views/eolDisposals/endOfLeaseDisposalHandoff/endOfLeaseDisposalHandoff.module').then(m => m.EndOfLeaseDisposalHandoffModule)),
    {
        path: 'dashboard',
        component: EolDisposalDashboardComponent,
        data: { title: 'End-of-Lease & Disposal Dashboard', area: 'End-of-Lease & Disposal', icon: 'pi pi-chart-bar', breadcrumb: 'Dashboard' }
    },
    {
        path: 'upcoming',
        component: BusinessFeatureComponent,
        data: { title: 'Upcoming Expiries', area: 'End-of-Lease & Disposal', icon: 'pi pi-calendar-times', breadcrumb: 'Upcoming Expiries' }
    }
].sort((left, right) => (right.path?.split('/').length ?? 0) - (left.path?.split('/').length ?? 0));

export const EOL_DISPOSAL_ROUTES: Routes = [
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
