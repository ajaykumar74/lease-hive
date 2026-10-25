import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { TenantSecurityPolicyListComponent } from './tenantSecurityPolicy-list.component';
import { TenantSecurityPolicyCreateComponent } from './tenantSecurityPolicy-create.component';
import { TenantSecurityPolicyEditComponent } from './tenantSecurityPolicy-edit.component';
import { TenantSecurityPolicyViewComponent } from './tenantSecurityPolicy-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'TenantSecurityPolicys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: TenantSecurityPolicyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: TenantSecurityPolicyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: TenantSecurityPolicyCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: TenantSecurityPolicyEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: TenantSecurityPolicyViewComponent 
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
export class TenantSecurityPolicyRoutingModule { } 
 