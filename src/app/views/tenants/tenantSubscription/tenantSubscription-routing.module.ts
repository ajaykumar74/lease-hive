import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { TenantSubscriptionListComponent } from './tenantSubscription-list.component';
import { TenantSubscriptionCreateComponent } from './tenantSubscription-create.component';
import { TenantSubscriptionEditComponent } from './tenantSubscription-edit.component';
import { TenantSubscriptionViewComponent } from './tenantSubscription-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'TenantSubscriptions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: TenantSubscriptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: TenantSubscriptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: TenantSubscriptionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: TenantSubscriptionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: TenantSubscriptionViewComponent 
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
export class TenantSubscriptionRoutingModule { } 
 