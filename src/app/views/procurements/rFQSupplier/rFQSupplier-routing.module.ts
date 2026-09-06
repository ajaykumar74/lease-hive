import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { RFQSupplierListComponent } from './rFQSupplier-list.component';
import { RFQSupplierCreateComponent } from './rFQSupplier-create.component';
import { RFQSupplierEditComponent } from './rFQSupplier-edit.component';
import { RFQSupplierViewComponent } from './rFQSupplier-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'RFQSuppliers'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: RFQSupplierListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: RFQSupplierListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: RFQSupplierCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: RFQSupplierEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: RFQSupplierViewComponent 
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
export class RFQSupplierRoutingModule { } 
 