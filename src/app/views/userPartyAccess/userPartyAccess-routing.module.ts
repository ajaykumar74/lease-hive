import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { UserPartyAccessListComponent } from './userPartyAccess-list.component';
import { UserPartyAccessCreateComponent } from './userPartyAccess-create.component';
import { UserPartyAccessEditComponent } from './userPartyAccess-edit.component';
import { UserPartyAccessViewComponent } from './userPartyAccess-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'UserPartyAccesss'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: UserPartyAccessListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: UserPartyAccessListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: UserPartyAccessCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: UserPartyAccessEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: UserPartyAccessViewComponent 
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
export class UserPartyAccessRoutingModule { } 
 