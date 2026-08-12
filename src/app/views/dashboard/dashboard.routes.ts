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
