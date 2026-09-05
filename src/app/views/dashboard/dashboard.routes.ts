import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard-component';
import { UserComponent } from './user-component';
import { AppLayout } from '@/layout/components/app.layout';
import { AuthGuard } from '@/shared/auth-guard.service';
import { AdminDashboardComponent } from './dashboardAdmin-component';


const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        redirectTo: 'mydashboard',
        pathMatch: 'full'
      },
      {
        path: 'mydashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
          breadcrumb: 'Dashboard'
        },
      },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        data: {
          title: 'Admin Dashboard',
          breadcrumb: 'Dashboard'
        },
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        component: UserComponent,
        data: {
          title: 'Users',
          breadcrumb: 'Users'
        }
      },
      {
        path: 'customers',
        data: { breadcrumb: 'Customers' },
        loadChildren: () => import('@/views/customer/customer.module').then(c => c.CustomerModule),
      },
      {
        path: 'tenants',
        data: { breadcrumb: 'Tenants' },
        loadChildren: () => import('@/views/tenants/tenant/tenant.module').then(c => c.TenantModule),
      },
      {
        path: 'subscriptionPlans',
        data: { breadcrumb: 'Subscription Plans' },
        loadChildren: () => import('@/views/tenants/subscriptionPlan/subscriptionPlan.module').then(c => c.SubscriptionPlanModule),
      },
      {
        path: 'assetUsers',
        data: { breadcrumb: 'Asset Users' },
        loadChildren: () => import('@/views/assets/assetUser/assetUser.module').then(c => c.AssetUserModule),
      },
      {
        path: 'applicationUsers',
        data: { breadcrumb: 'Application Users' },
        loadChildren: () => import('@/views/applicationUser/applicationUser.module').then(c => c.ApplicationUserModule),
      },
      {
        path: 'roles',
        data: { breadcrumb: 'Roles' },
        loadChildren: () => import('@/views/role/role.module').then(c => c.RoleModule),
      },
      {
        path: 'permissions',
        data: { breadcrumb: 'Permissions' },
        loadChildren: () => import('@/views/permission/permission.module').then(c => c.PermissionModule),
      },
      {
        path: 'rolePermissions',
        data: { breadcrumb: 'Role Permissions' },
        loadChildren: () => import('@/views/rolePermission/rolePermission.module').then(c => c.RolePermissionModule),
      },
      {
        path: 'userRoles',
        data: { breadcrumb: 'User Roles' },
        loadChildren: () => import('@/views/userRole/userRole.module').then(c => c.UserRoleModule),
      },
      {
        path: 'userOrganisationUnits',
        data: { breadcrumb: 'User Organisation Units' },
        loadChildren: () => import('@/views/userOrganisationUnit/userOrganisationUnit.module').then(c => c.UserOrganisationUnitModule),
      },
      {
        path: 'userPartyAccesss',
        data: { breadcrumb: 'User Party Accesss' },
        loadChildren: () => import('@/views/userPartyAccess/userPartyAccess.module').then(c => c.UserPartyAccessModule),
      },
      {
        path: 'approvalAuthoritys',
        data: { breadcrumb: 'Approval Authorities' },
        loadChildren: () => import('@/views/approvalAuthority/approvalAuthority.module').then(c => c.ApprovalAuthorityModule),
      },
      {
        path: 'userDelegations',
        data: { breadcrumb: 'User Delegations' },
        loadChildren: () => import('@/views/userDelegation/userDelegation.module').then(c => c.UserDelegationModule),
      },
      {
        path: 'numberSequences',
        data: { breadcrumb: 'Number Sequences' },
        loadChildren: () => import('@/views/numberSequence/numberSequence.module').then(c => c.NumberSequenceModule),
      },
      {
        path: 'auditLogs',
        data: { breadcrumb: 'Audit Logs' },
        loadChildren: () => import('@/views/auditLog/auditLog.module').then(c => c.AuditLogModule),
      },
      {
        path: 'planFeatures',
        data: { breadcrumb: 'plan Features' },
        loadChildren: () => import('@/views/tenants/planFeature/planFeature.module').then(c => c.PlanFeatureModule),
      },
      {
        path: 'prospects',
        data: { breadcrumb: 'Prospects' },
        loadChildren: () => import('@/views/prospect/prospect.module').then(c => c.ProspectModule),
      },
      {
        path: 'supportTickets',
        data: { breadcrumb: 'Support Tickets' },
        loadChildren: () => import('@/views/supportTicket/supportTicket.module').then(c => c.SupportTicketModule),
      },
      {
        path: 'portalUsers',
        data: { breadcrumb: 'Portal Users' },
        loadChildren: () => import('@/views/portalUser/portalUser.module').then(c => c.PortalUserModule),
      },
      {
        path: 'brandPartners',
        data: { breadcrumb: 'Brand Partners' },
        loadChildren: () => import('@/views/brandPartner/brandPartner.module').then(c => c.BrandPartnerModule),
      },
      {
        path: 'contacts',
        data: { breadcrumb: 'Contacts' },
        loadChildren: () => import('@/views/contact/contact.module').then(c => c.ContactModule),
      },

      {
        path: 'settings',
        data: { breadcrumb: 'settings' },
        loadChildren: () => import('@/views/settings/settings.module').then(c => c.SettingsModule),
      },


      {
        path: 'exceptionLogs',
        data: { breadcrumb: 'Exception Logs' },
        loadChildren: () => import('@/views/exceptionLogs/exceptionLog.module').then(c => c.ExceptionLogModule),
      },
      {
        path: 'notifications',
        data: { breadcrumb: 'Notifications' },
        loadChildren: () => import('@/views/notification/notification.module').then(c => c.NotificationModule),
      },

      {
        path: 'document',
        data: { breadcrumb: 'document' },
        loadChildren: () => import('@/views/organisations/document/document.module').then(c => c.documentModule),
      },
      
       {
        path: 'leadSources',
        data: { breadcrumb: 'Lead Sources' },
        loadChildren: () => import('@/views/crm/leadSource/leadSource.module').then(c => c.LeadSourceModule),
      }  



    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { } 
