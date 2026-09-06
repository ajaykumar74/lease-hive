import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PurchaseOrderAmendmentListComponent } from './purchaseOrderAmendment-list.component';
import { PurchaseOrderAmendmentCreateComponent } from './purchaseOrderAmendment-create.component';
import { PurchaseOrderAmendmentEditComponent } from './purchaseOrderAmendment-edit.component';
import { PurchaseOrderAmendmentViewComponent } from './purchaseOrderAmendment-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PurchaseOrderAmendments'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PurchaseOrderAmendmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PurchaseOrderAmendmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PurchaseOrderAmendmentCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PurchaseOrderAmendmentEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PurchaseOrderAmendmentViewComponent 
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
export class PurchaseOrderAmendmentRoutingModule { } 
 