import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CustomerInvoiceListComponent } from './customerInvoice-list.component';
import { CustomerInvoiceCreateComponent } from './customerInvoice-create.component';
import { CustomerInvoiceEditComponent } from './customerInvoice-edit.component';
import { CustomerInvoiceViewComponent } from './customerInvoice-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CustomerInvoices'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CustomerInvoiceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CustomerInvoiceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CustomerInvoiceCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CustomerInvoiceEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CustomerInvoiceViewComponent 
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
export class CustomerInvoiceRoutingModule { } 
 