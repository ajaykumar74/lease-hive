import { Routes } from '@angular/router';
import { BusinessFeatureComponent } from './business-feature.component';

interface ProcurementPage {
    path: string;
    title: string;
    icon: string;
}

// Keep this registry aligned with the Procurement options in app.menu.ts.
// Replace an entry's component with a component or loadChildren binding as
// each Procurement feature is implemented.
const procurementPages: ProcurementPage[] = [
    { path: 'procurement/dashboard', title: 'Procurement Dashboard', icon: 'pi pi-chart-bar' },
    { path: 'procurement/worklist', title: 'My Worklist', icon: 'pi pi-inbox' },
    { path: 'procurement/suppliers', title: 'Supplier List', icon: 'pi pi-list' },
    { path: 'procurement/suppliers/qualification', title: 'Supplier Qualification', icon: 'pi pi-check-circle' },
    { path: 'procurement/suppliers/service-areas', title: 'Supplier Service Areas', icon: 'pi pi-map' },
    { path: 'procurement/requisitions', title: 'All Requisitions', icon: 'pi pi-list' },
    { path: 'procurement/requisitions/new', title: 'Create Requisition', icon: 'pi pi-plus' },
    { path: 'procurement/requisitions/pending-approval', title: 'Requisitions Pending Approval', icon: 'pi pi-clock' },
    { path: 'procurement/rfqs', title: 'RFQs', icon: 'pi pi-list' },
    { path: 'procurement/rfqs/new', title: 'Create RFQ', icon: 'pi pi-plus' },
    { path: 'procurement/supplier-quotations', title: 'Supplier Quotations', icon: 'pi pi-comments' },
    { path: 'procurement/quotation-comparison', title: 'Quotation Comparison', icon: 'pi pi-table' },
    { path: 'procurement/awards', title: 'Supplier Awards', icon: 'pi pi-trophy' },
    { path: 'procurement/purchase-orders', title: 'All Purchase Orders', icon: 'pi pi-list' },
    { path: 'procurement/purchase-orders/new', title: 'Create Purchase Order', icon: 'pi pi-plus' },
    { path: 'procurement/purchase-orders/pending-approval', title: 'Purchase Orders Pending Approval', icon: 'pi pi-clock' },
    { path: 'procurement/purchase-orders/acknowledgements', title: 'Supplier Acknowledgements', icon: 'pi pi-check-square' },
    { path: 'procurement/purchase-orders/amendments', title: 'PO Amendments', icon: 'pi pi-history' },
    { path: 'procurement/goods-receipts', title: 'Goods Receipts', icon: 'pi pi-list' },
    { path: 'procurement/goods-receipts/new', title: 'Receive Goods', icon: 'pi pi-plus' },
    { path: 'procurement/service-receipts', title: 'Service Receipts', icon: 'pi pi-wrench' },
    { path: 'procurement/inspections', title: 'Pending Inspection', icon: 'pi pi-search' },
    { path: 'procurement/receipts/rejected', title: 'Rejected / Returned Receipts', icon: 'pi pi-times-circle' },
    { path: 'procurement/asset-acquisition/pending', title: 'Pending Asset Creation', icon: 'pi pi-hourglass' },
    { path: 'procurement/asset-acquisition/handoffs', title: 'Acquisition Handoffs', icon: 'pi pi-arrow-right-arrow-left' },
    { path: 'procurement/supplier-invoices', title: 'All Supplier Invoices', icon: 'pi pi-list' },
    { path: 'procurement/supplier-invoices/new', title: 'Capture Invoice', icon: 'pi pi-plus' },
    { path: 'procurement/invoice-matching', title: 'Invoice Matching', icon: 'pi pi-check-square' },
    { path: 'procurement/invoice-matching/exceptions', title: 'Match Exceptions', icon: 'pi pi-exclamation-triangle' },
    { path: 'procurement/supplier-invoices/ap-handoff', title: 'Ready for AP', icon: 'pi pi-forward' },
    { path: 'procurement/approvals/pending', title: 'My Pending Approvals', icon: 'pi pi-clock' },
    { path: 'procurement/approvals/history', title: 'Approval History', icon: 'pi pi-history' },
    { path: 'procurement/reports/spend', title: 'Procurement Spend', icon: 'pi pi-chart-bar' },
    { path: 'procurement/reports/supplier-performance', title: 'Supplier Performance', icon: 'pi pi-chart-line' },
    { path: 'procurement/reports/open-requisitions', title: 'Open Requisitions', icon: 'pi pi-file' },
    { path: 'procurement/reports/open-pos', title: 'Open Purchase Orders', icon: 'pi pi-shopping-cart' },
    { path: 'procurement/reports/receipt-exceptions', title: 'Receipt Exceptions', icon: 'pi pi-exclamation-circle' },
    { path: 'procurement/reports/match-exceptions', title: 'Invoice Match Exceptions', icon: 'pi pi-exclamation-triangle' },
    { path: 'procurement/config/requisition-statuses', title: 'Requisition Statuses', icon: 'pi pi-list' },
    { path: 'procurement/config/rfq-statuses', title: 'RFQ Statuses', icon: 'pi pi-list' },
    { path: 'procurement/config/po-statuses', title: 'PO Statuses', icon: 'pi pi-list' },
    { path: 'procurement/config/receipt-statuses', title: 'Receipt Statuses', icon: 'pi pi-list' },
    { path: 'procurement/config/invoice-match-statuses', title: 'Invoice Match Statuses', icon: 'pi pi-list' },
    { path: 'procurement/config/policies', title: 'Procurement Policies', icon: 'pi pi-sliders-h' }
];

export const PROCUREMENT_ROUTES: Routes = [
    { path: 'procurement', redirectTo: 'procurement/dashboard', pathMatch: 'full' },
    ...procurementPages.map((page) => ({
        path: page.path,
        component: BusinessFeatureComponent,
        data: {
            title: page.title,
            area: 'Procurement',
            icon: page.icon,
            breadcrumb: page.title
        }
    }))
];
