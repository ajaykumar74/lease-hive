import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InvoiceStatusListComponent } from './invoiceStatus-list.component';
import { InvoiceStatusCreateComponent } from './invoiceStatus-create.component';
import { InvoiceStatusEditComponent } from './invoiceStatus-edit.component';
import { InvoiceStatusViewComponent } from './invoiceStatus-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InvoiceStatuss'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InvoiceStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InvoiceStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InvoiceStatusCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InvoiceStatusEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InvoiceStatusViewComponent 
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
export class InvoiceStatusRoutingModule { } 
 