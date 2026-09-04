import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PaymentAllocationListComponent } from './paymentAllocation-list.component';
import { PaymentAllocationCreateComponent } from './paymentAllocation-create.component';
import { PaymentAllocationEditComponent } from './paymentAllocation-edit.component';
import { PaymentAllocationViewComponent } from './paymentAllocation-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PaymentAllocations'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PaymentAllocationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PaymentAllocationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PaymentAllocationCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PaymentAllocationEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PaymentAllocationViewComponent 
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
export class PaymentAllocationRoutingModule { } 
 