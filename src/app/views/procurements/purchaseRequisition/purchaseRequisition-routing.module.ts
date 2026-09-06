import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PurchaseRequisitionListComponent } from './purchaseRequisition-list.component';
import { PurchaseRequisitionCreateComponent } from './purchaseRequisition-create.component';
import { PurchaseRequisitionEditComponent } from './purchaseRequisition-edit.component';
import { PurchaseRequisitionViewComponent } from './purchaseRequisition-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PurchaseRequisitions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionViewComponent 
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
export class PurchaseRequisitionRoutingModule { } 
 