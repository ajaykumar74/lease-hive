import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { OrganisationUnitListComponent } from './organisationUnit-list.component';
import { OrganisationUnitCreateComponent } from './organisationUnit-create.component';
import { OrganisationUnitEditComponent } from './organisationUnit-edit.component';
import { OrganisationUnitViewComponent } from './organisationUnit-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'OrganisationUnits'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: OrganisationUnitListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: OrganisationUnitListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: OrganisationUnitCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: OrganisationUnitEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: OrganisationUnitViewComponent 
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
export class OrganisationUnitRoutingModule { } 
 