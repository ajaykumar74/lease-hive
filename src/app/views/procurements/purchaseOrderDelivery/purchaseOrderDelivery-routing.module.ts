import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PurchaseOrderDeliveryListComponent } from './purchaseOrderDelivery-list.component';
import { PurchaseOrderDeliveryCreateComponent } from './purchaseOrderDelivery-create.component';
import { PurchaseOrderDeliveryEditComponent } from './purchaseOrderDelivery-edit.component';
import { PurchaseOrderDeliveryViewComponent } from './purchaseOrderDelivery-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PurchaseOrderDeliverys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PurchaseOrderDeliveryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PurchaseOrderDeliveryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PurchaseOrderDeliveryCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PurchaseOrderDeliveryEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PurchaseOrderDeliveryViewComponent 
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
export class PurchaseOrderDeliveryRoutingModule { } 
 