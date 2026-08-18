import { Routes } from '@angular/router';
import { PartyDashboardComponent } from './party-dashboard.component';

export const PARTY_ROUTES: Routes = [
    { path: 'parties/dashboard', component: PartyDashboardComponent, data: { title: 'Party Dashboard', breadcrumb: 'Party Dashboard' } },
    { path: 'parties/roles', loadChildren: () => import('@/views/partyRole/partyRole.module').then(m => m.PartyRoleModule), data: { title: 'Party Roles', breadcrumb: 'Party Roles' } },
    { path: 'parties/relationships', loadChildren: () => import('@/views/partyRelationship/partyRelationship.module').then(m => m.PartyRelationshipModule), data: { title: 'Party Relationships', breadcrumb: 'Party Relationships' } },
    { path: 'parties/gst-registrations', loadChildren: () => import('@/views/partyGSTRegistration/partyGSTRegistration.module').then(m => m.PartyGSTRegistrationModule), data: { title: 'GST Registrations', breadcrumb: 'GST Registrations' } },
    { path: 'parties/tax-profiles', redirectTo: 'parties/gst-registrations', pathMatch: 'full' },
    { path: 'parties/locations', loadChildren: () => import('@/views/partyLocation/partyLocation.module').then(m => m.PartyLocationModule), data: { title: 'Party Locations', breadcrumb: 'Party Locations' } },
    { path: 'parties/contacts', loadChildren: () => import('@/views/partyContact/partyContact.module').then(m => m.PartyContactModule), data: { title: 'Party Contacts', breadcrumb: 'Party Contacts' } },
    { path: 'parties/bank-accounts', loadChildren: () => import('@/views/partyBankAccount/partyBankAccount.module').then(m => m.PartyBankAccountModule), data: { title: 'Party Bank Accounts', breadcrumb: 'Bank Accounts' } },
    { path: 'parties/documents', loadChildren: () => import('@/views/partyDocument/partyDocument.module').then(m => m.PartyDocumentModule), data: { title: 'Party Documents', breadcrumb: 'KYC Documents' } },
    { path: 'parties/verification-status', redirectTo: 'parties/dashboard', pathMatch: 'full' },
    { path: 'parties/credit-profiles', loadChildren: () => import('@/views/partyCreditProfile/partyCreditProfile.module').then(m => m.PartyCreditProfileModule), data: { title: 'Party Credit Profiles', breadcrumb: 'Credit Profiles' } },
    { path: 'parties/customer-profiles', loadChildren: () => import('@/views/customerProfile/customerProfile.module').then(m => m.CustomerProfileModule), data: { title: 'Customer Profiles', breadcrumb: 'Customer Profiles' } },
    { path: 'parties/customer-departments', loadChildren: () => import('@/views/customerDepartment/customerDepartment.module').then(m => m.CustomerDepartmentModule), data: { title: 'Customer Departments', breadcrumb: 'Customer Departments' } },
    { path: 'parties/supplier-profiles', loadChildren: () => import('@/views/supplierProfile/supplierProfile.module').then(m => m.SupplierProfileModule), data: { title: 'Supplier Profiles', breadcrumb: 'Supplier Profiles' } },
    { path: 'parties/supplier-service-areas', loadChildren: () => import('@/views/supplierServiceArea/supplierServiceArea.module').then(m => m.SupplierServiceAreaModule), data: { title: 'Supplier Service Areas', breadcrumb: 'Supplier Service Areas' } },
    { path: 'parties', loadChildren: () => import('@/views/party/party.module').then(m => m.PartyModule), data: { title: 'Parties', breadcrumb: 'Parties' } }
];
