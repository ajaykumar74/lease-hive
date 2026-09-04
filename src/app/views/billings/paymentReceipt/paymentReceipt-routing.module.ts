import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PaymentReceiptListComponent } from './paymentReceipt-list.component';
import { PaymentReceiptCreateComponent } from './paymentReceipt-create.component';
import { PaymentReceiptEditComponent } from './paymentReceipt-edit.component';
import { PaymentReceiptViewComponent } from './paymentReceipt-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PaymentReceipts'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PaymentReceiptListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PaymentReceiptListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PaymentReceiptCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PaymentReceiptEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PaymentReceiptViewComponent 
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
export class PaymentReceiptRoutingModule { } 
 