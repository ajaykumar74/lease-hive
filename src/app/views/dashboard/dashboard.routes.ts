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
        path: 'organisations',
        data: { breadcrumb: 'organisations' },
        loadChildren: () => import('@/views/organisation/organisation.module').then(c => c.OrganisationModule),
      },
      {
        path: 'organisationUnits',
        data: { breadcrumb: 'Organisation Units' },
        loadChildren: () => import('@/views/organisationUnit/organisationUnit.module').then(c => c.OrganisationUnitModule),
      },
      {
        path: 'organisationUnitLocations',
        data: { breadcrumb: 'organisationUnitLocations' },
        loadChildren: () => import('@/views/organisationUnitLocation/organisationUnitLocation.module').then(c => c.OrganisationUnitLocationModule),
      },
      {
        path: 'businessCalendars',
        data: { breadcrumb: 'Business Calendars' },
        loadChildren: () => import('@/views/businessCalendar/businessCalendar.module').then(c => c.BusinessCalendarModule),
      },
      {
        path: 'businessCalendarHolidays',
        data: { breadcrumb: 'Business Calendar Holidays' },
        loadChildren: () => import('@/views/businessCalendarHoliday/businessCalendarHoliday.module').then(c => c.BusinessCalendarHolidayModule),
      },
      {
        path: 'locations',
        data: { breadcrumb: 'Locations' },
        loadChildren: () => import('@/views/location/location.module').then(c => c.LocationModule),
      },
      {
        path: 'subscriptionPlans',
        data: { breadcrumb: 'Subscription Plans' },
        loadChildren: () => import('@/views/tenants/subscriptionPlan/subscriptionPlan.module').then(c => c.SubscriptionPlanModule),
      },

      {
        path: 'departments',
        data: { breadcrumb: 'Departments' },
        loadChildren: () => import('@/views/department/department.module').then(c => c.DepartmentModule),
      },
      {
        path: 'costCenters',
        data: { breadcrumb: 'Cost Centers' },
        loadChildren: () => import('@/views/costCentre/costCentre.module').then(c => c.CostCentreModule),
      },
      {
        path: 'profitCenters',
        data: { breadcrumb: 'Profit Centers' },
        loadChildren: () => import('@/views/profitCentre/profitCentre.module').then(c => c.ProfitCentreModule),
      },
      {
        path: 'partys',
        data: { breadcrumb: 'Parties' },
        loadChildren: () => import('@/views/party/party.module').then(c => c.PartyModule),
      },
      {
        path: 'partyRoles',
        data: { breadcrumb: 'Party Roles' },
        loadChildren: () => import('@/views/partyRole/partyRole.module').then(c => c.PartyRoleModule),
      },
      {
        path: 'partyRelationships',
        data: { breadcrumb: 'Party Relationships' },
        loadChildren: () => import('@/views/partyRelationship/partyRelationship.module').then(c => c.PartyRelationshipModule),
      },
      {
        path: 'partyGSTRegistrations',
        data: { breadcrumb: 'Party GST Registrations' },
        loadChildren: () => import('@/views/partyGSTRegistration/partyGSTRegistration.module').then(c => c.PartyGSTRegistrationModule),
      },
      {
        path: 'partyLocations',
        data: { breadcrumb: 'Party Locations' },
        loadChildren: () => import('@/views/partyLocation/partyLocation.module').then(c => c.PartyLocationModule),
      },
      {
        path: 'partyContacts',
        data: { breadcrumb: 'Party Contacts' },
        loadChildren: () => import('@/views/partyContact/partyContact.module').then(c => c.PartyContactModule),
      },
  {
        path: 'partyBankAccounts',
        data: { breadcrumb: 'Party Bank Accounts' },
        loadChildren: () => import('@/views/partyBankAccount/partyBankAccount.module').then(c => c.PartyBankAccountModule),
      },
{
        path: 'partyDocuments',
        data: { breadcrumb: 'Party Documents' },
        loadChildren: () => import('@/views/partyDocument/partyDocument.module').then(c => c.PartyDocumentModule),
      },
      {
        path: 'partyCreditProfiles',
        data: { breadcrumb: 'Party Credit Profiles' },
        loadChildren: () => import('@/views/partyCreditProfile/partyCreditProfile.module').then(c => c.PartyCreditProfileModule),
      },
         {
        path: 'customerProfiles',
        data: { breadcrumb: 'Customer Profiles' },
        loadChildren: () => import('@/views/customerProfile/customerProfile.module').then(c => c.CustomerProfileModule),
      },
       {
        path: 'customerDepartments',
        data: { breadcrumb: 'Customer Departments' },
        loadChildren: () => import('@/views/customerDepartment/customerDepartment.module').then(c => c.CustomerDepartmentModule),
      },
       {
        path: 'assetUsers',
        data: { breadcrumb: 'Asset Users' },
        loadChildren: () => import('@/views/assetUser/assetUser.module').then(c => c.AssetUserModule),
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
         ,
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
        path: 'supplierProfiles',
        data: { breadcrumb: 'Supplier Profiles' },
        loadChildren: () => import('@/views/supplierProfile/supplierProfile.module').then(c => c.SupplierProfileModule),
      },
        {
        path: 'supplierServiceAreas',
        data: { breadcrumb: 'Supplier Service Areas' },
        loadChildren: () => import('@/views/supplierServiceArea/supplierServiceArea.module').then(c => c.SupplierServiceAreaModule),
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
        loadChildren: () => import('@/views/document/document.module').then(c => c.documentModule),
      },


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
