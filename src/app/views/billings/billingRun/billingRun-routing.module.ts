import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { BillingRunListComponent } from './billingRun-list.component';
import { BillingRunCreateComponent } from './billingRun-create.component';
import { BillingRunEditComponent } from './billingRun-edit.component';
import { BillingRunViewComponent } from './billingRun-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'BillingRuns'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: BillingRunListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: BillingRunListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: BillingRunCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: BillingRunEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: BillingRunViewComponent 
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
export class BillingRunRoutingModule { } 
 