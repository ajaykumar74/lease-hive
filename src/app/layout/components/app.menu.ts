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
            <li
                app-menuitem
                *ngIf="!item.separator"
                [item]="item"
                [index]="i"
                [root]="true"
            ></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `,
})
export class AppMenu {
    model: any[] = [];

    constructor(
        private loggedInUserService: LoggedInUserService
    ) { }
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
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'My Fleet',
                            icon: 'pi pi-fw pi-car',
                            routerLink: ['/dashboard/myfleet'],
                            tooltip: 'View and add vehicles for subscription here',
                        },
                        {
                            label: 'Fleet Schedule',
                            icon: 'pi pi-fw pi-calendar-clock',
                            routerLink: ['/dashboard/vehicle-schedule'],
                            tooltip: 'View fleet schedule here',
                        },
                        {
                            label: 'Fleet Scores',
                            icon: 'pi pi-fw pi-chart-line',
                            routerLink: ['/dashboard/myfleet/scores'],
                            tooltip: 'See how each vehicle is scored here + Benchmark Functionality will be deployed during BETA',
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
                            tooltip: 'Check when your vehicles are due a next service/ MOT on the calendar based on vehicle registration date and last service history',
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
                                    tooltip: 'Book service for your vehicles',
                                },
                                {
                                    label: 'Active Bookings',
                                    icon: 'pi pi-fw pi-calendar-times',
                                    routerLink: ['/dashboard/serviceBookings'],
                                    tooltip: 'Confirm/ amend current service/ MOT/ Tyre bookings or make a new online booking here with over 6,600 service/ tyre centres',
                                },
                                {
                                    label: 'Bookings History',
                                    icon: 'pi pi-fw pi-calendar-times',
                                    routerLink: ['/dashboard/serviceBookings/history'],
                                    tooltip: 'Confirm/ amend current service/ MOT/ Tyre bookings or make a new online booking here with over 6,600 service/ tyre centres',
                                },
                            ],
                        },
                        {
                            label: 'Statements',
                            icon: 'pi pi-fw pi-sort-down-fill',
                            items: [
                                {
                                    label: 'Vehicle Statement',
                                    icon: 'pi pi-fw pi-file',
                                    routerLink: ['/dashboard/Statements'],
                                    tooltip: 'View and export all spend/ statements here',
                                },
                            ],
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
                                    tooltip: '',
                                },
                                {
                                    label: 'Payments',
                                    icon: 'pi pi-fw pi-wallet',
                                    routerLink: ['/dashboard/PaymentCheckout/list'],
                                    tooltip: '',
                                }
                            ],
                        },
                    ],
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
                                    tooltip: '',
                                },

                                {
                                    label: 'Historic Invoices',
                                    icon: 'pi pi-fw pi-server',
                                    routerLink: ['/dashboard/serviceInvoices'],
                                    tooltip: 'Access all previous service invoices here',
                                },
                                {
                                    label: 'Items',
                                    icon: 'pi pi-fw pi-clipboard',
                                    routerLink: ['/dashboard/items'],
                                    tooltip: '',
                                },
                                {
                                    label: 'Account Head',
                                    icon: 'pi pi-fw pi-user',
                                    routerLink: ['/dashboard/accountHeads'],
                                    tooltip: '',
                                },
                            ],
                        },
                        {
                            label: 'Susbscription',
                            icon: 'pi pi-fw pi-pen-to-square',
                            routerLink: ['/dashboard/subscriptions'],
                            tooltip: 'View and amend subscription/ cancel subscription here',
                        },
                        {
                            label: 'Referrals',
                            icon: 'pi pi-fw pi-id-card',
                            routerLink: ['/dashboard/referrals'],
                            tooltip: 'Happy with the solution? Create an easy and simple referral here to earn monthly credits on your subscription for every successful referral',
                        }
                    ],
                },

            ];
        }
        else if (this.loggedInUserService.loggedInUser.AccountType == 'Tenant') {
            this.model = [
                {
                    label: 'Dashboards',
                    icon: 'pi pi-server',
                    items: [
                        {
                            label: 'My Task',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'Approvals',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'tenants',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/tenants/'],
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'Subscription Plans',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/subscriptionPlans/'],
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'Customers',
                            icon: 'pi pi-fw pi-address-book',
                            routerLink: ['/dashboard/customers/list/'],
                            tooltip: '',
                        }
                    ],

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
                                    routerLink: ['/business/organisations/dashboard'],
                                },
                                {
                                    label: 'Companies & legal entities',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/business/organisations'],
                                    tooltip: 'see you organisation/ legal entities here',
                                },
                                {
                                    label: 'Regions and branches',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/business/organisations/units'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Locations',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/business/organisations/locations'],
                                    tooltip: 'see your locations here',
                                },
                                {
                                    label: 'Departments',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/business/organisations/departments'],
                                    tooltip: ''
                                }, {
                                    label: 'Cost / profit centres',
                                    icon: 'pi pi-fw pi-address-book',
                                    items: [
                                        {
                                            label: 'Cost Centres',
                                            icon: 'pi pi-fw pi-address-book',
                                            routerLink: ['/business/organisations/cost-centres'],
                                            tooltip: '',
                                        },
                                        {
                                            label: 'Profit Centres',
                                            icon: 'pi pi-fw pi-address-book',
                                            routerLink: ['/business/organisations/profit-centres'],
                                            tooltip: '',
                                        }
                                    ]
                                }, {
                                    label: 'Business calendars',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/business/organisations/calendars'],
                                    tooltip: '',
                                }
                            ],
                        },
                        {
                            label: 'Party Management',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Party Dashboard',
                                    icon: 'pi pi-fw pi-chart-bar',
                                    routerLink: ['/business/parties/dashboard'],
                                },
                                {
                                    label: 'All parties',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/business/parties'],
                                },
                                {
                                    label: 'Customer profiles',
                                    icon: 'pi pi-fw pi-times-circle',
                                    routerLink: ['/business/parties/customer-profiles'],
                                },
                                {
                                    label: 'Supplier profiles',
                                    icon: 'pi pi-fw pi-lock',
                                    routerLink: ['/business/parties/supplier-profiles'],
                                },
                                {
                                    label: 'Party roles',
                                    icon: 'pi pi-fw pi-user-plus',
                                    routerLink: ['/business/parties/roles'],
                                },
                                {
                                    label: 'Party relationships',
                                    icon: 'pi pi-fw pi-question',
                                    routerLink: ['/business/parties/relationships'],
                                },
                                {
                                    label: 'Contacts and documents',
                                    icon: 'pi pi-fw pi-cog',
                                    items: [
                                        {
                                            label: 'Party contacts',
                                            icon: 'pi pi-fw pi-question',
                                            routerLink: ['/business/parties/contacts'],
                                        }
                                    ]
                                }
                            ],
                        },
                        {
                            label: 'Tax & Banking',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'GST registrations',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/business/parties/gst-registrations'],
                                    tooltip: 'see your gst registrations here',
                                },
                                {
                                    label: 'Party Locations',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/business/parties/locations'],
                                    tooltip: 'see your party locations here',
                                },
                                {
                                    label: 'Tax profiles',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/business/parties/gst-registrations'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Bank accounts',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/business/parties/bank-accounts'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Credit profiles',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/business/parties/credit-profiles'],
                                    tooltip: '',
                                }, {
                                    label: 'KYC documents',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/business/parties/documents'],
                                    tooltip: '',
                                }, {
                                    label: 'Verification status',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/business/parties/dashboard'],
                                    tooltip: '',
                                }
                            ],
                        },
                        {
                            label: 'People & Access',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Application users',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/applicationUsers/list'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Asset users',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/assetUsers/list'],
                                    tooltip: 'See your fleet/ actions and costs here',
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
                                        },

                                    ]
                                },
                                {
                                    label: 'Organisation scope',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/customers/list/'],
                                    tooltip: '',
                                }, {
                                    label: 'Approval authority',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/approvalAuthoritys/list'],
                                    tooltip: '',
                                }, {
                                    label: 'Delegation',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/userDelegations/list/'],
                                    tooltip: '',
                                }
                            ],
                        },
                        {
                            label: 'Audit & Reporting',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Audit log',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/auditLogs/list/'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Login history',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/admin/'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Master-data changes',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/admin/'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Approval history',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/customers/list/'],
                                    tooltip: '',
                                }, {
                                    label: 'Export centre',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/customers/list/'],
                                    tooltip: '',
                                }, {
                                    label: 'Operational reports',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/customers/list/'],
                                    tooltip: '',
                                }
                            ],
                        },
                        {
                            label: 'Configurations and masters',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Number sequences',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/numberSequences/'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                }
                            ],
                        },
                    ],
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
                            routerLink: ['/business/crm/opportunities/pipeline']
                        },
                        {
                            label: 'All Opportunities',
                            icon: 'pi pi-fw pi-list',
                            routerLink: ['/business/crm/opportunities']
                        },
                        {
                            label: 'New Opportunity',
                            icon: 'pi pi-fw pi-plus',
                            routerLink: ['/business/crm/opportunities/new']
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
                            routerLink: ['/business/origination/requirements']
                        },
                        {
                            label: 'New Requirement',
                            icon: 'pi pi-fw pi-plus',
                            routerLink: ['/business/origination/requirements/new']
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
                            routerLink: ['/business/origination/quotes/approvals']
                        },
                        {
                            label: 'Issued Quotes',
                            icon: 'pi pi-fw pi-send',
                            routerLink: ['/business/origination/quotes/issued']
                        }
                    ]
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
                            label: 'Credit Approvals',
                            icon: 'pi pi-fw pi-check-circle',
                            routerLink: ['/business/origination/credit/approvals']
                        },
                        {
                            label: 'Credit Limits',
                            icon: 'pi pi-fw pi-wallet',
                            routerLink: ['/business/origination/credit/limits']
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
                                    tooltip: 'See your fleet/ actions and costs here',
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
                            ],
                        },
                        {
                            label: 'Procurement',
                            icon: 'pi pi-fw pi-shopping-cart',
                            items: [
                            ],
                        },
                        {
                            label: 'Contracts',
                            icon: 'pi pi-fw pi-file',
                            items: [
                            ],
                        },
                        {
                            label: 'Billing and Finance',
                            icon: 'pi pi-fw pi-wallet',
                            items: [
                            ],
                        },
                        {
                            label: 'Operations',
                            icon: 'pi pi-fw pi-cog',
                            items: [
                            ],
                        },
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
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'Integrations',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'Audit and Logs',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'Reports',
                            icon: 'pi pi-fw pi-address-book',
                            routerLink: ['/dashboard/customers/list/'],
                            tooltip: '',
                        }
                    ],
                },
            ];
        }
        else {
            this.model = [
                {
                    label: 'Dashboards',
                    icon: 'pi pi-server',
                    items: [
                        {
                            label: 'My Task',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'Approvals',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/admin/'],
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'tenants',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/tenants/'],
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'Subscription Plans',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/dashboard/subscriptionPlans/'],
                            tooltip: 'See your fleet/ actions and costs here',
                        },
                        {
                            label: 'Customers',
                            icon: 'pi pi-fw pi-address-book',
                            routerLink: ['/dashboard/customers/list/'],
                            tooltip: '',
                        }
                    ],

                }

            ];
        }

    }
}
