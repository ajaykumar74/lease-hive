import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { RolePermissionListComponent } from './rolePermission-list.component';
import { RolePermissionCreateComponent } from './rolePermission-create.component';
import { RolePermissionEditComponent } from './rolePermission-edit.component';
import { RolePermissionViewComponent } from './rolePermission-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'RolePermissions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: RolePermissionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: RolePermissionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: RolePermissionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: RolePermissionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: RolePermissionViewComponent 
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
export class RolePermissionRoutingModule { } 
 