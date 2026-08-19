import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PurchaseRequisitionStatusListComponent } from './purchaseRequisitionStatus-list.component';
import { PurchaseRequisitionStatusCreateComponent } from './purchaseRequisitionStatus-create.component';
import { PurchaseRequisitionStatusEditComponent } from './purchaseRequisitionStatus-edit.component';
import { PurchaseRequisitionStatusViewComponent } from './purchaseRequisitionStatus-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PurchaseRequisitionStatuss'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionStatusCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionStatusEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionStatusViewComponent 
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
export class PurchaseRequisitionStatusRoutingModule { } 
 