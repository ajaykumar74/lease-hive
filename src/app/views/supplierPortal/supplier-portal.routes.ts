import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { SupplierPortalAdministratorGuard, SupplierPortalGuard } from './supplier-portal.guard';
import { SupplierPortalDashboardComponent } from './supplier-portal-dashboard.component';
import { SupplierPortalUsersComponent } from './supplier-portal-users.component';
import { SupplierPortalProfileComponent } from './supplier-portal-profile.component';
import { SupplierPortalRfqsComponent } from './supplier-portal-rfqs.component';
import { SupplierPortalPurchaseOrdersComponent } from './supplier-portal-purchase-orders.component';
import { SupplierPortalDeliveriesComponent } from './supplier-portal-deliveries.component';
import { SupplierPortalInvoicesComponent } from './supplier-portal-invoices.component';
import { SupplierPortalGoodsReceiptsComponent } from './supplier-portal-goods-receipts.component';

export const SUPPLIER_PORTAL_ROUTES: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: SupplierPortalDashboardComponent, canActivate: [SupplierPortalGuard], data: { title: 'Supplier Portal Dashboard', breadcrumb: 'Dashboard' } },
            { path: 'rfqs', component: SupplierPortalRfqsComponent, canActivate: [SupplierPortalGuard], data: { title: 'Supplier RFQs', breadcrumb: 'RFQs' } },
            { path: 'rfqs/:id', component: SupplierPortalRfqsComponent, canActivate: [SupplierPortalGuard], data: { title: 'RFQ Response', breadcrumb: 'RFQ response' } },
            { path: 'purchase-orders', component: SupplierPortalPurchaseOrdersComponent, canActivate: [SupplierPortalGuard], data: { title: 'Supplier Purchase Orders', breadcrumb: 'Purchase Orders' } },
            { path: 'purchase-orders/:id', component: SupplierPortalPurchaseOrdersComponent, canActivate: [SupplierPortalGuard], data: { title: 'Purchase Order', breadcrumb: 'Purchase order' } },
            { path: 'deliveries/new', component: SupplierPortalDeliveriesComponent, canActivate: [SupplierPortalGuard], data: { title: 'Submit Delivery', breadcrumb: 'Submit delivery' } },
            { path: 'deliveries/:id', component: SupplierPortalDeliveriesComponent, canActivate: [SupplierPortalGuard], data: { title: 'Delivery', breadcrumb: 'Delivery' } },
            { path: 'deliveries', component: SupplierPortalDeliveriesComponent, canActivate: [SupplierPortalGuard], data: { title: 'Supplier Deliveries', breadcrumb: 'Deliveries' } },
            { path: 'invoices/new', component: SupplierPortalInvoicesComponent, canActivate: [SupplierPortalGuard], data: { title: 'Submit Invoice', breadcrumb: 'Submit invoice' } },
            { path: 'invoices/:id', component: SupplierPortalInvoicesComponent, canActivate: [SupplierPortalGuard], data: { title: 'Invoice', breadcrumb: 'Invoice' } },
            { path: 'invoices', component: SupplierPortalInvoicesComponent, canActivate: [SupplierPortalGuard], data: { title: 'Supplier Invoices', breadcrumb: 'Invoices' } },
            { path: 'goods-receipts', component: SupplierPortalGoodsReceiptsComponent, canActivate: [SupplierPortalGuard], data: { title: 'Goods Receipts', breadcrumb: 'Goods Receipts' } },
            { path: 'goods-receipts/:id', component: SupplierPortalGoodsReceiptsComponent, canActivate: [SupplierPortalGuard], data: { title: 'Goods Receipt', breadcrumb: 'Goods Receipt' } },
            { path: 'profile', component: SupplierPortalProfileComponent, canActivate: [SupplierPortalGuard], data: { title: 'Supplier Profile', breadcrumb: 'Profile' } },
            { path: 'users', component: SupplierPortalUsersComponent, canActivate: [SupplierPortalAdministratorGuard], data: { title: 'Supplier Users', breadcrumb: 'User Management' } }
        ]
    }
];
