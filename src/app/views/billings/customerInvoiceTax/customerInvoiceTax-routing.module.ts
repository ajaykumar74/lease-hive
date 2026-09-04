import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CustomerInvoiceTaxListComponent } from './customerInvoiceTax-list.component';
import { CustomerInvoiceTaxCreateComponent } from './customerInvoiceTax-create.component';
import { CustomerInvoiceTaxEditComponent } from './customerInvoiceTax-edit.component';
import { CustomerInvoiceTaxViewComponent } from './customerInvoiceTax-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CustomerInvoiceTaxs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CustomerInvoiceTaxListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CustomerInvoiceTaxListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CustomerInvoiceTaxCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CustomerInvoiceTaxEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CustomerInvoiceTaxViewComponent 
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
export class CustomerInvoiceTaxRoutingModule { } 
 