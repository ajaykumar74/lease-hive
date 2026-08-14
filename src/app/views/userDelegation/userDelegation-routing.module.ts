import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { UserDelegationListComponent } from './userDelegation-list.component';
import { UserDelegationCreateComponent } from './userDelegation-create.component';
import { UserDelegationEditComponent } from './userDelegation-edit.component';
import { UserDelegationViewComponent } from './userDelegation-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'UserDelegations'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: UserDelegationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: UserDelegationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: UserDelegationCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: UserDelegationEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: UserDelegationViewComponent 
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
export class UserDelegationRoutingModule { } 
 