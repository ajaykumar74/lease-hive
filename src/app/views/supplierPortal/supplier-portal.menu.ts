import { AppMenuItem } from '@/shared/security/menu-permission.service';

export function buildSupplierPortalMenu(isAdmin: boolean): AppMenuItem[] {
    const portalItems: AppMenuItem[] = [
        { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/supplier/dashboard'], alwaysVisible: true },
        { label: 'RFQs', icon: 'pi pi-file-edit', routerLink: ['/supplier/rfqs'], alwaysVisible: true },
        { label: 'Purchase Orders', icon: 'pi pi-shopping-cart', routerLink: ['/supplier/purchase-orders'], alwaysVisible: true },
        { label: 'Deliveries', icon: 'pi pi-truck', routerLink: ['/supplier/deliveries'], alwaysVisible: true },
        { label: 'Invoices', icon: 'pi pi-receipt', routerLink: ['/supplier/invoices'], alwaysVisible: true },
        { label: 'Goods Receipts', icon: 'pi pi-check-square', routerLink: ['/supplier/goods-receipts'], alwaysVisible: true },
        { label: 'Profile', icon: 'pi pi-building', routerLink: ['/supplier/profile'], alwaysVisible: true }
    ];

    if (isAdmin) {
        portalItems.push({
            label: 'Supplier Users',
            icon: 'pi pi-users',
            routerLink: ['/supplier/users'],
            alwaysVisible: true
        });
    }

    return [{ label: 'Supplier Portal', icon: 'pi pi-truck', items: portalItems, alwaysVisible: true }];
}
