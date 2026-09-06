import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: any[] = [];

    constructor(private loggedInUserService: LoggedInUserService) { }
    ngOnInit() {
        if (this.loggedInUserService.loggedInUser.AccountType == 'Platform') {
            this.model = [
                {
                    label: 'Dashboards',
                    icon: 'pi pi-server',
                    items: [
                        {
                            label: 'My Dashboard',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/mydashboard'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'My Fleet',
                            icon: 'pi pi-fw pi-car',
                            routerLink: ['/dashboard/myfleet'],
                            tooltip: 'View and add vehicles for subscription here'
                        },
                        {
                            label: 'Fleet Schedule',
                            icon: 'pi pi-fw pi-calendar-clock',
                            routerLink: ['/dashboard/vehicle-schedule'],
                            tooltip: 'View fleet schedule here'
                        },
                        {
                            label: 'Fleet Scores',
                            icon: 'pi pi-fw pi-chart-line',
                            routerLink: ['/dashboard/myfleet/scores'],
                            tooltip: 'See how each vehicle is scored here + Benchmark Functionality will be deployed during BETA'
                        },
                        {
                            label: 'Vehicle Insurance',
                            icon: 'pi pi-fw pi-check-square',
                            routerLink: ['/dashboard/insurances'],
                            tooltip: 'Capture your current insurance details here; allowing the system to track and manage renewal dates'
                        },
                        {
                            label: 'Service Calendar',
                            icon: 'pi pi-fw pi-calendar-times',
                            routerLink: ['/dashboard/serviceSchedules/calendar'],
                            tooltip: 'Check when your vehicles are due a next service/ MOT on the calendar based on vehicle registration date and last service history'
                        },
                        {
                            label: 'Service Booking',
                            icon: 'pi pi-fw pi-sort-down-fill',
                            tooltip: 'See all payments/ accounts processed via FleetHive',
                            items: [
                                {
                                    label: 'Book a Service',
                                    icon: 'pi pi-fw pi-calendar-times',
                                    routerLink: ['/dashboard/serviceBookings/booknow'],
                                    tooltip: 'Book service for your vehicles'
                                },
                                {
                                    label: 'Active Bookings',
                                    icon: 'pi pi-fw pi-calendar-times',
                                    routerLink: ['/dashboard/serviceBookings'],
                                    tooltip: 'Confirm/ amend current service/ MOT/ Tyre bookings or make a new online booking here with over 6,600 service/ tyre centres'
                                },
                                {
                                    label: 'Bookings History',
                                    icon: 'pi pi-fw pi-calendar-times',
                                    routerLink: ['/dashboard/serviceBookings/history'],
                                    tooltip: 'Confirm/ amend current service/ MOT/ Tyre bookings or make a new online booking here with over 6,600 service/ tyre centres'
                                }
                            ]
                        },
                        {
                            label: 'Statements',
                            icon: 'pi pi-fw pi-sort-down-fill',
                            items: [
                                {
                                    label: 'Vehicle Statement',
                                    icon: 'pi pi-fw pi-file',
                                    routerLink: ['/dashboard/Statements'],
                                    tooltip: 'View and export all spend/ statements here'
                                }
                            ]
                        },
                        {
                            label: 'Accounts',
                            icon: 'pi pi-fw pi-sort-down-fill',
                            tooltip: 'See all payments/ accounts processed via FleetHive',
                            items: [
                                {
                                    label: 'FleetHive Invoices',
                                    icon: 'pi pi-fw pi-server',
                                    routerLink: ['/dashboard/invoices/list'],
                                    tooltip: ''
                                },
                                {
                                    label: 'Payments',
                                    icon: 'pi pi-fw pi-wallet',
                                    routerLink: ['/dashboard/PaymentCheckout/list'],
                                    tooltip: ''
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Profile',
                    icon: 'pi pi-th-large',
                    tooltip: 'Set-up/ Set up admin users + allocate drivers to vehicles',
                    items: [
                        {
                            label: 'Settings',
                            icon: 'pi pi-fw pi-sort-down-fill',
                            items: [
                                {
                                    label: 'Users',
                                    icon: 'pi pi-fw pi-users',
                                    routerLink: ['/dashboard/portalUsers'],
                                    tooltip: ''
                                },

                                {
                                    label: 'Historic Invoices',
                                    icon: 'pi pi-fw pi-server',
                                    routerLink: ['/dashboard/serviceInvoices'],
                                    tooltip: 'Access all previous service invoices here'
                                },
                                {
                                    label: 'Items',
                                    icon: 'pi pi-fw pi-clipboard',
                                    routerLink: ['/dashboard/items'],
                                    tooltip: ''
                                },
                                {
                                    label: 'Account Head',
                                    icon: 'pi pi-fw pi-user',
                                    routerLink: ['/dashboard/accountHeads'],
                                    tooltip: ''
                                }
                            ]
                        },
                        {
                            label: 'Susbscription',
                            icon: 'pi pi-fw pi-pen-to-square',
                            routerLink: ['/dashboard/subscriptions'],
                            tooltip: 'View and amend subscription/ cancel subscription here'
                        },
                        {
                            label: 'Referrals',
                            icon: 'pi pi-fw pi-id-card',
                            routerLink: ['/dashboard/referrals'],
                            tooltip: 'Happy with the solution? Create an easy and simple referral here to earn monthly credits on your subscription for every successful referral'
                        }
                    ]
                }
            ];
        } else if (this.loggedInUserService.loggedInUser.AccountType == 'Tenant') {
            this.model = [
                {
                    label: 'Dashboards',
                    icon: 'pi pi-server',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/mydashboard/'],
                            tooltip: 'see your dashboard here'
                        }/* ,
                        {
                            label: 'Approvals',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'tenants',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/tenants/'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'Subscription Plans',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/subscriptionPlans/'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'Customers',
                            icon: 'pi pi-fw pi-address-book',
                            routerLink: ['/dashboard/customers/list/'],
                            tooltip: ''
                        } */
                    ]
                },
                {
                    label: 'Foundation',
                    icon: 'pi pi-server',
                    items: [
                        {
                            label: 'Organisation',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Organisation Dashboard',
                                    icon: 'pi pi-fw pi-chart-bar',
                                    routerLink: ['/business/organisations/dashboard']
                                },
                                {
                                    label: 'Companies & legal entities',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/business/organisations'],
                                    tooltip: 'see you organisation/ legal entities here'
                                },
                                {
                                    label: 'Regions and branches',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/business/organisations/units'],
                                    tooltip: 'See your fleet/ actions and costs here'
                                },
                                {
                                    label: 'Locations',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/business/organisations/locations'],
                                    tooltip: 'see your locations here'
                                },
                                {
                                    label: 'Departments',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/business/organisations/departments'],
                                    tooltip: ''
                                },
                                {
                                    label: 'Cost / profit centres',
                                    icon: 'pi pi-fw pi-address-book',
                                    items: [
                                        {
                                            label: 'Cost Centres',
                                            icon: 'pi pi-fw pi-address-book',
                                            routerLink: ['/business/organisations/cost-centres'],
                                            tooltip: ''
                                        },
                                        {
                                            label: 'Profit Centres',
                                            icon: 'pi pi-fw pi-address-book',
                                            routerLink: ['/business/organisations/profit-centres'],
                                            tooltip: ''
                                        }
                                    ]
                                },
                                {
                                    label: 'Business calendars',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/business/organisations/calendars'],
                                    tooltip: ''
                                },
                                {
                                    label: 'Documents',
                                    icon: 'pi pi-fw pi-folder',
                                    routerLink: ['/business/organisations/documents']
                                }
                            ]
                        },
                        {
                            label: 'Party Management',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Party Dashboard',
                                    icon: 'pi pi-fw pi-chart-bar',
                                    routerLink: ['/business/parties/dashboard']
                                },
                                {
                                    label: 'All parties',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/business/parties']
                                },
                                {
                                    label: 'Customer profiles',
                                    icon: 'pi pi-fw pi-times-circle',
                                    routerLink: ['/business/parties/customer-profiles']
                                },
                                {
                                    label: 'Supplier profiles',
                                    icon: 'pi pi-fw pi-lock',
                                    routerLink: ['/business/parties/supplier-profiles']
                                },
                                 {
                                    label: 'Supplier Service Area',
                                    icon: 'pi pi-fw pi-lock',
                                    routerLink: ['/business/parties/supplier-service-areas']
                                },
                                {
                                    label: 'Party roles',
                                    icon: 'pi pi-fw pi-user-plus',
                                    routerLink: ['/business/parties/roles']
                                },
                                {
                                    label: 'Party relationships',
                                    icon: 'pi pi-fw pi-question',
                                    routerLink: ['/business/parties/relationships']
                                },
                                {
                                    label: 'Contacts and documents',
                                    icon: 'pi pi-fw pi-cog',
                                    items: [
                                        {
                                            label: 'Party contacts',
                                            icon: 'pi pi-fw pi-question',
                                            routerLink: ['/business/parties/contacts']
                                        }
                                    ]
                                },
                                {
                                    label: 'Tax & Banking',
                                    icon: 'pi pi-fw pi-wallet',
                                    items: [
                                        {
                                            label: 'GST registrations',
                                            icon: 'pi pi-fw pi-receipt',
                                            routerLink: ['/business/parties/gst-registrations'],
                                            tooltip: 'View party GST registrations'
                                        },
                                        {
                                            label: 'Party Locations',
                                            icon: 'pi pi-fw pi-map-marker',
                                            routerLink: ['/business/parties/locations'],
                                            tooltip: 'View party locations'
                                        },
                                        {
                                            label: 'Tax profiles',
                                            icon: 'pi pi-fw pi-percentage',
                                            routerLink: ['/business/parties/tax-profiles'],
                                            tooltip: 'View party tax registrations'
                                        },
                                        {
                                            label: 'Bank accounts',
                                            icon: 'pi pi-fw pi-building-columns',
                                            routerLink: ['/business/parties/bank-accounts'],
                                            tooltip: 'View party bank accounts'
                                        },
                                        {
                                            label: 'Credit profiles',
                                            icon: 'pi pi-fw pi-chart-line',
                                            routerLink: ['/business/parties/credit-profiles']
                                        },
                                        {
                                            label: 'KYC documents',
                                            icon: 'pi pi-fw pi-id-card',
                                            routerLink: ['/business/parties/documents']
                                        },
                                        {
                                            label: 'Verification status',
                                            icon: 'pi pi-fw pi-verified',
                                            routerLink: ['/business/parties/verification-status']
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            label: 'People & Access',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Application users',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/applicationUsers/list'],
                                    tooltip: 'See your fleet/ actions and costs here'
                                },
                                {
                                    label: 'Asset users',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/assetUsers/list'],
                                    tooltip: 'See your fleet/ actions and costs here'
                                },
                                {
                                    label: 'Roles and permissions',
                                    icon: 'pi pi-fw pi-home',
                                    items: [
                                        {
                                            label: 'Roles',
                                            icon: 'pi pi-fw pi-home',
                                            routerLink: ['/dashboard/roles/list']
                                        },
                                        {
                                            label: 'Permissions',
                                            icon: 'pi pi-fw pi-home',
                                            routerLink: ['/dashboard/permissions/list']
                                        },
                                        {
                                            label: 'User Roles',
                                            icon: 'pi pi-fw pi-home',
                                            routerLink: ['/dashboard/userRoles/list']
                                        },
                                        {
                                            label: 'User Organisation Units',
                                            icon: 'pi pi-fw pi-home',
                                            routerLink: ['/dashboard/userOrganisationUnits/list']
                                        },
                                        {
                                            label: 'User Party Access',
                                            icon: 'pi pi-fw pi-home',
                                            routerLink: ['/dashboard/userPartyAccesss/list']
                                        }
                                    ]
                                },
                                {
                                    label: 'Organisation scope',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/customers/list/'],
                                    tooltip: ''
                                },
                                {
                                    label: 'Approval authority',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/approvalAuthoritys/list'],
                                    tooltip: ''
                                },
                                {
                                    label: 'Delegation',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/userDelegations/list/'],
                                    tooltip: ''
                                }
                            ]
                        },
                        {
                            label: 'Audit & Reporting',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Audit log',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/auditLogs/list/'],
                                    tooltip: 'See your fleet/ actions and costs here'
                                },
                                {
                                    label: 'Login history',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/admin/'],
                                    tooltip: 'See your fleet/ actions and costs here'
                                },
                                {
                                    label: 'Master-data changes',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/admin/'],
                                    tooltip: 'See your fleet/ actions and costs here'
                                },
                                {
                                    label: 'Approval history',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/customers/list/'],
                                    tooltip: ''
                                },
                                {
                                    label: 'Export centre',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/customers/list/'],
                                    tooltip: ''
                                },
                                {
                                    label: 'Operational reports',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/customers/list/'],
                                    tooltip: ''
                                }
                            ]
                        },
                        {
                            label: 'Configurations and masters',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Number sequences',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/numberSequences/'],
                                    tooltip: 'See your fleet/ actions and costs here'
                                }
                            ]
                        }
                    ]
                },

                {
                    label: 'Business',
                    icon: 'pi pi-th-large',
                    items: [
                        {
                            label: 'CRM & Origination',
                            icon: 'pi pi-fw pi-users',
                            items: [
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-fw pi-chart-bar',
                                    routerLink: ['/business/crm/dashboard']
                                },

                                {
                                    label: 'Leads',
                                    icon: 'pi pi-fw pi-user-plus',
                                    items: [
                                        {
                                            label: 'All Leads',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/crm/leads']
                                        },
                                        {
                                            label: 'New Lead',
                                            icon: 'pi pi-fw pi-plus',
                                            routerLink: ['/business/crm/leads/new']
                                        },
                                        {
                                            label: 'My Leads',
                                            icon: 'pi pi-fw pi-user',
                                            routerLink: ['/business/crm/leads/my']
                                        },
                                        {
                                            label: 'Lead Activities',
                                            icon: 'pi pi-fw pi-calendar',
                                            routerLink: ['/business/crm/activities']
                                        }
                                    ]
                                },

                                {
                                    label: 'Opportunities',
                                    icon: 'pi pi-fw pi-briefcase',
                                    items: [
                                        {
                                            label: 'Pipeline',
                                            icon: 'pi pi-fw pi-chart-line',
                                            routerLink: ['/business/crm/dashboard']
                                        },
                                        {
                                            label: 'All Opportunities',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/crm/opportunities']
                                        },
                                        {
                                            label: 'New Opportunity',
                                            icon: 'pi pi-fw pi-plus',
                                            routerLink: ['/business/crm/opportunities/create']
                                        }
                                    ]
                                },

                                {
                                    label: 'Lease Requirements',
                                    icon: 'pi pi-fw pi-file-edit',
                                    items: [
                                        {
                                            label: 'All Requirements',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/crm/leaseRequirements']
                                        },
                                        {
                                            label: 'New Requirement',
                                            icon: 'pi pi-fw pi-plus',
                                            routerLink: ['/business/crm/leaseRequirements/create']
                                        },
                                        {
                                            label: 'Requirement Assets',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/crm/leaseRequirementAssets']
                                        },
                                        {
                                            label: 'New Requirement Asset',
                                            icon: 'pi pi-fw pi-plus',
                                            routerLink: ['/business/crm/leaseRequirementAssets/create']
                                        }
                                    ]
                                },

                                {
                                    label: 'Quotes',
                                    icon: 'pi pi-fw pi-file',
                                    items: [
                                        {
                                            label: 'All Quotes',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/origination/quotes']
                                        },
                                        {
                                            label: 'Quotes for Approval',
                                            icon: 'pi pi-fw pi-check-square',
                                            routerLink: ['/business/origination/credit/approvals']
                                        },
                                        {
                                            label: 'Issued Quotes',
                                            icon: 'pi pi-fw pi-send',
                                            routerLink: ['/business/origination/quotes']
                                        },
                                        {
                                            label: 'Quote Assets',
                                            icon: 'pi pi-fw pi-box',
                                            routerLink: ['/business/origination/quotes/assets']
                                        }
                                    ]
                                },

                                {
                                    label: 'Security Deposits',
                                    icon: 'pi pi-fw pi-shield',
                                    routerLink: ['/contracts/deposits']
                                },

                                {
                                    label: 'Credit',
                                    icon: 'pi pi-fw pi-credit-card',
                                    items: [
                                        {
                                            label: 'Credit Applications',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/origination/credit/applications']
                                        },
                                        {
                                            label: 'Credit Review',
                                            icon: 'pi pi-fw pi-search',
                                            routerLink: ['/business/origination/credit/review']
                                        },
                                        {
                                            label: 'Credit Assessment',
                                            icon: 'pi pi-fw pi-file-check',
                                            routerLink: ['/business/origination/credit/assessment']
                                        },
                                        {
                                            label: 'Credit Approvals',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/business/origination/credit/approvals']
                                        },
                                        {
                                            label: 'Credit Limits',
                                            icon: 'pi pi-fw pi-wallet',
                                            routerLink: ['/business/origination/credit/limits']
                                        },
                                        {
                                            label: 'Credit Conditions',
                                            icon: 'pi pi-fw pi-list-check',
                                            routerLink: ['/business/origination/credit/Conditions']
                                        },
                                        {
                                            label: 'Credit Decisions',
                                            icon: 'pi pi-fw pi-check-square',
                                            routerLink: ['/business/origination/credit/decision']
                                        }
                                    ]
                                },

                                {
                                    label: 'Approvals',
                                    icon: 'pi pi-fw pi-verified',
                                    routerLink: ['/business/origination/approvals']
                                },

                                {
                                    label: 'Contract Handoffs',
                                    icon: 'pi pi-fw pi-arrow-right-arrow-left',
                                    routerLink: ['/business/origination/handoffs']
                                },

                                {
                                    separator: true
                                },

                                {
                                    label: 'Configuration',
                                    icon: 'pi pi-fw pi-cog',
                                    items: [
                                        {
                                            label: 'Lead Sources',
                                            routerLink: ['/business/crm/config/lead-sources']
                                        },
                                        {
                                            label: 'Lead Statuses',
                                            routerLink: ['/business/crm/config/lead-statuses']
                                        },
                                        {
                                            label: 'Opportunity Stages',
                                            routerLink: ['/business/crm/config/opportunity-stages']
                                        },
                                        {
                                            label: 'Quote Statuses',
                                            routerLink: ['/business/origination/config/quote-statuses']
                                        },
                                        {
                                            label: 'Credit Statuses',
                                            routerLink: ['/business/origination/config/credit-statuses']
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            label: 'Assets',
                            icon: 'pi pi-fw pi-box',
                            items: [
                                {
                                    label: 'Asset Dashboard',
                                    icon: 'pi pi-fw pi-chart-bar',
                                    routerLink: ['/business/assets/dashboard'],
                                    tooltip: 'See your fleet/ actions and costs here'
                                },
                                {
                                    label: 'Asset Worklist',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/business/assets']
                                },
                                {
                                    label: 'Create Asset',
                                    icon: 'pi pi-fw pi-plus-circle',
                                    routerLink: ['/business/assets/create']
                                },
                                {
                                    label: 'Classification',
                                    icon: 'pi pi-fw pi-sitemap',
                                    items: [
                                        {
                                            label: 'Asset Categories',
                                            routerLink: ['/business/assets/classification/categories']
                                        },
                                        {
                                            label: 'Asset Types',
                                            routerLink: ['/business/assets/classification/types']
                                        },
                                        {
                                            label: 'Asset Makes',
                                            routerLink: ['/business/assets/classification/makes']
                                        },
                                        {
                                            label: 'Models & Variants',
                                            routerLink: ['/business/assets/classification/models']
                                        },
                                        {
                                            label: 'Asset identifiers',
                                            routerLink: ['/business/assets/classification/identifiers']
                                        },

                                        {
                                            label: 'Attribute Definitions',
                                            items: [
                                                {
                                                    label: 'Asset Attribute Definitions',
                                                    routerLink: ['/business/assets/classification/attribute-definitions']
                                                },
                                                {
                                                    label: 'Asset Attribute Options',
                                                    routerLink: ['/business/assets/classification/attribute-options']
                                                },
                                                {
                                                    label: 'Asset Attribute Values',
                                                    routerLink: ['/business/assets/classification/attribute-values']
                                                },
                                                {
                                                    label: 'Asset Statuses',
                                                    routerLink: ['/business/assets/classification/statuses']
                                                },
                                                {
                                                    label: 'Asset Status History',
                                                    routerLink: ['/business/assets/status-history']
                                                },
                                                {
                                                    label: 'Asset Condition Grades',
                                                    routerLink: ['/business/assets/condition-grades']
                                                },
                                                {
                                                    label: 'Asset Ownership History',
                                                    routerLink: ['/business/assets/ownership-history']
                                                },
                                                {
                                                    label: 'Asset Location History',
                                                    routerLink: ['/business/assets/location-history']
                                                }
                                            ]
                                        },

                                        {
                                            label: 'Attribute Options',
                                            routerLink: ['/business/assets/classification/attribute-options']
                                        }
                                    ]
                                },
                                {
                                    label: 'Assignments & Custody',
                                    icon: 'pi pi-fw pi-users',
                                    items: [
                                        {
                                            label: 'Current Assignments',
                                            routerLink: ['/business/assets/assignments']
                                        },
                                        {
                                            label: 'Assign Asset',
                                            routerLink: ['/business/assets/assignments/create']
                                        },
                                        {
                                            label: 'Transfer Custody',
                                            routerLink: ['/business/assets/assignments/transfer']
                                        },
                                        {
                                            label: 'Assignment History',
                                            routerLink: ['/business/assets/assignments/history']
                                        }
                                    ]
                                },
                                {
                                    label: 'Locations & Movements',
                                    icon: 'pi pi-fw pi-map-marker',
                                    items: [
                                        {
                                            label: 'Current Locations',
                                            routerLink: ['/business/assets/locations']
                                        },
                                        {
                                            label: 'Move Asset',
                                            routerLink: ['/business/assets/movements/create']
                                        },
                                        {
                                            label: 'Branch Transfers',
                                            routerLink: ['/business/assets/movements/transfers']
                                        },
                                        {
                                            label: 'Movement History',
                                            routerLink: ['/business/assets/location-history']
                                        }
                                    ]
                                },
                                {
                                    label: 'Measures & Readings',
                                    icon: 'pi pi-fw pi-chart-line',
                                    items: [
                                        {
                                            label: 'Measure Definitions',
                                            routerLink: ['/business/assets/measures/definitions']
                                        },
                                        {
                                            label: 'Record Reading',
                                            routerLink: ['/business/assets/measures/readings/create']
                                        },
                                        {
                                            label: 'Reading History',
                                            routerLink: ['/business/assets/measures/readings']
                                        }
                                    ]
                                },
                                {
                                    label: 'Inspections',
                                    icon: 'pi pi-fw pi-check-square',
                                    items: [
                                        {
                                            label: 'Inspection Worklist',
                                            routerLink: ['/business/assets/inspections']
                                        },
                                        {
                                            label: 'Create Inspection',
                                            routerLink: ['/business/assets/inspections/create']
                                        },
                                        {
                                            label: 'Condition Grades',
                                            routerLink: ['/business/assets/condition-grades']
                                        }
                                    ]
                                },
                                {
                                    label: 'Compliance',
                                    icon: 'pi pi-fw pi-verified',
                                    items: [
                                        {
                                            label: 'Compliance Dashboard',
                                            routerLink: ['/business/assets/compliance']
                                        },
                                        {
                                            label: 'Compliance Types',
                                            routerLink: ['/business/assets/compliance/types']
                                        },
                                        {
                                            label: 'Certificates & Permits',
                                            routerLink: ['/business/assets/compliance/records']
                                        },
                                        {
                                            label: 'Expiry Worklist',
                                            routerLink: ['/business/assets/compliance/expiring']
                                        }
                                    ]
                                },
                                {
                                    label: 'Documents',
                                    icon: 'pi pi-fw pi-folder',
                                    routerLink: ['/business/assets/documents']
                                },
                                {
                                    label: 'Valuations',
                                    icon: 'pi pi-fw pi-chart-line',
                                    routerLink: ['/business/assets/valuations']
                                },
                                {
                                    label: 'Warranty & Insurance',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        {
                                            label: 'Warranties',
                                            routerLink: ['/business/assets/warranties']
                                        },
                                        {
                                            label: 'Insurance',
                                            routerLink: ['/business/assets/insurance']
                                        }
                                    ]
                                },
                                {
                                    label: 'Lifecycle History',
                                    icon: 'pi pi-fw pi-history',
                                    routerLink: ['/business/assets/lifecycle']
                                }
                            ]
                        },
                        {
                            label: 'Procurement',
                            icon: 'pi pi-fw pi-shopping-cart',
                            items: [

                                // =========================================================
                                // PROCUREMENT OVERVIEW
                                // =========================================================
                                {
                                    label: 'Procurement Dashboard',
                                    icon: 'pi pi-fw pi-chart-bar',
                                    routerLink: ['/business/procurement/dashboard']
                                },
                                {
                                    label: 'My Worklist',
                                    icon: 'pi pi-fw pi-inbox',
                                    routerLink: ['/business/procurement/worklist']
                                },

                                // =========================================================
                                // SUPPLIERS
                                // =========================================================
                                {
                                    label: 'Suppliers',
                                    icon: 'pi pi-fw pi-building',
                                    items: [
                                        {
                                            label: 'Supplier List',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/suppliers']
                                        },
                                        {
                                            label: 'Supplier Qualification',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/business/procurement/suppliers/qualification']
                                        },
                                        {
                                            label: 'Supplier Service Areas',
                                            icon: 'pi pi-fw pi-map',
                                            routerLink: ['/business/procurement/suppliers/service-areas']
                                        }
                                    ]
                                },

                                // =========================================================
                                // PURCHASE REQUISITIONS
                                // =========================================================
                                {
                                    label: 'Purchase Requisitions',
                                    icon: 'pi pi-fw pi-file-edit',
                                    items: [
                                        {
                                            label: 'All Requisitions',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/requisitions']
                                        },
                                        {
                                            label: 'Create Requisition',
                                            icon: 'pi pi-fw pi-plus',
                                            routerLink: ['/business/procurement/requisitions/new']
                                        },
                                        {
                                            label: 'Pending Approval',
                                            icon: 'pi pi-fw pi-clock',
                                            routerLink: ['/business/procurement/requisitions/pending-approval']
                                        }
                                    ]
                                },

                                // =========================================================
                                // SOURCING / RFQ
                                // =========================================================
                                {
                                    label: 'Sourcing & RFQ',
                                    icon: 'pi pi-fw pi-send',
                                    items: [
                                        {
                                            label: 'RFQs',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/rfqs']
                                        },
                                        {
                                            label: 'Create RFQ',
                                            icon: 'pi pi-fw pi-plus',
                                            routerLink: ['/business/procurement/rfqs/new']
                                        },
                                        {
                                            label: 'Supplier Quotations',
                                            icon: 'pi pi-fw pi-comments',
                                            routerLink: ['/business/procurement/supplier-quotations']
                                        },
                                        {
                                            label: 'Quotation Comparison',
                                            icon: 'pi pi-fw pi-table',
                                            routerLink: ['/business/procurement/quotation-comparison']
                                        },
                                        {
                                            label: 'Supplier Awards',
                                            icon: 'pi pi-fw pi-trophy',
                                            routerLink: ['/business/procurement/awards']
                                        }
                                    ]
                                },

                                // =========================================================
                                // PURCHASE ORDERS
                                // =========================================================
                                {
                                    label: 'Purchase Orders',
                                    icon: 'pi pi-fw pi-shopping-bag',
                                    items: [
                                        {
                                            label: 'All Purchase Orders',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/purchase-orders']
                                        },
                                        {
                                            label: 'Create Purchase Order',
                                            icon: 'pi pi-fw pi-plus',
                                            routerLink: ['/business/procurement/purchase-orders/new']
                                        },
                                        {
                                            label: 'Pending Approval',
                                            icon: 'pi pi-fw pi-clock',
                                            routerLink: ['/business/procurement/purchase-orders/pending-approval']
                                        },
                                        {
                                            label: 'Supplier Acknowledgements',
                                            icon: 'pi pi-fw pi-check-square',
                                            routerLink: ['/business/procurement/purchase-orders/acknowledgements']
                                        },
                                        {
                                            label: 'PO Amendments',
                                            icon: 'pi pi-fw pi-history',
                                            routerLink: ['/business/procurement/purchase-orders/amendments']
                                        }
                                    ]
                                },

                                // =========================================================
                                // RECEIPTS & INSPECTION
                                // =========================================================
                                {
                                    label: 'Receipts & Inspection',
                                    icon: 'pi pi-fw pi-box',
                                    items: [
                                        {
                                            label: 'Goods Receipts',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/goods-receipts']
                                        },
                                        {
                                            label: 'Receive Goods',
                                            icon: 'pi pi-fw pi-plus',
                                            routerLink: ['/business/procurement/goods-receipts/new']
                                        },
                                        {
                                            label: 'Goods Receipt Serials',
                                            icon: 'pi pi-fw pi-barcode',
                                            routerLink: ['/business/procurement/goods-receipts/serials']
                                        },
                                        {
                                            label: 'Service Receipts',
                                            icon: 'pi pi-fw pi-wrench',
                                            routerLink: ['/business/procurement/service-receipts']
                                        },
                                        {
                                            label: 'Pending Inspection',
                                            icon: 'pi pi-fw pi-search',
                                            routerLink: ['/business/procurement/inspections']
                                        },
                                        {
                                            label: 'Rejected / Returned',
                                            icon: 'pi pi-fw pi-times-circle',
                                            routerLink: ['/business/procurement/receipts/rejected']
                                        }
                                    ]
                                },

                                // =========================================================
                                // ASSET ACQUISITION
                                // =========================================================
                                {
                                    label: 'Asset Acquisition',
                                    icon: 'pi pi-fw pi-desktop',
                                    items: [
                                        {
                                            label: 'Pending Asset Creation',
                                            icon: 'pi pi-fw pi-hourglass',
                                            routerLink: ['/business/procurement/asset-acquisition/pending']
                                        },
                                        {
                                            label: 'Acquisition Handoffs',
                                            icon: 'pi pi-fw pi-arrow-right-arrow-left',
                                            routerLink: ['/business/procurement/asset-acquisition/handoffs']
                                        }
                                    ]
                                },

                                // =========================================================
                                // SUPPLIER INVOICES & MATCHING
                                // =========================================================
                                {
                                    label: 'Supplier Invoices',
                                    icon: 'pi pi-fw pi-receipt',
                                    items: [
                                        {
                                            label: 'All Supplier Invoices',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/supplier-invoices']
                                        },
                                        {
                                            label: 'Capture Invoice',
                                            icon: 'pi pi-fw pi-plus',
                                            routerLink: ['/business/procurement/supplier-invoices/new']
                                        },
                                        {
                                            label: 'Invoice Matching',
                                            icon: 'pi pi-fw pi-check-square',
                                            routerLink: ['/business/procurement/invoice-matching']
                                        },
                                        {
                                            label: 'Match Exceptions',
                                            icon: 'pi pi-fw pi-exclamation-triangle',
                                            routerLink: ['/business/procurement/invoice-matching/exceptions']
                                        },
                                        {
                                            label: 'Ready for AP',
                                            icon: 'pi pi-fw pi-forward',
                                            routerLink: ['/business/procurement/supplier-invoices/ap-handoff']
                                        }
                                    ]
                                },

                                // =========================================================
                                // APPROVALS
                                // =========================================================
                                {
                                    label: 'Approvals',
                                    icon: 'pi pi-fw pi-verified',
                                    items: [
                                        {
                                            label: 'My Pending Approvals',
                                            icon: 'pi pi-fw pi-clock',
                                            routerLink: ['/business/procurement/approvals/pending']
                                        },
                                        {
                                            label: 'Approval History',
                                            icon: 'pi pi-fw pi-history',
                                            routerLink: ['/business/procurement/approvals/history']
                                        }
                                    ]
                                },

                                // =========================================================
                                // REPORTS
                                // =========================================================
                                {
                                    label: 'Reports',
                                    icon: 'pi pi-fw pi-chart-line',
                                    items: [
                                        {
                                            label: 'Procurement Spend',
                                            icon: 'pi pi-fw pi-chart-bar',
                                            routerLink: ['/business/procurement/reports/spend']
                                        },
                                        {
                                            label: 'Supplier Performance',
                                            icon: 'pi pi-fw pi-chart-line',
                                            routerLink: ['/business/procurement/reports/supplier-performance']
                                        },
                                        {
                                            label: 'Open Requisitions',
                                            icon: 'pi pi-fw pi-file',
                                            routerLink: ['/business/procurement/reports/open-requisitions']
                                        },
                                        {
                                            label: 'Open Purchase Orders',
                                            icon: 'pi pi-fw pi-shopping-cart',
                                            routerLink: ['/business/procurement/reports/open-pos']
                                        },
                                        {
                                            label: 'Receipt Exceptions',
                                            icon: 'pi pi-fw pi-exclamation-circle',
                                            routerLink: ['/business/procurement/reports/receipt-exceptions']
                                        },
                                        {
                                            label: 'Invoice Match Exceptions',
                                            icon: 'pi pi-fw pi-exclamation-triangle',
                                            routerLink: ['/business/procurement/reports/match-exceptions']
                                        }
                                    ]
                                },

                                // =========================================================
                                // CONFIGURATION
                                // =========================================================
                                {
                                    label: 'Configuration',
                                    icon: 'pi pi-fw pi-cog',
                                    items: [
                                        {
                                            label: 'Requisition Statuses',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/config/requisition-statuses']
                                        },
                                        {
                                            label: 'RFQ Statuses',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/config/rfq-statuses']
                                        },
                                        {
                                            label: 'PO Statuses',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/config/po-statuses']
                                        },
                                        {
                                            label: 'Receipt Statuses',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/config/receipt-statuses']
                                        },
                                        {
                                            label: 'Invoice Match Statuses',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/business/procurement/config/invoice-match-statuses']
                                        },
                                        {
                                            label: 'Procurement Policies',
                                            icon: 'pi pi-fw pi-sliders-h',
                                            routerLink: ['/business/procurement/config/policies']
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            label: 'Lease Contracts',
                            icon: 'pi pi-file-edit',
                            items: [
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-chart-bar',
                                    routerLink: ['/contracts/dashboard']
                                },
                                {
                                    label: 'All Contracts',
                                    icon: 'pi pi-list',
                                    routerLink: ['/contracts']
                                },
                                {
                                    label: 'Create Contract',
                                    icon: 'pi pi-plus-circle',
                                    routerLink: ['/contracts/create']
                                },
                                {
                                    label: 'By Status',
                                    icon: 'pi pi-briefcase',
                                    items: [
                                        {
                                            label: 'Draft Contracts',
                                            icon: 'pi pi-pencil',
                                            routerLink: ['/contracts/drafts']
                                        },
                                        {
                                            label: 'Pending Approval',
                                            icon: 'pi pi-clock',
                                            routerLink: ['/contracts/pending-approval']
                                        },
                                        {
                                            label: 'Pending Execution',
                                            icon: 'pi pi-file-signature',
                                            routerLink: ['/contracts/pending-execution']
                                        },
                                        {
                                            label: 'Pending Activation',
                                            icon: 'pi pi-play-circle',
                                            routerLink: ['/contracts/pending-activation']
                                        },
                                        {
                                            label: 'Active Contracts',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['/contracts/active']
                                        }
                                    ]
                                },
                                {
                                    label: 'Approvals',
                                    icon: 'pi pi-check-circle',
                                    items: [
                                        {
                                            label: 'My Approvals',
                                            icon: 'pi pi-inbox',
                                            routerLink: ['/contracts/approvals/my-queue']
                                        },
                                        {
                                            label: 'Contract Approvals',
                                            icon: 'pi pi-file-check',
                                            routerLink: ['/contracts/approvals/contracts']
                                        },
                                        {
                                            label: 'Approval Actions',
                                            icon: 'pi pi-check',
                                            routerLink: ['/contracts/approvals/actions']
                                        },
                                        {
                                            label: 'Amendment Approvals',
                                            icon: 'pi pi-pencil',
                                            routerLink: ['/contracts/approvals/amendments']
                                        },
                                        {
                                            label: 'Termination Approvals',
                                            icon: 'pi pi-times-circle',
                                            routerLink: ['/contracts/approvals/terminations']
                                        },
                                        {
                                            label: 'Waiver Approvals',
                                            icon: 'pi pi-exclamation-triangle',
                                            routerLink: ['/contracts/approvals/waivers']
                                        },
                                        {
                                            label: 'Approval History',
                                            icon: 'pi pi-history',
                                            routerLink: ['/contracts/approvals/history']
                                        }
                                    ]
                                },
                                {
                                    label: 'Contract Details',
                                    icon: 'pi pi-sliders-h',
                                    items: [
                                        {
                                            label: 'Parties',
                                            icon: 'pi pi-users',
                                            routerLink: ['/contracts/parties']
                                        },
                                        {
                                            label: 'Commercial Terms',
                                            icon: 'pi pi-percentage',
                                            routerLink: ['/contracts/terms']
                                        },
                                        {
                                            label: 'Charges & Fees',
                                            icon: 'pi pi-wallet',
                                            routerLink: ['/contracts/charges']
                                        },
                                        {
                                            label: 'Security Deposits',
                                            icon: 'pi pi-shield',
                                            routerLink: ['/contracts/deposits']
                                        },
                                        {
                                            label: 'Payment Schedules',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/contracts/payment-schedules']
                                        },
                                        {
                                            label: 'Scheduled Payments',
                                            icon: 'pi pi-list',
                                            routerLink: ['/contracts/payment-schedules/lines']
                                        },
                                        {
                                            label: 'Conditions',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/contracts/conditions']
                                        },
                                        {
                                            label: 'Contract Obligations',
                                            icon: 'pi pi-clipboard',
                                            routerLink: ['/contracts/obligations']
                                        }
                                    ]
                                },
                                {
                                    label: 'Assets',
                                    icon: 'pi pi-box',
                                    items: [
                                        {
                                            label: 'All Contract Assets',
                                            icon: 'pi pi-box',
                                            routerLink: ['/contracts/assets']
                                        },
                                        {
                                            label: 'Pending Allocation',
                                            icon: 'pi pi-clock',
                                            routerLink: ['/contracts/assets/pending-allocation']
                                        },
                                        {
                                            label: 'Allocated Assets',
                                            icon: 'pi pi-link',
                                            routerLink: ['/contracts/assets/allocated']
                                        },
                                        {
                                            label: 'Asset Replacement',
                                            icon: 'pi pi-sync',
                                            routerLink: ['/contracts/assets/replacement']
                                        },
                                        {
                                            label: 'Allocation History',
                                            icon: 'pi pi-history',
                                            routerLink: ['/contracts/assets/history']
                                        },
                                        {
                                            label: 'Asset Release',
                                            icon: 'pi pi-sign-out',
                                            routerLink: ['/contracts/assets/release']
                                        }
                                    ]
                                },
                                {
                                    label: 'Documents & Signing',
                                    icon: 'pi pi-file',
                                    items: [
                                        {
                                            label: 'Document Packs',
                                            icon: 'pi pi-folder',
                                            routerLink: ['/contracts/document-packs']
                                        },
                                        {
                                            label: 'Contract Documents',
                                            icon: 'pi pi-file-pdf',
                                            routerLink: ['/contracts/documents']
                                        },
                                        {
                                            label: 'Generate Agreement',
                                            icon: 'pi pi-file-export',
                                            routerLink: ['/contracts/documents/generate']
                                        },
                                        {
                                            label: 'Send for Signature',
                                            icon: 'pi pi-send',
                                            routerLink: ['/contracts/execution/send']
                                        },
                                        {
                                            label: 'Execution Tracker',
                                            icon: 'pi pi-file-signature',
                                            routerLink: ['/contracts/execution']
                                        },
                                        {
                                            label: 'Execution Parties',
                                            icon: 'pi pi-users',
                                            routerLink: ['/contracts/execution/parties']
                                        },
                                        {
                                            label: 'Executed Contracts',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/contracts/executed']
                                        }
                                    ]
                                },
                                {
                                    label: 'Activation & Checklist',
                                    icon: 'pi pi-verified',
                                    items: [
                                        {
                                            label: 'Conditions Checklist',
                                            icon: 'pi pi-list-check',
                                            routerLink: ['/contracts/conditions/checklist']
                                        },
                                        {
                                            label: 'Pending Conditions',
                                            icon: 'pi pi-exclamation-circle',
                                            routerLink: ['/contracts/conditions/pending']
                                        },
                                        {
                                            label: 'Condition Evidence',
                                            icon: 'pi pi-paperclip',
                                            routerLink: ['/contracts/conditions/evidence']
                                        },
                                        {
                                            label: 'Waiver Requests',
                                            icon: 'pi pi-exclamation-triangle',
                                            routerLink: ['/contracts/conditions/waivers']
                                        },
                                        {
                                            label: 'Activation Readiness',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['/contracts/activation-readiness']
                                        },
                                        {
                                            label: 'Ready for Activation',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['/contracts/activation/ready']
                                        },
                                        {
                                            label: 'Activation Exceptions',
                                            icon: 'pi pi-exclamation-circle',
                                            routerLink: ['/contracts/activation/exceptions']
                                        },
                                        {
                                            label: 'Activation History',
                                            icon: 'pi pi-history',
                                            routerLink: ['/contracts/activation/history']
                                        },
                                        {
                                            label: 'Handoff Status',
                                            icon: 'pi pi-directions-alt',
                                            routerLink: ['/contracts/handoffs']
                                        }
                                    ]
                                },
                                {
                                    label: 'Manage Contracts',
                                    icon: 'pi pi-cog',
                                    items: [
                                        {
                                            label: 'Active Contract Overview',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/contracts/in-life']
                                        },
                                        {
                                            label: 'Create Amendment',
                                            icon: 'pi pi-plus',
                                            routerLink: ['/contracts/amendments/create']
                                        },
                                        {
                                            label: 'All Amendments',
                                            icon: 'pi pi-list',
                                            routerLink: ['/contracts/amendments']
                                        },
                                        {
                                            label: 'Amendment History',
                                            icon: 'pi pi-history',
                                            routerLink: ['/contracts/amendments/history']
                                        },
                                        {
                                            label: 'Amendment Changes',
                                            icon: 'pi pi-pencil',
                                            routerLink: ['/contracts/amendments/changes']
                                        },
                                        {
                                            label: 'Suspensions',
                                            icon: 'pi pi-pause-circle',
                                            routerLink: ['/contracts/suspensions']
                                        },
                                        {
                                            label: 'Contract Obligations',
                                            icon: 'pi pi-clipboard',
                                            routerLink: ['/contracts/obligations/worklist']
                                        },
                                        {
                                            label: 'Obligation Events',
                                            icon: 'pi pi-history',
                                            routerLink: ['/contracts/obligations/events']
                                        },
                                        {
                                            label: 'Notices',
                                            icon: 'pi pi-envelope',
                                            routerLink: ['/contracts/notices']
                                        }
                                    ]
                                },
                                {
                                    label: 'Renewals & Expiry',
                                    icon: 'pi pi-replay',
                                    items: [
                                        {
                                            label: 'Expiring Contracts',
                                            icon: 'pi pi-calendar-times',
                                            routerLink: ['/contracts/maturity/upcoming']
                                        },
                                        {
                                            label: 'Renewal Options',
                                            icon: 'pi pi-refresh',
                                            routerLink: ['/contracts/renewals']
                                        },
                                        {
                                            label: 'Extension Requests',
                                            icon: 'pi pi-calendar-plus',
                                            routerLink: ['/contracts/extensions']
                                        },
                                        {
                                            label: 'Purchase Options',
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: ['/contracts/purchase-options']
                                        },
                                        {
                                            label: 'Returns Due',
                                            icon: 'pi pi-undo',
                                            routerLink: ['/contracts/asset-return/due']
                                        }
                                    ]
                                },
                                {
                                    label: 'End a Contract',
                                    icon: 'pi pi-times-circle',
                                    items: [
                                        {
                                            label: 'Termination Requests',
                                            icon: 'pi pi-file-edit',
                                            routerLink: ['/contracts/terminations']
                                        },
                                        {
                                            label: 'Early Terminations',
                                            icon: 'pi pi-fast-forward',
                                            routerLink: ['/contracts/terminations/early']
                                        },
                                        {
                                            label: 'Termination Charges',
                                            icon: 'pi pi-money-bill',
                                            routerLink: ['/contracts/terminations/charges']
                                        },
                                        {
                                            label: 'Asset Return Instructions',
                                            icon: 'pi pi-reply',
                                            routerLink: ['/contracts/asset-return']
                                        },
                                        {
                                            label: 'Pending Closure',
                                            icon: 'pi pi-lock-open',
                                            routerLink: ['/contracts/closure/pending']
                                        },
                                        {
                                            label: 'Closed Contracts',
                                            icon: 'pi pi-lock',
                                            routerLink: ['/contracts/closed']
                                        }
                                    ]
                                },
                                {
                                    label: 'Activity & Audit',
                                    icon: 'pi pi-search',
                                    items: [
                                        {
                                            label: 'Contract Events',
                                            icon: 'pi pi-history',
                                            routerLink: ['/contracts/events']
                                        },
                                        {
                                            label: 'Handoff Monitor',
                                            icon: 'pi pi-share-alt',
                                            routerLink: ['/contracts/handoffs/monitor']
                                        },
                                        {
                                            label: 'Failed Handoffs',
                                            icon: 'pi pi-exclamation-triangle',
                                            routerLink: ['/contracts/handoffs/failed']
                                        },
                                        {
                                            label: 'External References',
                                            icon: 'pi pi-external-link',
                                            routerLink: ['/contracts/external-references']
                                        },
                                        {
                                            label: 'Contract Audit Trail',
                                            icon: 'pi pi-history',
                                            routerLink: ['/contracts/audit']
                                        }
                                    ]
                                },
                                {
                                    label: 'Settings',
                                    icon: 'pi pi-cog',
                                    items: [
                                        {
                                            label: 'Contract Statuses',
                                            icon: 'pi pi-list',
                                            routerLink: ['/contracts/config/statuses']
                                        },
                                        {
                                            label: 'Contract Numbering',
                                            icon: 'pi pi-sort-numeric-up',
                                            routerLink: ['/contracts/config/numbering']
                                        },
                                        {
                                            label: 'Contract Templates',
                                            icon: 'pi pi-file',
                                            routerLink: ['/contracts/config/templates']
                                        },
                                        {
                                            label: 'Condition Types',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/contracts/config/condition-types']
                                        },
                                        {
                                            label: 'Charge Types',
                                            icon: 'pi pi-wallet',
                                            routerLink: ['/contracts/config/charge-types']
                                        },
                                        {
                                            label: 'Lease Types',
                                            icon: 'pi pi-tags',
                                            routerLink: ['/contracts/config/lease-types']
                                        },
                                        {
                                            label: 'Payment Frequencies',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/contracts/config/payment-frequency']
                                        },
                                        {
                                            label: 'Termination Reasons',
                                            icon: 'pi pi-times',
                                            routerLink: ['/contracts/config/termination-reasons']
                                        },
                                        {
                                            label: 'Approval Rules',
                                            icon: 'pi pi-sitemap',
                                            routerLink: ['/contracts/config/approval-rules']
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            label: 'Billing & Finance',
                            icon: 'pi pi-fw pi-wallet',
                            items: [
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-fw pi-chart-bar',
                                    routerLink: ['/billing-finance/dashboard']
                                },
                                {
                                    label: 'Billing',
                                    icon: 'pi pi-fw pi-calendar',
                                    items: [
                                        {
                                            label: 'Billing Workbench',
                                            icon: 'pi pi-fw pi-desktop',
                                            routerLink: ['/billing-finance/billing/workbench']
                                        },
                                        {
                                            label: 'Billing Runs',
                                            icon: 'pi pi-fw pi-play-circle',
                                            routerLink: ['/billing-finance/billing/runs']
                                        },
                                        {
                                            label: 'Billing Candidates',
                                            icon: 'pi pi-fw pi-list-check',
                                            routerLink: ['/billing-finance/billing/candidates']
                                        },
                                        {
                                            label: 'Billing Exceptions',
                                            icon: 'pi pi-fw pi-exclamation-triangle',
                                            routerLink: ['/billing-finance/billing/exceptions']
                                        },
                                        {
                                            label: 'Billing History',
                                            icon: 'pi pi-fw pi-history',
                                            routerLink: ['/billing-finance/billing/history']
                                        }
                                    ]
                                },
                                {
                                    label: 'Invoices',
                                    icon: 'pi pi-fw pi-file',
                                    items: [
                                        {
                                            label: 'Customer Invoices',
                                            icon: 'pi pi-fw pi-file',
                                            routerLink: ['/billing-finance/invoices']
                                        },
                                        {
                                            label: 'Invoice Lines',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/billing-finance/invoices/lines']
                                        },
                                        {
                                            label: 'Invoice Taxes',
                                            icon: 'pi pi-fw pi-percentage',
                                            routerLink: ['/billing-finance/invoices/taxes']
                                        },
                                        {
                                            label: 'Draft Invoices',
                                            icon: 'pi pi-fw pi-pencil',
                                            routerLink: ['/billing-finance/invoices/drafts']
                                        },
                                        {
                                            label: 'Pending Approval',
                                            icon: 'pi pi-fw pi-clock',
                                            routerLink: ['/billing-finance/invoices/pending-approval']
                                        },
                                        {
                                            label: 'Issued Invoices',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/billing-finance/invoices/issued']
                                        },
                                        {
                                            label: 'Credit Notes',
                                            icon: 'pi pi-fw pi-minus-circle',
                                            routerLink: ['/billing-finance/credit-notes']
                                        },
                                        {
                                            label: 'Credit Note Lines',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/billing-finance/credit-notes/lines']
                                        },
                                        {
                                            label: 'Debit Notes',
                                            icon: 'pi pi-fw pi-plus-circle',
                                            routerLink: ['/billing-finance/debit-notes']
                                        },
                                        {
                                            label: 'Debit Note Lines',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/billing-finance/debit-notes/lines']
                                        }
                                    ]
                                },
                                {
                                    label: 'Receivables',
                                    icon: 'pi pi-fw pi-money-bill',
                                    items: [
                                        {
                                            label: 'Accounts Receivable',
                                            icon: 'pi pi-fw pi-wallet',
                                            routerLink: ['/billing-finance/receivables']
                                        },
                                        {
                                            label: 'Open Items',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/billing-finance/receivables/open']
                                        },
                                        {
                                            label: 'Overdue Receivables',
                                            icon: 'pi pi-fw pi-exclamation-circle',
                                            routerLink: ['/billing-finance/receivables/overdue']
                                        },
                                        {
                                            label: 'Ageing Analysis',
                                            icon: 'pi pi-fw pi-chart-bar',
                                            routerLink: ['/billing-finance/receivables/ageing']
                                        },
                                        {
                                            label: 'Disputed / On Hold',
                                            icon: 'pi pi-fw pi-pause-circle',
                                            routerLink: ['/billing-finance/receivables/disputed']
                                        },
                                        {
                                            label: 'Customer Statements',
                                            icon: 'pi pi-fw pi-file-export',
                                            routerLink: ['/billing-finance/customer-statements']
                                        }
                                    ]
                                },
                                {
                                    label: 'Payments & Receipts',
                                    icon: 'pi pi-fw pi-credit-card',
                                    items: [
                                        {
                                            label: 'Payment Receipts',
                                            icon: 'pi pi-fw pi-money-bill',
                                            routerLink: ['/billing-finance/payments/receipts']
                                        },
                                        {
                                            label: 'Unapplied Receipts',
                                            icon: 'pi pi-fw pi-question-circle',
                                            routerLink: ['/billing-finance/payments/unapplied']
                                        },
                                        {
                                            label: 'Payment Allocation',
                                            icon: 'pi pi-fw pi-share-alt',
                                            routerLink: ['/billing-finance/payments/allocation']
                                        },
                                        {
                                            label: 'Allocation History',
                                            icon: 'pi pi-fw pi-history',
                                            routerLink: ['/billing-finance/payments/allocation-history']
                                        },
                                        {
                                            label: 'Reversed Receipts',
                                            icon: 'pi pi-fw pi-undo',
                                            routerLink: ['/billing-finance/payments/reversed']
                                        }
                                    ]
                                },
                                {
                                    label: 'Deposits',
                                    icon: 'pi pi-fw pi-inbox',
                                    items: [
                                        {
                                            label: 'Customer Deposits',
                                            icon: 'pi pi-fw pi-wallet',
                                            routerLink: ['/billing-finance/deposits']
                                        },
                                        {
                                            label: 'Deposit Transactions',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/billing-finance/deposits/transactions']
                                        },
                                        {
                                            label: 'Deposit Utilization',
                                            icon: 'pi pi-fw pi-arrow-right',
                                            routerLink: ['/billing-finance/deposits/utilization']
                                        },
                                        {
                                            label: 'Deposit Refunds',
                                            icon: 'pi pi-fw pi-replay',
                                            routerLink: ['/billing-finance/deposits/refunds']
                                        },
                                        {
                                            label: 'Deposit Forfeitures',
                                            icon: 'pi pi-fw pi-times-circle',
                                            routerLink: ['/billing-finance/deposits/forfeitures']
                                        }
                                    ]
                                },
                                {
                                    label: 'Accounting',
                                    icon: 'pi pi-fw pi-calculator',
                                    items: [
                                        {
                                            label: 'Accounting Events',
                                            icon: 'pi pi-fw pi-bolt',
                                            routerLink: ['/billing-finance/accounting/events']
                                        },
                                        {
                                            label: 'Journal Entries',
                                            icon: 'pi pi-fw pi-book',
                                            routerLink: ['/billing-finance/accounting/journals']
                                        },
                                        {
                                            label: 'Journal Entry Lines',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/billing-finance/accounting/journals/lines']
                                        },
                                        {
                                            label: 'Posting Workbench',
                                            icon: 'pi pi-fw pi-send',
                                            routerLink: ['/billing-finance/accounting/posting']
                                        },
                                        {
                                            label: 'Posting Exceptions',
                                            icon: 'pi pi-fw pi-exclamation-triangle',
                                            routerLink: ['/billing-finance/accounting/posting-exceptions']
                                        },
                                        {
                                            label: 'Posting History',
                                            icon: 'pi pi-fw pi-history',
                                            routerLink: ['/billing-finance/accounting/posting-history']
                                        }
                                    ]
                                },
                                {
                                    label: 'Bank & Reconciliation',
                                    icon: 'pi pi-fw pi-building-columns',
                                    items: [
                                        {
                                            label: 'Bank Statements',
                                            icon: 'pi pi-fw pi-file',
                                            routerLink: ['/billing-finance/bank/statements']
                                        },
                                        {
                                            label: 'Bank Transactions',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/billing-finance/bank/transactions']
                                        },
                                        {
                                            label: 'Reconciliation Workbench',
                                            icon: 'pi pi-fw pi-sync',
                                            routerLink: ['/billing-finance/reconciliation']
                                        },
                                        {
                                            label: 'Unmatched Transactions',
                                            icon: 'pi pi-fw pi-exclamation-circle',
                                            routerLink: ['/billing-finance/reconciliation/unmatched']
                                        },
                                        {
                                            label: 'Reconciliation History',
                                            icon: 'pi pi-fw pi-history',
                                            routerLink: ['/billing-finance/reconciliation/history']
                                        }
                                    ]
                                },
                                {
                                    label: 'Finance Control',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        {
                                            label: 'Finance Approvals',
                                            icon: 'pi pi-fw pi-check-square',
                                            routerLink: ['/billing-finance/control/approvals']
                                        },
                                        {
                                            label: 'Approval Actions',
                                            icon: 'pi pi-fw pi-check',
                                            routerLink: ['/billing-finance/control/approval-actions']
                                        },
                                        {
                                            label: 'Finance Exceptions',
                                            icon: 'pi pi-fw pi-exclamation-triangle',
                                            routerLink: ['/billing-finance/control/exceptions']
                                        },
                                        {
                                            label: 'Documents',
                                            icon: 'pi pi-fw pi-folder',
                                            routerLink: ['/billing-finance/control/documents']
                                        },
                                        {
                                            label: 'Finance Handoffs',
                                            icon: 'pi pi-fw pi-directions-alt',
                                            routerLink: ['/billing-finance/control/handoffs']
                                        }
                                    ]
                                },
                                {
                                    label: 'Reports',
                                    icon: 'pi pi-fw pi-chart-line',
                                    items: [
                                        {
                                            label: 'Billing Summary',
                                            icon: 'pi pi-fw pi-chart-bar',
                                            routerLink: ['/billing-finance/reports/billing-summary']
                                        },
                                        {
                                            label: 'Invoice Register',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/billing-finance/reports/invoice-register']
                                        },
                                        {
                                            label: 'Receivables Ageing',
                                            icon: 'pi pi-fw pi-chart-bar',
                                            routerLink: ['/billing-finance/reports/receivables-ageing']
                                        },
                                        {
                                            label: 'Collection Summary',
                                            icon: 'pi pi-fw pi-chart-line',
                                            routerLink: ['/billing-finance/reports/collection-summary']
                                        },
                                        {
                                            label: 'Deposit Register',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/billing-finance/reports/deposit-register']
                                        },
                                        {
                                            label: 'Tax Summary',
                                            icon: 'pi pi-fw pi-percentage',
                                            routerLink: ['/billing-finance/reports/tax-summary']
                                        },
                                        {
                                            label: 'Journal Register',
                                            icon: 'pi pi-fw pi-book',
                                            routerLink: ['/billing-finance/reports/journal-register']
                                        },
                                        {
                                            label: 'Reconciliation Report',
                                            icon: 'pi pi-fw pi-sync',
                                            routerLink: ['/billing-finance/reports/reconciliation']
                                        }
                                    ]
                                },
                                {
                                    label: 'Configuration',
                                    icon: 'pi pi-fw pi-cog',
                                    items: [
                                        {
                                            label: 'Billing Setup',
                                            icon: 'pi pi-fw pi-cog',
                                            routerLink: ['/billing-finance/configuration/billing']
                                        },
                                        {
                                            label: 'Billing Calendars',
                                            icon: 'pi pi-fw pi-calendar',
                                            routerLink: ['/billing-finance/configuration/calendars']
                                        },
                                        {
                                            label: 'Billing Run Statuses',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: ['/billing-finance/configuration/billing-run-statuses']
                                        },
                                        {
                                            label: 'Invoice Statuses',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: ['/billing-finance/configuration/invoice-statuses']
                                        },
                                        {
                                            label: 'Receipt Statuses',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: ['/billing-finance/configuration/receipt-statuses']
                                        },
                                        {
                                            label: 'Payment Terms',
                                            icon: 'pi pi-fw pi-calendar-clock',
                                            routerLink: ['/billing-finance/configuration/payment-terms']
                                        },
                                        {
                                            label: 'Finance Account Mapping',
                                            icon: 'pi pi-fw pi-sitemap',
                                            routerLink: ['/billing-finance/configuration/account-mapping']
                                        },
                                        {
                                            label: 'Tax Mapping',
                                            icon: 'pi pi-fw pi-percentage',
                                            routerLink: ['/billing-finance/configuration/tax-mapping']
                                        },
                                        {
                                            label: 'Numbering Rules',
                                            icon: 'pi pi-fw pi-sort-numeric-up',
                                            routerLink: ['/billing-finance/configuration/numbering']
                                        },
                                        {
                                            label: 'Approval Rules',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/billing-finance/configuration/approval-rules']
                                        },
                                        {
                                            label: 'Integration Setup',
                                            icon: 'pi pi-fw pi-link',
                                            routerLink: ['/billing-finance/configuration/integrations']
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            label: 'Maintenance & Insurance',
                            icon: 'pi pi-fw pi-wrench',
                            items: [
                                { label: 'Dashboard', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/maintenance-insurance/dashboard'] },
                                {
                                    label: 'Maintenance',
                                    icon: 'pi pi-fw pi-wrench',
                                    items: [
                                        { label: 'Requests', icon: 'pi pi-inbox', routerLink: ['/maintenance-insurance/maintenance/requests'] },
                                        { label: 'Work Orders', icon: 'pi pi-clipboard', routerLink: ['/maintenance-insurance/maintenance/work-orders'] },
                                        { label: 'Work Order Tasks', icon: 'pi pi-list-check', routerLink: ['/maintenance-insurance/maintenance/work-orders/tasks'] },
                                        { label: 'Work Order Parts', icon: 'pi pi-box', routerLink: ['/maintenance-insurance/maintenance/work-orders/parts'] },
                                        { label: 'Work Order Labour', icon: 'pi pi-users', routerLink: ['/maintenance-insurance/maintenance/work-orders/labour'] },
                                        { label: 'Work Order Services', icon: 'pi pi-cog', routerLink: ['/maintenance-insurance/maintenance/work-orders/services'] },
                                        { label: 'Maintenance Completions', icon: 'pi pi-check-circle', routerLink: ['/maintenance-insurance/maintenance/work-orders/completions'] },
                                        { label: 'Schedules', icon: 'pi pi-calendar', routerLink: ['/maintenance-insurance/maintenance/schedules'] },
                                        { label: 'Maintenance Plans', icon: 'pi pi-map', routerLink: ['/maintenance-insurance/maintenance/plans'] },
                                        { label: 'Asset Plans', icon: 'pi pi-box', routerLink: ['/maintenance-insurance/maintenance/asset-plans'] },
                                        { label: 'Service Agreements', icon: 'pi pi-file', routerLink: ['/maintenance-insurance/maintenance/service-agreements'] },
                                        { label: 'Agreement Coverage', icon: 'pi pi-shield', routerLink: ['/maintenance-insurance/maintenance/service-agreements/coverage'] },
                                        { label: 'Downtime & History', icon: 'pi pi-history', routerLink: ['/maintenance-insurance/maintenance/history'] },
                                        { label: 'Maintenance Exceptions', icon: 'pi pi-exclamation-triangle', routerLink: ['/maintenance-insurance/maintenance/exceptions'] },
                                        { label: 'Maintenance Types', icon: 'pi pi-tags', routerLink: ['/maintenance-insurance/maintenance/configuration/types'] }
                                    ]
                                },
                                {
                                    label: 'Insurance',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        { label: 'Policies', icon: 'pi pi-file', routerLink: ['/maintenance-insurance/insurance/policies'] },
                                        { label: 'Asset Coverage', icon: 'pi pi-box', routerLink: ['/maintenance-insurance/insurance/policies/assets'] },
                                        { label: 'Policy Endorsements', icon: 'pi pi-pencil', routerLink: ['/maintenance-insurance/insurance/policies/endorsements'] },
                                        { label: 'Renewals', icon: 'pi pi-refresh', routerLink: ['/maintenance-insurance/insurance/renewals'] },
                                        { label: 'Incidents', icon: 'pi pi-exclamation-circle', routerLink: ['/maintenance-insurance/insurance/incidents'] },
                                        { label: 'Claims', icon: 'pi pi-briefcase', routerLink: ['/maintenance-insurance/insurance/claims'] },
                                        { label: 'Claim Assessments', icon: 'pi pi-search', routerLink: ['/maintenance-insurance/insurance/claims/assessments'] },
                                        { label: 'Settlements', icon: 'pi pi-check-square', routerLink: ['/maintenance-insurance/insurance/settlements'] },
                                        { label: 'Recoveries', icon: 'pi pi-replay', routerLink: ['/maintenance-insurance/insurance/recoveries'] },
                                        { label: 'Coverage Types', icon: 'pi pi-tags', routerLink: ['/maintenance-insurance/insurance/configuration/coverage-types'] },
                                        { label: 'Policy Statuses', icon: 'pi pi-list', routerLink: ['/maintenance-insurance/insurance/configuration/policy-statuses'] },
                                        { label: 'Claim Statuses', icon: 'pi pi-list', routerLink: ['/maintenance-insurance/insurance/configuration/claim-statuses'] }
                                    ]
                                },
                                { label: 'Exceptions', icon: 'pi pi-exclamation-triangle', routerLink: ['/maintenance-insurance/exceptions'] },
                                { label: 'Documents', icon: 'pi pi-folder', routerLink: ['/maintenance-insurance/documents'] },
                                { label: 'Handoffs', icon: 'pi pi-directions-alt', routerLink: ['/maintenance-insurance/handoffs'] }
                            ]
                        },
                        {
                            label: 'End-of-Lease & Disposal',
                            icon: 'pi pi-fw pi-sign-out',
                            items: [
                                { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: ['/eol-disposal/dashboard'] },
                                {
                                    label: 'End-of-Lease Cases',
                                    icon: 'pi pi-briefcase',
                                    items: [
                                        { label: 'Case Worklist', icon: 'pi pi-list', routerLink: ['/eol-disposal/cases'] },
                                        { label: 'Upcoming Expiries', icon: 'pi pi-calendar-times', routerLink: ['/eol-disposal/upcoming'] },
                                        { label: 'Notices', icon: 'pi pi-envelope', routerLink: ['/eol-disposal/notices'] },
                                        { label: 'End-of-Lease Options', icon: 'pi pi-directions', routerLink: ['/eol-disposal/options'] }
                                    ]
                                },
                                {
                                    label: 'Returns',
                                    icon: 'pi pi-reply',
                                    items: [
                                        { label: 'Return Schedule', icon: 'pi pi-calendar', routerLink: ['/eol-disposal/returns/schedule'] },
                                        { label: 'Asset Returns', icon: 'pi pi-undo', routerLink: ['/eol-disposal/returns'] },
                                        { label: 'Return Checklists', icon: 'pi pi-list-check', routerLink: ['/eol-disposal/returns/checklists'] },
                                        { label: 'Supplier Returns', icon: 'pi pi-truck', routerLink: ['/eol-disposal/returns/supplier'] },
                                        { label: 'Return Assessments', icon: 'pi pi-search', routerLink: ['/eol-disposal/assessments'] },
                                        { label: 'Assessment Damages', icon: 'pi pi-exclamation-circle', routerLink: ['/eol-disposal/assessments/damages'] },
                                        { label: 'Excess Usage', icon: 'pi pi-chart-line', routerLink: ['/eol-disposal/assessments/excess-usage'] }
                                    ]
                                },
                                {
                                    label: 'Settlements',
                                    icon: 'pi pi-wallet',
                                    items: [
                                        { label: 'Settlement Worklist', icon: 'pi pi-list', routerLink: ['/eol-disposal/settlements'] },
                                        { label: 'Settlement Lines', icon: 'pi pi-list-check', routerLink: ['/eol-disposal/settlements/lines'] },
                                        { label: 'Acknowledgements', icon: 'pi pi-check-circle', routerLink: ['/eol-disposal/settlements/acknowledgements'] },
                                        { label: 'Purchase Options', icon: 'pi pi-shopping-cart', routerLink: ['/eol-disposal/purchase-options'] }
                                    ]
                                },
                                {
                                    label: 'Disposition',
                                    icon: 'pi pi-share-alt',
                                    items: [
                                        { label: 'Disposition Decisions', icon: 'pi pi-directions', routerLink: ['/eol-disposal/disposition/decisions'] },
                                        { label: 'Disposal Cases', icon: 'pi pi-briefcase', routerLink: ['/eol-disposal/disposition/cases'] },
                                        { label: 'Valuation References', icon: 'pi pi-chart-line', routerLink: ['/eol-disposal/disposition/valuations'] },
                                        { label: 'Offers', icon: 'pi pi-tag', routerLink: ['/eol-disposal/disposition/market/offers'] },
                                        { label: 'Bids', icon: 'pi pi-money-bill', routerLink: ['/eol-disposal/disposition/market/bids'] },
                                        { label: 'Auctions', icon: 'pi pi-megaphone', routerLink: ['/eol-disposal/disposition/market/auctions'] },
                                        { label: 'Awards', icon: 'pi pi-trophy', routerLink: ['/eol-disposal/disposition/market/awards'] },
                                        { label: 'Asset Sales', icon: 'pi pi-shopping-bag', routerLink: ['/eol-disposal/disposition/sales'] },
                                        { label: 'Asset Scrap', icon: 'pi pi-trash', routerLink: ['/eol-disposal/disposition/scrap'] },
                                        { label: 'Asset Write-Offs', icon: 'pi pi-times-circle', routerLink: ['/eol-disposal/disposition/write-offs'] },
                                        { label: 'Refurbishment Handoffs', icon: 'pi pi-sync', routerLink: ['/eol-disposal/disposition/refurbishment-handoffs'] }
                                    ]
                                },
                                {
                                    label: 'Configuration',
                                    icon: 'pi pi-cog',
                                    items: [
                                        { label: 'End-of-Lease Statuses', icon: 'pi pi-list', routerLink: ['/eol-disposal/configuration/statuses'] },
                                        { label: 'End-of-Lease Reasons', icon: 'pi pi-question-circle', routerLink: ['/eol-disposal/configuration/reasons'] },
                                        { label: 'Disposition Methods', icon: 'pi pi-tags', routerLink: ['/eol-disposal/configuration/disposition-methods'] },
                                        { label: 'Settlement Charge Types', icon: 'pi pi-wallet', routerLink: ['/eol-disposal/configuration/settlement-charge-types'] }
                                    ]
                                },
                                { label: 'Exceptions', icon: 'pi pi-exclamation-triangle', routerLink: ['/eol-disposal/exceptions'] },
                                { label: 'Documents', icon: 'pi pi-folder', routerLink: ['/eol-disposal/documents'] },
                                { label: 'Handoffs', icon: 'pi pi-directions-alt', routerLink: ['/eol-disposal/handoffs'] }
                            ]
                        },
                        {
                            label: 'Operations',
                            icon: 'pi pi-fw pi-cog',
                            items: []
                        }
                    ]
                },
                {
                    label: 'Administration',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Configurations',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'Integrations',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'Audit and Logs',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'Reports',
                            icon: 'pi pi-fw pi-address-book',
                            routerLink: ['/dashboard/customers/list/'],
                            tooltip: ''
                        }
                    ]
                }
            ];
        } else {
            this.model = [
                {
                    label: 'Dashboards',
                    icon: 'pi pi-server',
                    items: [
                        {
                            label: 'My Task',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'Approvals',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'tenants',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/tenants/'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'Subscription Plans',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/subscriptionPlans/'],
                            tooltip: 'See your fleet/ actions and costs here'
                        },
                        {
                            label: 'Customers',
                            icon: 'pi pi-fw pi-address-book',
                            routerLink: ['/dashboard/customers/list/'],
                            tooltip: ''
                        }
                    ]
                }
            ];
        }
    }
}
