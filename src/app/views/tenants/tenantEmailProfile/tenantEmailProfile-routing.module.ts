import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { TenantEmailProfileListComponent } from './tenantEmailProfile-list.component';
import { TenantEmailProfileCreateComponent } from './tenantEmailProfile-create.component';
import { TenantEmailProfileEditComponent } from './tenantEmailProfile-edit.component';
import { TenantEmailProfileViewComponent } from './tenantEmailProfile-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Email profiles'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: TenantEmailProfileListComponent,      
        data: {
          title: 'Email profiles'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: TenantEmailProfileListComponent,      
        data: {
          title: 'Email profiles'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: TenantEmailProfileCreateComponent,
        data: {
          title: 'Create email profile'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: TenantEmailProfileEditComponent,
        data: { title: 'Edit email profile' }
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: TenantEmailProfileViewComponent,
        data: { title: 'View email profile' }
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
export class TenantEmailProfileRoutingModule { } 
 
