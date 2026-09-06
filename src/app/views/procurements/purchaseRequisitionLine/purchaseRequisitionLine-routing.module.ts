import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PurchaseRequisitionLineListComponent } from './purchaseRequisitionLine-list.component';
import { PurchaseRequisitionLineCreateComponent } from './purchaseRequisitionLine-create.component';
import { PurchaseRequisitionLineEditComponent } from './purchaseRequisitionLine-edit.component';
import { PurchaseRequisitionLineViewComponent } from './purchaseRequisitionLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PurchaseRequisitionLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PurchaseRequisitionLineViewComponent 
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
export class PurchaseRequisitionLineRoutingModule { } 
 