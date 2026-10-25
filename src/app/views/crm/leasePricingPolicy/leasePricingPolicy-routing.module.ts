import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeasePricingPolicyListComponent } from './leasePricingPolicy-list.component';
import { LeasePricingPolicyCreateComponent } from './leasePricingPolicy-create.component';
import { LeasePricingPolicyEditComponent } from './leasePricingPolicy-edit.component';
import { LeasePricingPolicyViewComponent } from './leasePricingPolicy-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeasePricingPolicys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeasePricingPolicyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeasePricingPolicyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeasePricingPolicyCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeasePricingPolicyEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeasePricingPolicyViewComponent 
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
export class LeasePricingPolicyRoutingModule { } 
 