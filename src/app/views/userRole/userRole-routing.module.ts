import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { UserRoleListComponent } from './userRole-list.component';
import { UserRoleCreateComponent } from './userRole-create.component';
import { UserRoleEditComponent } from './userRole-edit.component';
import { UserRoleViewComponent } from './userRole-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'UserRoles'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: UserRoleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: UserRoleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: UserRoleCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: UserRoleEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: UserRoleViewComponent 
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
export class UserRoleRoutingModule { } 
 