import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SupplierReturnListComponent } from './supplierReturn-list.component';
import { SupplierReturnCreateComponent } from './supplierReturn-create.component';
import { SupplierReturnEditComponent } from './supplierReturn-edit.component';
import { SupplierReturnViewComponent } from './supplierReturn-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SupplierReturns'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SupplierReturnListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SupplierReturnListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SupplierReturnCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SupplierReturnEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SupplierReturnViewComponent 
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
export class SupplierReturnRoutingModule { } 
 