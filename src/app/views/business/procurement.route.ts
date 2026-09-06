import { Routes } from '@angular/router';
import { BusinessFeatureComponent } from './business-feature.component';
import { ProcurementDashboardComponent } from './procurement-dashboard.component';

type ProcurementModuleLoader = NonNullable<Routes[number]['loadChildren']>;

const moduleRoute = (path: string, title: string, loadChildren: ProcurementModuleLoader) => ({
    path,
    loadChildren,
    data: { title, area: 'Procurement', breadcrumb: title }
});

const placeholderRoute = (path: string, title: string, icon: string) => ({
    path,
    component: BusinessFeatureComponent,
    data: { title, area: 'Procurement', icon, breadcrumb: title }
});

/** Routes for the Procurement section in app.menu.ts. */
export const PROCUREMENT_ROUTES: Routes = [
    { path: 'procurement', redirectTo: 'procurement/dashboard', pathMatch: 'full' },

    {
        path: 'procurement/dashboard',
        component: ProcurementDashboardComponent,
        data: { title: 'Procurement Dashboard', breadcrumb: 'Procurement Dashboard' }
    },
    placeholderRoute('procurement/worklist', 'My Worklist', 'pi pi-inbox'),
    placeholderRoute('procurement/suppliers/qualification', 'Supplier Qualification', 'pi pi-check-circle'),
    moduleRoute(
        'procurement/suppliers/service-areas',
        'Supplier Service Areas',
        () => import('@/views/parties/supplierServiceArea/supplierServiceArea.module').then(m => m.SupplierServiceAreaModule)
    ),
    moduleRoute(
        'procurement/suppliers',
        'Supplier List',
        () => import('@/views/parties/supplierProfile/supplierProfile.module').then(m => m.SupplierProfileModule)
    ),

    { path: 'procurement/requisitions/new', redirectTo: 'procurement/requisitions/create', pathMatch: 'full' },
    { path: 'procurement/requisitions/pending-approval', redirectTo: 'procurement/approvals/pending', pathMatch: 'full' },
    moduleRoute(
        'procurement/requisitions/lines',
        'Requisition Lines',
        () => import('@/views/procurements/purchaseRequisitionLine/purchaseRequisitionLine.module').then(m => m.PurchaseRequisitionLineModule)
    ),
    moduleRoute(
        'procurement/config/requisition-statuses',
        'Requisition Statuses',
        () => import('@/views/procurements/purchaseRequisitionStatus/purchaseRequisitionStatus.module').then(m => m.PurchaseRequisitionStatusModule)
    ),
    moduleRoute(
        'procurement/requisitions',
        'All Requisitions',
        () => import('@/views/procurements/purchaseRequisition/purchaseRequisition.module').then(m => m.PurchaseRequisitionModule)
    ),

    { path: 'procurement/rfqs/new', redirectTo: 'procurement/rfqs/create', pathMatch: 'full' },
    moduleRoute(
        'procurement/rfqs/lines',
        'RFQ Lines',
        () => import('@/views/procurements/rFQLine/rFQLine.module').then(m => m.RFQLineModule)
    ),
    moduleRoute(
        'procurement/rfqs/suppliers',
        'RFQ Suppliers',
        () => import('@/views/procurements/rFQSupplier/rFQSupplier.module').then(m => m.RFQSupplierModule)
    ),
    placeholderRoute('procurement/config/rfq-statuses', 'RFQ Statuses', 'pi pi-list'),
    moduleRoute(
        'procurement/rfqs',
        'RFQs',
        () => import('@/views/procurements/rFQ/rFQ.module').then(m => m.RFQModule)
    ),
    moduleRoute(
        'procurement/supplier-quotations/lines',
        'Supplier Quotation Lines',
        () => import('@/views/procurements/supplierQuotationLine/supplierQuotationLine.module').then(m => m.SupplierQuotationLineModule)
    ),
    moduleRoute(
        'procurement/supplier-quotations',
        'Supplier Quotations',
        () => import('@/views/procurements/supplierQuotation/supplierQuotation.module').then(m => m.SupplierQuotationModule)
    ),
    placeholderRoute('procurement/quotation-comparison', 'Quotation Comparison', 'pi pi-table'),
    moduleRoute(
        'procurement/awards',
        'Supplier Awards',
        () => import('@/views/procurements/supplierAward/supplierAward.module').then(m => m.SupplierAwardModule)
    ),

    { path: 'procurement/purchase-orders/new', redirectTo: 'procurement/purchase-orders/create', pathMatch: 'full' },
    { path: 'procurement/purchase-orders/pending-approval', redirectTo: 'procurement/approvals/pending', pathMatch: 'full' },
    moduleRoute(
        'procurement/purchase-orders/lines',
        'Purchase Order Lines',
        () => import('@/views/procurements/purchaseOrderLine/purchaseOrderLine.module').then(m => m.PurchaseOrderLineModule)
    ),
    moduleRoute(
        'procurement/purchase-orders/acknowledgements',
        'Supplier Acknowledgements',
        () => import('@/views/procurements/purchaseOrderDelivery/purchaseOrderDelivery.module').then(m => m.PurchaseOrderDeliveryModule)
    ),
    moduleRoute(
        'procurement/purchase-orders/amendments',
        'PO Amendments',
        () => import('@/views/procurements/purchaseOrderAmendment/purchaseOrderAmendment.module').then(m => m.PurchaseOrderAmendmentModule)
    ),
    moduleRoute(
        'procurement/config/po-statuses',
        'PO Statuses',
        () => import('@/views/procurements/purchaseOrderStatus/purchaseOrderStatus.module').then(m => m.PurchaseOrderStatusModule)
    ),
    moduleRoute(
        'procurement/purchase-orders',
        'All Purchase Orders',
        () => import('@/views/procurements/purchaseOrder/purchaseOrder.module').then(m => m.PurchaseOrderModule)
    ),

    { path: 'procurement/goods-receipts/new', redirectTo: 'procurement/goods-receipts/create', pathMatch: 'full' },
    moduleRoute(
        'procurement/goods-receipts/lines',
        'Goods Receipt Lines',
        () => import('@/views/procurements/goodsReceiptLine/goodsReceiptLine.module').then(m => m.GoodsReceiptLineModule)
    ),
    moduleRoute(
        'procurement/goods-receipts/serials',
        'Goods Receipt Serials',
        () => import('@/views/procurements/goodsReceiptSerial/goodsReceiptSerial.module').then(m => m.GoodsReceiptSerialModule)
    ),
    moduleRoute(
        'procurement/config/receipt-statuses',
        'Receipt Statuses',
        () => import('@/views/procurements/goodsReceiptStatus/goodsReceiptStatus.module').then(m => m.GoodsReceiptStatusModule)
    ),
    moduleRoute(
        'procurement/goods-receipts',
        'Goods Receipts',
        () => import('@/views/procurements/goodsReceipt/goodsReceipt.module').then(m => m.GoodsReceiptModule)
    ),
    placeholderRoute('procurement/service-receipts', 'Service Receipts', 'pi pi-wrench'),
    moduleRoute(
        'procurement/inspections',
        'Pending Inspection',
        () => import('@/views/procurements/receiptInspection/receiptInspection.module').then(m => m.ReceiptInspectionModule)
    ),
    placeholderRoute('procurement/receipts/rejected', 'Rejected / Returned Receipts', 'pi pi-times-circle'),

    placeholderRoute('procurement/asset-acquisition/pending', 'Pending Asset Creation', 'pi pi-hourglass'),
    moduleRoute(
        'procurement/asset-acquisition/handoffs',
        'Acquisition Handoffs',
        () => import('@/views/procurements/procurementHandoff/procurementHandoff.module').then(m => m.ProcurementHandoffModule)
    ),

    { path: 'procurement/supplier-invoices/new', redirectTo: 'procurement/supplier-invoices/create', pathMatch: 'full' },
    moduleRoute(
        'procurement/supplier-invoices/lines',
        'Supplier Invoice Lines',
        () => import('@/views/procurements/supplierInvoiceLine/supplierInvoiceLine.module').then(m => m.SupplierInvoiceLineModule)
    ),
    moduleRoute(
        'procurement/supplier-invoices/ap-handoff',
        'Ready for AP',
        () => import('@/views/procurements/procurementHandoff/procurementHandoff.module').then(m => m.ProcurementHandoffModule)
    ),
    moduleRoute(
        'procurement/supplier-invoices',
        'All Supplier Invoices',
        () => import('@/views/procurements/supplierInvoice/supplierInvoice.module').then(m => m.SupplierInvoiceModule)
    ),
    moduleRoute(
        'procurement/invoice-matching/exceptions',
        'Match Exceptions',
        () => import('@/views/procurements/procurementException/procurementException.module').then(m => m.ProcurementExceptionModule)
    ),
    moduleRoute(
        'procurement/invoice-matching',
        'Invoice Matching',
        () => import('@/views/procurements/invoiceMatch/invoiceMatch.module').then(m => m.InvoiceMatchModule)
    ),
    placeholderRoute('procurement/config/invoice-match-statuses', 'Invoice Match Statuses', 'pi pi-list'),

    moduleRoute(
        'procurement/approvals/pending',
        'My Pending Approvals',
        () => import('@/views/procurements/approvalRequest/approvalRequest.module').then(m => m.ApprovalRequestModule)
    ),
    moduleRoute(
        'procurement/approvals/history',
        'Approval History',
        () => import('@/views/procurements/approvalRequest/approvalRequest.module').then(m => m.ApprovalRequestModule)
    ),

    placeholderRoute('procurement/reports/spend', 'Procurement Spend', 'pi pi-chart-bar'),
    placeholderRoute('procurement/reports/supplier-performance', 'Supplier Performance', 'pi pi-chart-line'),
    placeholderRoute('procurement/reports/open-requisitions', 'Open Requisitions', 'pi pi-file'),
    placeholderRoute('procurement/reports/open-pos', 'Open Purchase Orders', 'pi pi-shopping-cart'),
    placeholderRoute('procurement/reports/receipt-exceptions', 'Receipt Exceptions', 'pi pi-exclamation-circle'),
    placeholderRoute('procurement/reports/match-exceptions', 'Invoice Match Exceptions', 'pi pi-exclamation-triangle'),
    placeholderRoute('procurement/config/policies', 'Procurement Policies', 'pi pi-sliders-h'),

    moduleRoute(
        'procurement/documents',
        'Procurement Documents',
        () => import('@/views/procurements/procurementDocumentLink/procurementDocumentLink.module').then(m => m.ProcurementDocumentLinkModule)
    ),
    moduleRoute(
        'procurement/exceptions',
        'Procurement Exceptions',
        () => import('@/views/procurements/procurementException/procurementException.module').then(m => m.ProcurementExceptionModule)
    ),
    moduleRoute(
        'procurement/handoffs',
        'Procurement Handoffs',
        () => import('@/views/procurements/procurementHandoff/procurementHandoff.module').then(m => m.ProcurementHandoffModule)
    )
];
