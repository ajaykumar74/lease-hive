import { Routes } from '@angular/router';
import { OrganisationDashboardComponent } from './organisation-dashboard.component';

export const ORGANISATION_ROUTES: Routes = [
    { path: 'organisations/dashboard', component: OrganisationDashboardComponent, data: { title: 'Organisation Dashboard', breadcrumb: 'Organisation Dashboard' } },
    { path: 'organisations/units', loadChildren: () => import('@/views/organisations/organisationUnit/organisationUnit.module').then(m => m.OrganisationUnitModule), data: { title: 'Organisation Units', breadcrumb: 'Organisation Units' } },
    { path: 'organisations/unit-locations', loadChildren: () => import('@/views/organisations/organisationUnitLocation/organisationUnitLocation.module').then(m => m.OrganisationUnitLocationModule), data: { title: 'Unit Locations', breadcrumb: 'Unit Locations' } },
    { path: 'organisations/locations', loadChildren: () => import('@/views/organisations/location/location.module').then(m => m.LocationModule), data: { title: 'Locations', breadcrumb: 'Locations' } },
    { path: 'organisations/departments', loadChildren: () => import('@/views/department/department.module').then(m => m.DepartmentModule), data: { title: 'Departments', breadcrumb: 'Departments' } },
    { path: 'organisations/cost-centres', loadChildren: () => import('@/views/organisations/costCentre/costCentre.module').then(m => m.CostCentreModule), data: { title: 'Cost Centres', breadcrumb: 'Cost Centres' } },
    { path: 'organisations/profit-centres', loadChildren: () => import('@/views/organisations/profitCentre/profitCentre.module').then(m => m.ProfitCentreModule), data: { title: 'Profit Centres', breadcrumb: 'Profit Centres' } },
    { path: 'organisations/calendars/holidays', loadChildren: () => import('@/views/organisations/businessCalendarHoliday/businessCalendarHoliday.module').then(m => m.BusinessCalendarHolidayModule), data: { title: 'Calendar Holidays', breadcrumb: 'Calendar Holidays' } },
    { path: 'organisations/calendars', loadChildren: () => import('@/views/organisations/businessCalendar/businessCalendar.module').then(m => m.BusinessCalendarModule), data: { title: 'Business Calendars', breadcrumb: 'Business Calendars' } },
    { path: 'organisations/documents', loadChildren: () => import('@/views/organisations/document/document.module').then(m => m.documentModule), data: { title: 'Documents', breadcrumb: 'Documents' } },
    { path: 'organisations', loadChildren: () => import('@/views/organisations/organisation/organisation.module').then(m => m.OrganisationModule), data: { title: 'Organisations', breadcrumb: 'Organisations' } }
];
