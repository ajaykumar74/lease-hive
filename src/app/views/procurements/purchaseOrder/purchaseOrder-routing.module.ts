import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PurchaseOrderListComponent } from './purchaseOrder-list.component';
import { PurchaseOrderCreateComponent } from './purchaseOrder-create.component';
import { PurchaseOrderEditComponent } from './purchaseOrder-edit.component';
import { PurchaseOrderViewComponent } from './purchaseOrder-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PurchaseOrders'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PurchaseOrderListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PurchaseOrderListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PurchaseOrderCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PurchaseOrderEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PurchaseOrderViewComponent 
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
export class PurchaseOrderRoutingModule { } 
 