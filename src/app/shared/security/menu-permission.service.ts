import { Injectable } from '@angular/core';

import { PermissionService } from './permission.service';

export interface AppMenuItem {
    label?: string;
    routerLink?: string | string[];
    items?: AppMenuItem[];
    separator?: boolean;
    visible?: boolean;
    requiredPermission?: string;
    [key: string]: unknown;
}

interface ResourceRoute {
    route: string;
    resource: string;
}

@Injectable({ providedIn: 'root' })
export class MenuPermissionService {
    private readonly peopleAndAccessRoutes = [
        '/dashboard/my-access',
        '/dashboard/applicationusers',
        '/dashboard/assetusers',
        '/dashboard/roles',
        '/dashboard/permissions',
        '/dashboard/rolepermissions',
        '/dashboard/userroles',
        '/dashboard/userorganisationunits',
        '/dashboard/userpartyaccesss',
        '/dashboard/approvalauthoritys',
        '/dashboard/userdelegations'
    ];

    private readonly publicRoutes = [
        '/dashboard/mydashboard',
        '/dashboard/admin'
    ];

    private readonly resourceRoutes: ResourceRoute[] = [
        { route: '/business/organisations/units', resource: 'foundation.organisationunit' },
        { route: '/business/organisations/locations', resource: 'foundation.location' },
        { route: '/business/organisations/departments', resource: 'foundation.department' },
        { route: '/business/organisations/cost-centres', resource: 'foundation.costcentre' },
        { route: '/business/organisations/profit-centres', resource: 'foundation.profitcentre' },
        { route: '/business/organisations/documents', resource: 'document.document' },
        { route: '/business/organisations', resource: 'foundation.organisation' },
        { route: '/business/parties/customer-profiles', resource: 'party.customerprofile' },
        { route: '/business/parties/supplier-profiles', resource: 'party.supplierprofile' },
        { route: '/business/parties/contacts', resource: 'party.contact' },
        { route: '/business/parties/documents', resource: 'document.document' },
        { route: '/business/parties', resource: 'party.party' },
        { route: '/dashboard/picklistitems', resource: 'configuration.picklistitem' },
        { route: '/dashboard/numbersequences', resource: 'configuration.numbersequence' },
        { route: '/dashboard/tenants', resource: 'configuration.tenant' },
        { route: '/dashboard/subscriptionplans', resource: 'configuration.subscriptionplan' },
        { route: '/dashboard/customers', resource: 'party.customerprofile' },
        { route: '/dashboard/brandpartners', resource: 'party.supplierprofile' },
        { route: '/dashboard/contacts', resource: 'party.contact' },
        { route: '/dashboard/document', resource: 'document.document' },
        { route: '/dashboard/tenantnotifications', resource: 'notification.tenantnotification' },
        { route: '/dashboard/emailprofiles', resource: 'notification.tenantemailprofile' },
        { route: '/dashboard/notificationrecipientrules', resource: 'notification.tenantnotificationrecipentrule' },
        { route: '/dashboard/emailjobqueues', resource: 'notification.emailjobqueue' },
        { route: '/dashboard/auditlogs', resource: 'audit.auditlog' },
        { route: '/business/crm/leads', resource: 'crm.lead' },
        { route: '/business/crm/opportunities', resource: 'crm.opportunity' },
        { route: '/business/crm/leaserequirements', resource: 'crm.leaserequirement' },
        { route: '/business/origination/quotes', resource: 'origination.quote' },
        { route: '/business/origination/credit', resource: 'credit.creditapplication' },
        { route: '/business/assets/acquisitions', resource: 'asset.assetacquisition' },
        { route: '/business/assets/classification/categories', resource: 'asset.assetcategory' },
        { route: '/business/assets/classification/types', resource: 'asset.assettype' },
        { route: '/business/assets/classification/makes', resource: 'asset.assetmake' },
        { route: '/business/assets/classification/models', resource: 'asset.assetmodel' },
        { route: '/business/assets/assignments', resource: 'asset.assetassignment' },
        { route: '/business/assets', resource: 'asset.asset' },
        { route: '/business/procurement/purchase-requisitions', resource: 'procurement.purchaserequisition' },
        { route: '/business/procurement/purchase-orders', resource: 'procurement.purchaseorder' },
        { route: '/business/procurement/goods-receipts', resource: 'procurement.goodsreceipt' },
        { route: '/business/procurement/supplier-invoices', resource: 'procurement.supplierinvoice' },
        { route: '/business/procurement', resource: 'procurement.purchaseorder' },
        { route: '/contracts/amendments', resource: 'contract.contractamendment' },
        { route: '/contracts/payment-schedules', resource: 'contract.leasepaymentschedule' },
        { route: '/contracts', resource: 'contract.leasecontract' },
        { route: '/billing-finance/receipts', resource: 'finance.paymentreceipt' },
        { route: '/billing-finance/accounting/journals', resource: 'finance.journalentry' },
        { route: '/billing-finance', resource: 'finance.customerinvoice' },
        { route: '/maintenance-insurance/maintenance/work-orders', resource: 'maintenance.maintenanceworkorder' },
        { route: '/maintenance-insurance/maintenance', resource: 'maintenance.maintenancerequest' },
        { route: '/maintenance-insurance/insurance/claims', resource: 'insurance.insuranceclaim' },
        { route: '/maintenance-insurance/insurance', resource: 'insurance.insurancepolicy' },
        { route: '/eol-disposal/disposition/cases', resource: 'disposal.disposalcase' },
        { route: '/eol-disposal/returns', resource: 'endoflease.assetreturn' },
        { route: '/eol-disposal', resource: 'endoflease.endofleasecase' }
    ].sort((left, right) => right.route.length - left.route.length);

    constructor(private readonly permissionService: PermissionService) {
    }

    filterMenu(items: AppMenuItem[]): AppMenuItem[] {
        return items
            .map(item => this.filterItem(item, false))
            .filter((item): item is AppMenuItem => item !== null);
    }

    getRequiredPermission(routerLink: string | string[] | undefined): string | null {
        const route = this.normalizeRoute(routerLink);
        if (!route || this.isPeopleAndAccessRoute(route) || this.isPublicRoute(route)) {
            return null;
        }

        const resourceRoute = this.resourceRoutes.find(item => this.isRoutePrefix(item.route, route));
        const resource = resourceRoute?.resource ?? this.getFallbackResource(route);
        return resource ? `${resource}.${this.getAction(route)}` : null;
    }

    isPeopleAndAccessRoute(url: string): boolean {
        const route = this.normalizePath(url);
        return this.peopleAndAccessRoutes.some(allowedRoute => this.isRoutePrefix(allowedRoute, route));
    }

    private filterItem(item: AppMenuItem, inheritedPeopleAndAccess: boolean): AppMenuItem | null {
        if (item.separator) {
            return { ...item };
        }

        const bypassPermissions = inheritedPeopleAndAccess || item.label === 'People & Access';
        const children = item.items
            ?.map(child => this.filterItem(child, bypassPermissions))
            .filter((child): child is AppMenuItem => child !== null);
        const hasChildren = !!item.items?.length;

        if (hasChildren && !children?.length) {
            return null;
        }

        const requiredPermission = bypassPermissions
            ? null
            : item.requiredPermission ?? this.getRequiredPermission(item.routerLink);

        if (requiredPermission && !this.permissionService.hasPermission(requiredPermission)) {
            return null;
        }

        return {
            ...item,
            ...(children ? { items: children } : {})
        };
    }

    private getAction(route: string): string {
        if (/(?:^|\/)(create|new|booknow|capture|receive)(?:\/|$)/.test(route)) {
            return 'create';
        }

        if (/(?:^|\/)(edit|amend)(?:\/|$)/.test(route)) {
            return 'update';
        }

        if (/(?:^|\/)(download|export|reports?)(?:\/|$)/.test(route)) {
            return 'download';
        }

        if (/(?:^|\/)(approve|approvals|pending-approval)(?:\/|$)/.test(route)) {
            return 'approve';
        }

        if (/(?:^|\/)(activate|activation|pending-activation)(?:\/|$)/.test(route)) {
            return 'activate';
        }

        return 'view';
    }

    private getFallbackResource(route: string): string | null {
        const module = this.getModule(route);
        if (!module) {
            return null;
        }

        const segment = route
            .split('/')
            .filter(Boolean)
            .reverse()
            .find(value => !this.isActionOrStructuralSegment(value));

        return segment ? `${module}.${this.toSingularIdentifier(segment)}` : null;
    }

    private getModule(route: string): string | null {
        const routeModules: Array<[string, string]> = [
            ['/business/organisations', 'foundation'],
            ['/business/parties', 'party'],
            ['/business/crm', 'crm'],
            ['/business/origination', 'origination'],
            ['/business/assets', 'asset'],
            ['/business/procurement', 'procurement'],
            ['/contracts', 'contract'],
            ['/billing-finance', 'finance'],
            ['/maintenance-insurance/insurance', 'insurance'],
            ['/maintenance-insurance', 'maintenance'],
            ['/eol-disposal/disposition', 'disposal'],
            ['/eol-disposal', 'endoflease'],
            ['/dashboard', 'dashboard']
        ];

        return routeModules.find(([prefix]) => this.isRoutePrefix(prefix, route))?.[1] ?? null;
    }

    private isActionOrStructuralSegment(segment: string): boolean {
        return [
            'business', 'dashboard', 'create', 'new', 'edit', 'view', 'list', 'configuration',
            'config', 'reports', 'report', 'history', 'pending', 'active', 'drafts', 'workbench'
        ].includes(segment.toLowerCase());
    }

    private toSingularIdentifier(value: string): string {
        const normalized = value.replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (normalized.endsWith('ies')) {
            return `${normalized.slice(0, -3)}y`;
        }
        return normalized.endsWith('s') ? normalized.slice(0, -1) : normalized;
    }

    private isPublicRoute(route: string): boolean {
        return this.publicRoutes.some(publicRoute => this.isRoutePrefix(publicRoute, route));
    }

    private normalizeRoute(routerLink: string | string[] | undefined): string | null {
        const value = Array.isArray(routerLink)
            ? routerLink
                .filter((segment): segment is string => typeof segment === 'string')
                .join('/')
            : routerLink;
        return typeof value === 'string' && value.trim() ? this.normalizePath(value) : null;
    }

    private normalizePath(value: string): string {
        return `/${value.split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, '').toLowerCase()}`;
    }

    private isRoutePrefix(prefix: string, route: string): boolean {
        return route === prefix || route.startsWith(`${prefix}/`);
    }
}
