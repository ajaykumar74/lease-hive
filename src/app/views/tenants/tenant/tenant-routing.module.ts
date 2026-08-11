import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { TenantListComponent } from './tenant-list.component';
import { TenantCreateComponent } from './tenant-create.component';
import { TenantEditComponent } from './tenant-edit.component';
import { TenantViewComponent } from './tenant-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Tenants'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: TenantListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: TenantListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: TenantCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: TenantEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: TenantViewComponent 
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
export class TenantRoutingModule { } 
 