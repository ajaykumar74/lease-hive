import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InvoiceMatchListComponent } from './invoiceMatch-list.component';
import { InvoiceMatchCreateComponent } from './invoiceMatch-create.component';
import { InvoiceMatchEditComponent } from './invoiceMatch-edit.component';
import { InvoiceMatchViewComponent } from './invoiceMatch-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InvoiceMatchs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InvoiceMatchListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InvoiceMatchListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InvoiceMatchCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InvoiceMatchEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InvoiceMatchViewComponent 
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
export class InvoiceMatchRoutingModule { } 
 