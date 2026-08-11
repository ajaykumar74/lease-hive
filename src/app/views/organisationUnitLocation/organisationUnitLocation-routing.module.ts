import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { OrganisationUnitLocationListComponent } from './organisationUnitLocation-list.component';
import { OrganisationUnitLocationCreateComponent } from './organisationUnitLocation-create.component';
import { OrganisationUnitLocationEditComponent } from './organisationUnitLocation-edit.component';
import { OrganisationUnitLocationViewComponent } from './organisationUnitLocation-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'OrganisationUnitLocations'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: OrganisationUnitLocationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: OrganisationUnitLocationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: OrganisationUnitLocationCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: OrganisationUnitLocationEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: OrganisationUnitLocationViewComponent 
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
export class OrganisationUnitLocationRoutingModule { } 
 