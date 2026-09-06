import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SupplierInvoiceListComponent } from './supplierInvoice-list.component';
import { SupplierInvoiceCreateComponent } from './supplierInvoice-create.component';
import { SupplierInvoiceEditComponent } from './supplierInvoice-edit.component';
import { SupplierInvoiceViewComponent } from './supplierInvoice-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SupplierInvoices'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SupplierInvoiceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SupplierInvoiceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SupplierInvoiceCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SupplierInvoiceEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SupplierInvoiceViewComponent 
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
export class SupplierInvoiceRoutingModule { } 
 