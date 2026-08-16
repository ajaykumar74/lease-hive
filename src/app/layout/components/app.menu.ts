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
                                    label: 'Companies & legal entities',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/organisations/list'],
                                    tooltip: 'see you organisation/ legal entities here',
                                },
                                {
                                    label: 'Regions and branches',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/organisationUnits/list'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Locations',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/locations/list'],
                                    tooltip: 'see your locations here',
                                },
                                {
                                    label: 'Departments',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/departments/list'],
                                    tooltip: ''
                                }, {
                                    label: 'Cost / profit centres',
                                    icon: 'pi pi-fw pi-address-book',
                                    items: [
                                        {
                                            label: 'Cost Centres',
                                            icon: 'pi pi-fw pi-address-book',
                                            routerLink: ['/dashboard/costCenters/list'],
                                            tooltip: '',
                                        },
                                        {
                                            label: 'Profit Centres',
                                            icon: 'pi pi-fw pi-address-book',
                                            routerLink: ['/dashboard/profitCenters/list'],
                                            tooltip: '',
                                        }
                                    ]
                                }, {
                                    label: 'Business calendars',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/businessCalendars/list/'],
                                    tooltip: '',
                                }
                            ],
                        },
                        {
                            label: 'Party Management',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'All parties',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/dashboard/partys/list'],
                                },
                                {
                                    label: 'Customer profiles',
                                    icon: 'pi pi-fw pi-times-circle',
                                    routerLink: ['/dashboard/customerProfiles/list'],
                                },
                                {
                                    label: 'Supplier profiles',
                                    icon: 'pi pi-fw pi-lock',
                                    routerLink: ['/dashboard/supplierProfiles/list'],
                                },
                                {
                                    label: 'Party roles',
                                    icon: 'pi pi-fw pi-user-plus',
                                    routerLink: ['/dashboard/partyRoles/list'],
                                },
                                {
                                    label: 'Party relationships',
                                    icon: 'pi pi-fw pi-question',
                                    routerLink: ['dashboard/partyRelationships/list'],
                                },
                                {
                                    label: 'Contacts and documents',
                                    icon: 'pi pi-fw pi-cog',
                                    items: [
                                        {
                                            label: 'Party contacts',
                                            icon: 'pi pi-fw pi-question',
                                            routerLink: ['/dashboard/partyContacts/list'],
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
                                    routerLink: ['/dashboard/partyGSTRegistrations/list'],
                                    tooltip: 'see your gst registrations here',
                                },
                                {
                                    label: 'Party Locations',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/partyLocations/list'],
                                    tooltip: 'see your party locations here',
                                },
                                {
                                    label: 'Tax profiles',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/partyTaxProfiles/list'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Bank accounts',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/dashboard/partyBankAccounts/list'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Credit profiles',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/partyCreditProfiles/list/'],
                                    tooltip: '',
                                }, {
                                    label: 'KYC documents',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/partyDocuments/list/'],
                                    tooltip: '',
                                }, {
                                    label: 'Verification status',
                                    icon: 'pi pi-fw pi-address-book',
                                    routerLink: ['/dashboard/customers/list/'],
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
                            ],
                        },
                        {
                            label: 'Assets',
                            icon: 'pi pi-fw pi-box',
                            items: [
                                {
                                    label: 'Asset Dashboard',
                                    icon: 'pi pi-fw pi-chart-bar',
                                    routerLink: ['dashboard/assets/list'],
                                    tooltip: 'See your fleet/ actions and costs here',
                                },
                                {
                                    label: 'Asset Worklist',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/assets']
                                },
                                {
                                    label: 'Create Asset',
                                    icon: 'pi pi-fw pi-plus-circle',
                                    routerLink: ['/assets/create']
                                },
                                {
                                    label: 'Classification',
                                    icon: 'pi pi-fw pi-sitemap',
                                    items: [
                                        {
                                            label: 'Asset Categories',
                                            routerLink: ['/dashboard/assetCategorys/list']
                                        },
                                        {
                                            label: 'Asset Types',
                                            routerLink: ['/dashboard/assetTypes']
                                        },
                                        {
                                            label: 'Asset Makes',
                                            routerLink: ['/dashboard/assetMakes']
                                        },
                                        {
                                            label: 'Models & Variants',
                                            routerLink: ['/dashboard/assetModels']
                                        },
                                          {
                                            label: 'Asset identifiers',
                                            routerLink: ['/dashboard/assetIdentifiers']
                                        },


                                        {
                                            label: 'Attribute Definitions',
                                            items: [
                                                {
                                                    label: 'Asset Attribute Definitions',
                                                    routerLink: ['/dashboard/assetAttributeDefinitions']
                                                },
                                                 {
                                                    label: 'Asset Attribute Options',
                                                    routerLink: ['/dashboard/assetAttributeOptions']
                                                },
                                             {
                                                    label: 'Asset Attribute Values',
                                                    routerLink: ['/dashboard/assetAttributeValues']
                                                },
                                                 {
                                                    label: 'Asset Statuses',
                                                    routerLink: ['/dashboard/assetStatuss']
                                                }, 
                                               {
                                                    label: 'Asset Status History',
                                                    routerLink: ['/dashboard/assetStatusHistorys']
                                                },  
                                              {
                                                    label: 'Asset Condition Grades',
                                                    routerLink: ['/dashboard/assetConditionGrades']
                                                },     
                                                  {
                                                    label: 'Asset Ownership History',
                                                    routerLink: ['/dashboard/assetOwnershipHistorys']
                                                },    
                                                  {
                                                    label: 'Asset Location History',
                                                    routerLink: ['/dashboard/assetLocationHistorys']
                                                } 
                                                
                                                
                                            ]
                                        },

                                        {
                                            label: 'Attribute Options',
                                            routerLink: ['/assets/attribute-options']
                                        }
                                    ]
                                },
                                {
                                    label: 'Assignments & Custody',
                                    icon: 'pi pi-fw pi-users',
                                    items: [
                                        {
                                            label: 'Current Assignments',
                                            routerLink: ['/assets/assetAssignments']
                                        },
                                        {
                                            label: 'Assign Asset',
                                            routerLink: ['/assets/assignments/create']
                                        },
                                        {
                                            label: 'Transfer Custody',
                                            routerLink: ['/assets/assignments/transfer']
                                        },
                                        {
                                            label: 'Assignment History',
                                            routerLink: ['/assets/assetAssignmentHistorys']
                                        }
                                    ]
                                },
                                {
                                    label: 'Locations & Movements',
                                    icon: 'pi pi-fw pi-map-marker',
                                    items: [
                                        {
                                            label: 'Current Locations',
                                            routerLink: ['/assets/locations']
                                        },
                                        {
                                            label: 'Move Asset',
                                            routerLink: ['/assets/movements/create']
                                        },
                                        {
                                            label: 'Branch Transfers',
                                            routerLink: ['/assets/movements/transfers']
                                        },
                                        {
                                            label: 'Movement History',
                                            routerLink: ['/assets/movements/history']
                                        }
                                    ]
                                },
                                {
                                    label: 'Measures & Readings',
                                    icon: 'pi pi-fw pi-chart-line',
                                    items: [
                                        {
                                            label: 'Measure Definitions',
                                            routerLink: ['/assets/measures']
                                        },
                                        {
                                            label: 'Record Reading',
                                            routerLink: ['/assets/readings/create']
                                        },
                                        {
                                            label: 'Reading History',
                                            routerLink: ['/assets/readings']
                                        }
                                    ]
                                },
                                {
                                    label: 'Inspections',
                                    icon: 'pi pi-fw pi-check-square',
                                    items: [
                                        {
                                            label: 'Inspection Worklist',
                                            routerLink: ['/assets/inspections']
                                        },
                                        {
                                            label: 'Create Inspection',
                                            routerLink: ['/assets/inspections/create']
                                        },
                                        {
                                            label: 'Condition Grades',
                                            routerLink: ['/assets/condition-grades']
                                        }
                                    ]
                                },
                                {
                                    label: 'Compliance',
                                    icon: 'pi pi-fw pi-verified',
                                    items: [
                                        {
                                            label: 'Compliance Dashboard',
                                            routerLink: ['/assets/compliance']
                                        },
                                        {
                                            label: 'Compliance Types',
                                            routerLink: ['/assets/compliance/types']
                                        },
                                        {
                                            label: 'Certificates & Permits',
                                            routerLink: ['/assets/compliance/records']
                                        },
                                        {
                                            label: 'Expiry Worklist',
                                            routerLink: ['/assets/compliance/expiring']
                                        }
                                    ]
                                },
                                {
                                    label: 'Documents',
                                    icon: 'pi pi-fw pi-folder',
                                    routerLink: ['/assets/documents']
                                },
                                {
                                    label: 'Valuations',
                                    icon: 'pi pi-fw pi-chart-line',
                                    routerLink: ['/assets/valuations']
                                },
                                {
                                    label: 'Warranty & Insurance',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        {
                                            label: 'Warranties',
                                            routerLink: ['/assets/warranties']
                                        },
                                        {
                                            label: 'Insurance',
                                            routerLink: ['/assets/insurance']
                                        }
                                    ]
                                },
                                {
                                    label: 'Lifecycle History',
                                    icon: 'pi pi-fw pi-history',
                                    routerLink: ['/assets/lifecycle']
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
