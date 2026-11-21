import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PartyListComponent } from './party-list.component';
import { PartyCreateComponent } from './party-create.component';
import { PartyEditComponent } from './party-edit.component';
import { PartyViewComponent } from './party-view.component';
import { PartyProfileComponent } from './party-profile.component';
import { PartyProfileOverviewComponent } from './party-profile-overview.component';
import { PartyProfileRecordsComponent } from './party-profile-records.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Partys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PartyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PartyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PartyCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PartyEditComponent 
      },
	  {
        path: 'profile/:id',
        canActivate: [AuthGuard],
        component: PartyProfileComponent,
        data: { title: 'Party Profile' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'overview' },
          { path: 'overview', component: PartyProfileOverviewComponent, data: { title: 'Overview' } },
          { path: 'details', component: PartyProfileRecordsComponent, data: { section: 'details', title: 'Party Details' } },
          { path: 'gst', component: PartyProfileRecordsComponent, data: { section: 'gst', title: 'GST Registrations' } },
          { path: 'locations', component: PartyProfileRecordsComponent, data: { section: 'locations', title: 'Locations' } },
          { path: 'departments', component: PartyProfileRecordsComponent, data: { section: 'departments', title: 'Departments' } },
          { path: 'contacts', component: PartyProfileRecordsComponent, data: { section: 'contacts', title: 'Contacts' } },
          { path: 'users', component: PartyProfileRecordsComponent, data: { section: 'users', title: 'Users' } },
          { path: 'app-users', component: PartyProfileRecordsComponent, data: { section: 'app-users', title: 'Application Users' } },
          { path: 'banks', component: PartyProfileRecordsComponent, data: { section: 'banks', title: 'Bank Accounts' } },
          { path: 'documents', component: PartyProfileRecordsComponent, data: { section: 'documents', title: 'Documents' } },
          { path: 'assets', component: PartyProfileRecordsComponent, data: { section: 'assets', title: 'Assets' } },
          { path: 'contracts', component: PartyProfileRecordsComponent, data: { section: 'contracts', title: 'Contracts' } },
          { path: 'billing', component: PartyProfileRecordsComponent, data: { section: 'billing', title: 'Billing' } },
          { path: 'invoices', component: PartyProfileRecordsComponent, data: { section: 'invoices', title: 'Invoices' } },
          { path: 'payments', component: PartyProfileRecordsComponent, data: { section: 'payments', title: 'Payments' } },
          { path: 'rfqs', component: PartyProfileRecordsComponent, data: { section: 'rfqs', title: 'RFQs' } },
          { path: 'purchase-orders', component: PartyProfileRecordsComponent, data: { section: 'purchase-orders', title: 'Purchase Orders' } },
          { path: 'deliveries', component: PartyProfileRecordsComponent, data: { section: 'deliveries', title: 'Deliveries' } },
          { path: 'goods-receipts', component: PartyProfileRecordsComponent, data: { section: 'goods-receipts', title: 'Goods Receipts' } },
          { path: 'insurance', component: PartyProfileRecordsComponent, data: { section: 'insurance', title: 'Insurance' } },
          { path: 'claims', component: PartyProfileRecordsComponent, data: { section: 'claims', title: 'Claims' } },
          { path: 'funding', component: PartyProfileRecordsComponent, data: { section: 'funding', title: 'Funding' } },
          { path: 'repayments', component: PartyProfileRecordsComponent, data: { section: 'repayments', title: 'Repayments' } },
          { path: 'tickets', component: PartyProfileRecordsComponent, data: { section: 'tickets', title: 'Service Tickets' } },
          { path: 'activity', component: PartyProfileRecordsComponent, data: { section: 'activity', title: 'Activity History' } }
        ]
      },
	  {
        path: 'view/:id',
        redirectTo: 'profile/:id/overview',
        pathMatch: 'full'
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
export class PartyRoutingModule { }
