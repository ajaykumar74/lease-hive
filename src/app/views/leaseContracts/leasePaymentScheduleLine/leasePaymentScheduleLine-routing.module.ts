import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeasePaymentScheduleLineListComponent } from './leasePaymentScheduleLine-list.component';
import { LeasePaymentScheduleLineCreateComponent } from './leasePaymentScheduleLine-create.component';
import { LeasePaymentScheduleLineEditComponent } from './leasePaymentScheduleLine-edit.component';
import { LeasePaymentScheduleLineViewComponent } from './leasePaymentScheduleLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeasePaymentScheduleLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeasePaymentScheduleLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeasePaymentScheduleLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeasePaymentScheduleLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeasePaymentScheduleLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeasePaymentScheduleLineViewComponent 
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
export class LeasePaymentScheduleLineRoutingModule { } 
 