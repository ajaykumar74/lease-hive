import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CustomerProfileListComponent } from './customerProfile-list.component';
import { CustomerProfileCreateComponent } from './customerProfile-create.component';
import { CustomerProfileEditComponent } from './customerProfile-edit.component';
import { CustomerProfileViewComponent } from './customerProfile-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CustomerProfiles'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CustomerProfileListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CustomerProfileListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CustomerProfileCreateComponent,
        data: {
          title: 'Create'
        }
      },
      { path: 'party/:partyId/create', canActivate: [AuthGuard], component: CustomerProfileCreateComponent, data: { title: 'Create' } },
      { path: 'party/:partyId/edit/:id', canActivate: [AuthGuard], component: CustomerProfileEditComponent },
      { path: 'party/:partyId/view/:id', canActivate: [AuthGuard], component: CustomerProfileViewComponent },
      { path: 'party/:partyId', canActivate: [AuthGuard], component: CustomerProfileListComponent, data: { title: 'List' } },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CustomerProfileEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CustomerProfileViewComponent 
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
export class CustomerProfileRoutingModule { } 
 
