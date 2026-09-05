import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SupplierProfileListComponent } from './supplierProfile-list.component';
import { SupplierProfileCreateComponent } from './supplierProfile-create.component';
import { SupplierProfileEditComponent } from './supplierProfile-edit.component';
import { SupplierProfileViewComponent } from './supplierProfile-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SupplierProfiles'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SupplierProfileListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SupplierProfileListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SupplierProfileCreateComponent,
        data: {
          title: 'Create'
        }
      },
      { path: 'party/:partyId/create', canActivate: [AuthGuard], component: SupplierProfileCreateComponent, data: { title: 'Create' } },
      { path: 'party/:partyId/edit/:id', canActivate: [AuthGuard], component: SupplierProfileEditComponent },
      { path: 'party/:partyId/view/:id', canActivate: [AuthGuard], component: SupplierProfileViewComponent },
      { path: 'party/:partyId', canActivate: [AuthGuard], component: SupplierProfileListComponent, data: { title: 'List' } },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SupplierProfileEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SupplierProfileViewComponent 
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
export class SupplierProfileRoutingModule { } 
 
