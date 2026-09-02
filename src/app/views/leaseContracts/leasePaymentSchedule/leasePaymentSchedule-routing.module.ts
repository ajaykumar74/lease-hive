import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeasePaymentScheduleListComponent } from './leasePaymentSchedule-list.component';
import { LeasePaymentScheduleCreateComponent } from './leasePaymentSchedule-create.component';
import { LeasePaymentScheduleEditComponent } from './leasePaymentSchedule-edit.component';
import { LeasePaymentScheduleViewComponent } from './leasePaymentSchedule-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeasePaymentSchedules'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeasePaymentScheduleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeasePaymentScheduleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeasePaymentScheduleCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeasePaymentScheduleEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeasePaymentScheduleViewComponent 
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
export class LeasePaymentScheduleRoutingModule { } 
 