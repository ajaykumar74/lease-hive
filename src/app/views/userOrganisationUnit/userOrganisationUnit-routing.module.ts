import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { UserOrganisationUnitListComponent } from './userOrganisationUnit-list.component';
import { UserOrganisationUnitCreateComponent } from './userOrganisationUnit-create.component';
import { UserOrganisationUnitEditComponent } from './userOrganisationUnit-edit.component';
import { UserOrganisationUnitViewComponent } from './userOrganisationUnit-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'UserOrganisationUnits'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: UserOrganisationUnitListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: UserOrganisationUnitListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: UserOrganisationUnitCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: UserOrganisationUnitEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: UserOrganisationUnitViewComponent 
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
export class UserOrganisationUnitRoutingModule { } 
 