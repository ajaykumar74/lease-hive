import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PermissionListComponent } from './permission-list.component';
import { PermissionCreateComponent } from './permission-create.component';
import { PermissionEditComponent } from './permission-edit.component';
import { PermissionViewComponent } from './permission-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Permissions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PermissionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PermissionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PermissionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PermissionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PermissionViewComponent 
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
export class PermissionRoutingModule { } 
 