import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { BillingRunStatusListComponent } from './billingRunStatus-list.component';
import { BillingRunStatusCreateComponent } from './billingRunStatus-create.component';
import { BillingRunStatusEditComponent } from './billingRunStatus-edit.component';
import { BillingRunStatusViewComponent } from './billingRunStatus-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'BillingRunStatuss'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: BillingRunStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: BillingRunStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: BillingRunStatusCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: BillingRunStatusEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: BillingRunStatusViewComponent 
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
export class BillingRunStatusRoutingModule { } 
 