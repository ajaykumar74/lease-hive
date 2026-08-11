import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PortalUserListComponent } from './portalUser-list.component';
import { PortalUserCreateComponent } from './portalUser-create.component';
import { PortalUserEditComponent } from './portalUser-edit.component';
import { PortalUserViewComponent } from './portalUser-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PortalUsers'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PortalUserListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PortalUserListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PortalUserCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PortalUserEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PortalUserViewComponent 
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
export class PortalUserRoutingModule { } 
 