import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SubscriptionPlanListComponent } from './subscriptionPlan-list.component';
import { SubscriptionPlanCreateComponent } from './subscriptionPlan-create.component';
import { SubscriptionPlanEditComponent } from './subscriptionPlan-edit.component';
import { SubscriptionPlanViewComponent } from './subscriptionPlan-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SubscriptionPlans'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SubscriptionPlanListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SubscriptionPlanListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SubscriptionPlanCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SubscriptionPlanEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SubscriptionPlanViewComponent 
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
export class SubscriptionPlanRoutingModule { } 
 