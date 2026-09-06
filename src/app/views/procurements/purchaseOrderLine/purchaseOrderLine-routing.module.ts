import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PurchaseOrderLineListComponent } from './purchaseOrderLine-list.component';
import { PurchaseOrderLineCreateComponent } from './purchaseOrderLine-create.component';
import { PurchaseOrderLineEditComponent } from './purchaseOrderLine-edit.component';
import { PurchaseOrderLineViewComponent } from './purchaseOrderLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PurchaseOrderLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PurchaseOrderLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PurchaseOrderLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PurchaseOrderLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PurchaseOrderLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PurchaseOrderLineViewComponent 
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
export class PurchaseOrderLineRoutingModule { } 
 