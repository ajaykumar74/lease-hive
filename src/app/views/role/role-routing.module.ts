import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { RoleListComponent } from './role-list.component';
import { RoleCreateComponent } from './role-create.component';
import { RoleEditComponent } from './role-edit.component';
import { RoleViewComponent } from './role-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Roles'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: RoleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: RoleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: RoleCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: RoleEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: RoleViewComponent 
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
export class RoleRoutingModule { } 
 