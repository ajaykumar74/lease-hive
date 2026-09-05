import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { OrganisationListComponent } from './organisation-list.component';
import { OrganisationCreateComponent } from './organisation-create.component';
import { OrganisationEditComponent } from './organisation-edit.component';
import { OrganisationViewComponent } from './organisation-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Organisations'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: OrganisationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: OrganisationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: OrganisationCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: OrganisationEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: OrganisationViewComponent 
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
export class OrganisationRoutingModule { } 
 