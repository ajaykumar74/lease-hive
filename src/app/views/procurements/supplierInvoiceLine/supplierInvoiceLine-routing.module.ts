import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SupplierInvoiceLineListComponent } from './supplierInvoiceLine-list.component';
import { SupplierInvoiceLineCreateComponent } from './supplierInvoiceLine-create.component';
import { SupplierInvoiceLineEditComponent } from './supplierInvoiceLine-edit.component';
import { SupplierInvoiceLineViewComponent } from './supplierInvoiceLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SupplierInvoiceLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SupplierInvoiceLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SupplierInvoiceLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SupplierInvoiceLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SupplierInvoiceLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SupplierInvoiceLineViewComponent 
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
export class SupplierInvoiceLineRoutingModule { } 
 