import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SupplierServiceAreaListComponent } from './supplierServiceArea-list.component';
import { SupplierServiceAreaCreateComponent } from './supplierServiceArea-create.component';
import { SupplierServiceAreaEditComponent } from './supplierServiceArea-edit.component';
import { SupplierServiceAreaViewComponent } from './supplierServiceArea-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SupplierServiceAreas'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SupplierServiceAreaListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SupplierServiceAreaListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SupplierServiceAreaCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SupplierServiceAreaEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SupplierServiceAreaViewComponent 
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
export class SupplierServiceAreaRoutingModule { } 
 