import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CustomerInvoiceLineListComponent } from './customerInvoiceLine-list.component';
import { CustomerInvoiceLineCreateComponent } from './customerInvoiceLine-create.component';
import { CustomerInvoiceLineEditComponent } from './customerInvoiceLine-edit.component';
import { CustomerInvoiceLineViewComponent } from './customerInvoiceLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CustomerInvoiceLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CustomerInvoiceLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CustomerInvoiceLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CustomerInvoiceLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CustomerInvoiceLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CustomerInvoiceLineViewComponent 
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
export class CustomerInvoiceLineRoutingModule { } 
 