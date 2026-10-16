import { AppMenuItem } from '@/shared/security/menu-permission.service';

const visible = <T extends AppMenuItem>(item: T): T => ({ ...item, alwaysVisible: true });

/** A deliberately small, customer-safe navigation model. It never points to internal CRUD routes. */
export function buildCustomerPortalMenu(isAdmin: boolean): AppMenuItem[] {
    const items: AppMenuItem[] = [
        visible({
            label: 'Customer Portal',
            icon: 'pi pi-building',
            items: [
                visible({ label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/customer-portal/dashboard'] }),
                visible({ label: 'Contracts', icon: 'pi pi-file', routerLink: ['/customer-portal/contracts'] }),
                visible({ label: 'Assets', icon: 'pi pi-car', routerLink: ['/customer-portal/assets'] }),
                visible({ label: 'My Documents', icon: 'pi pi-folder', routerLink: ['/customer-portal/documents'] }),
                visible({ label: 'Invoices & Payments', icon: 'pi pi-wallet', routerLink: ['/customer-portal/invoices'] }),
                visible({ label: 'Maintenance', icon: 'pi pi-wrench', routerLink: ['/customer-portal/maintenance'] }),
                visible({ label: 'End of Lease', icon: 'pi pi-flag', routerLink: ['/customer-portal/end-of-lease'] }),
                visible({ label: 'Support & Contacts', icon: 'pi pi-comments', routerLink: ['/customer-portal/support'] }),
                visible({ label: 'Profile', icon: 'pi pi-user', routerLink: ['/customer-portal/profile'] })
            ]
        })
    ];

    if (isAdmin) {
        items[0].items?.splice(6, 0,
            visible({ label: 'Party Contacts', icon: 'pi pi-users', routerLink: ['/customer-portal/contacts'] }),
            visible({ label: 'Customer Users', icon: 'pi pi-user-plus', routerLink: ['/customer-portal/users'] })
        );
    }

    return items;
}
