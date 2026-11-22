export interface SettingsWorkspaceItem {
    label: string;
    icon: string;
    route?: string;
    /** Kept visible as an unavailable configuration capability; it never links to a generated page. */
    unavailable?: boolean;
}

export interface SettingsWorkspaceGroup {
    label: string;
    icon: string;
    items: SettingsWorkspaceItem[];
}

const item = (label: string, icon: string, route?: string): SettingsWorkspaceItem => ({ label, icon, route, unavailable: !route });

/**
 * The settings workspace is deliberately a navigation shell.  Its entries point
 * at the established feature routes so that existing guards, CRUD screens and
 * deep links continue to be the single source of truth.
 */
export const SETTINGS_WORKSPACE_GROUPS: SettingsWorkspaceGroup[] = [
    { label: 'General', icon: 'pi pi-sliders-h', items: [
        item('Tenant Settings', 'pi pi-sliders-h', '/dashboard/tenant-settings'),
        item('Lease Pricing', 'pi pi-calculator', '/dashboard/lease-pricing'),
        item('Tax Configuration', 'pi pi-percentage', '/dashboard/tax-configuration'),
        item('AI Settings', 'pi pi-sparkles', '/dashboard/ai-settings')
    ] },
    { label: 'Reference Data', icon: 'pi pi-list', items: [
        item('PickList Items', 'pi pi-list', '/dashboard/picklistItems'),
        item('Number Sequences', 'pi pi-sort-numeric-up', '/dashboard/numberSequences')
    ] },
    { label: 'Documents', icon: 'pi pi-folder', items: [
        item('Document Types', 'pi pi-tags', '/dashboard/document-types'),
        item('Document Requirements', 'pi pi-list-check', '/dashboard/document-requirements'),
        item('Document Templates', 'pi pi-file-word', '/dashboard/document-templates'),
        item('Retention Policies', 'pi pi-calendar-clock', '/dashboard/document-retention-policies')
    ] },
    { label: 'Notifications', icon: 'pi pi-bell', items: [
        item('Recipient Rules', 'pi pi-users', '/dashboard/notificationRecipientRules'),
        item('Email Templates', 'pi pi-envelope', '/dashboard/tenantNotifications'),
        item('Email Profiles', 'pi pi-send', '/dashboard/emailProfiles')
    ] },
    { label: 'Access & Security', icon: 'pi pi-shield', items: [
        item('Application Users', 'pi pi-users', '/dashboard/applicationUsers'),
        item('Asset Users', 'pi pi-user-plus', '/dashboard/assetUsers'),
        item('Roles', 'pi pi-id-card', '/dashboard/roles'),
        item('Permissions', 'pi pi-key', '/dashboard/permissions'),
        item('Role Permissions', 'pi pi-lock', '/dashboard/rolePermissions'),
        item('User Roles', 'pi pi-user-edit', '/dashboard/userRoles'),
        item('User Organisation Units', 'pi pi-sitemap', '/dashboard/userOrganisationUnits'),
        item('User Party Access', 'pi pi-building', '/dashboard/userPartyAccesss'),
        item('Approval Authority', 'pi pi-verified', '/dashboard/approvalAuthoritys'),
        item('Delegation', 'pi pi-share-alt', '/dashboard/userDelegations')
    ] },
    { label: 'CRM & Origination', icon: 'pi pi-briefcase', items: [
        item('Credit Statuses', 'pi pi-credit-card', '/business/origination/config/credit-statuses'),
        item('Credit Limits', 'pi pi-wallet', '/business/origination/credit/limits'),
        item('Lead Sources', 'pi pi-tags', '/business/crm/config/lead-sources'),
        item('Lead Statuses', 'pi pi-list-check', '/business/crm/config/lead-statuses'),
        item('Opportunity Stages', 'pi pi-chart-line', '/business/crm/config/opportunity-stages'),
        item('Quote Statuses', 'pi pi-file', '/business/origination/config/quote-statuses'),
        item('Lease Services', 'pi pi-wrench', '/business/origination/config/lease-services'),
        item('Lease Pricing Policies', 'pi pi-sliders-h', '/business/origination/config/lease-pricing-policies')
    ] },
    { label: 'Asset Configuration', icon: 'pi pi-box', items: [
        item('Asset Categories', 'pi pi-tags', '/business/assets/classification/categories'),
        item('Asset Types', 'pi pi-box', '/business/assets/classification/types'),
        item('Asset Makes', 'pi pi-car', '/business/assets/classification/makes'),
        item('Models & Variants', 'pi pi-clone', '/business/assets/classification/models'),
        item('Asset Attribute Definitions', 'pi pi-list', '/business/assets/classification/attribute-definitions'),
        item('Asset Attribute Options', 'pi pi-list-check', '/business/assets/classification/attribute-options'),
        item('Asset Statuses', 'pi pi-circle', '/business/assets/classification/statuses'),
        item('Asset Condition Grades', 'pi pi-star', '/business/assets/condition-grades'),
        item('Measure Definitions', 'pi pi-chart-bar', '/business/assets/measures/definitions'),
        item('Compliance Types', 'pi pi-verified', '/business/assets/compliance/types')
    ] },
    { label: 'Procurement', icon: 'pi pi-shopping-cart', items: [
        item('Requisition Statuses', 'pi pi-list-check', '/business/procurement/config/requisition-statuses'),
        item('RFQ Statuses', 'pi pi-list'),
        item('PO Statuses', 'pi pi-list-check', '/business/procurement/config/po-statuses'),
        item('Receipt Statuses', 'pi pi-check-square', '/business/procurement/config/receipt-statuses'),
        item('Invoice Match Statuses', 'pi pi-file'),
        item('Procurement Policies', 'pi pi-sliders-h')
    ] },
    { label: 'Contract Configuration', icon: 'pi pi-file-edit', items: [
        item('Contract Statuses', 'pi pi-circle', '/contracts/config/statuses')
    ] },
    { label: 'Billing & Finance', icon: 'pi pi-wallet', items: [
        item('Billing Setup', 'pi pi-cog'),
        item('Billing Calendars', 'pi pi-calendar'),
        item('Billing Run Statuses', 'pi pi-play-circle', '/billing-finance/configuration/billing-run-statuses'),
        item('Invoice Statuses', 'pi pi-file', '/billing-finance/configuration/invoice-statuses'),
        item('Receipt Statuses', 'pi pi-receipt', '/billing-finance/configuration/receipt-statuses'),
        item('Payment Terms', 'pi pi-calendar-clock'),
        item('Finance Account Mapping', 'pi pi-sitemap', '/billing-finance/configuration/account-mapping'),
        item('Tax Mapping', 'pi pi-percentage'),
        item('Numbering Rules', 'pi pi-sort-numeric-up'),
        item('Approval Rules', 'pi pi-check-circle'),
        item('Integration Setup', 'pi pi-link')
    ] },
    { label: 'Maintenance & Insurance', icon: 'pi pi-wrench', items: [
        item('Maintenance Types', 'pi pi-wrench', '/maintenance-insurance/maintenance/configuration/types'),
        item('Coverage Types', 'pi pi-shield', '/maintenance-insurance/insurance/configuration/coverage-types'),
        item('Policy Statuses', 'pi pi-circle', '/maintenance-insurance/insurance/configuration/policy-statuses'),
        item('Claim Statuses', 'pi pi-exclamation-circle', '/maintenance-insurance/insurance/configuration/claim-statuses')
    ] },
    { label: 'End-of-Lease & Disposal', icon: 'pi pi-sign-out', items: [
        item('End-of-Lease Statuses', 'pi pi-circle', '/eol-disposal/configuration/statuses'),
        item('End-of-Lease Reasons', 'pi pi-question-circle', '/eol-disposal/configuration/reasons'),
        item('Disposition Methods', 'pi pi-directions', '/eol-disposal/configuration/disposition-methods'),
        item('Settlement Charge Types', 'pi pi-wallet', '/eol-disposal/configuration/settlement-charge-types')
    ] }
];

export const SETTINGS_WORKSPACE_ROUTES = SETTINGS_WORKSPACE_GROUPS
    .flatMap(group => group.items)
    .map(item => item.route)
    .filter((route): route is string => !!route);

export function isSettingsWorkspaceRoute(url: string): boolean {
    const path = url.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
    return path === '/settings' || SETTINGS_WORKSPACE_ROUTES.some(route => path === route || path.startsWith(`${route}/`));
}
