import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PurchaseOrderStatusListComponent } from './purchaseOrderStatus-list.component';
import { PurchaseOrderStatusCreateComponent } from './purchaseOrderStatus-create.component';
import { PurchaseOrderStatusEditComponent } from './purchaseOrderStatus-edit.component';
import { PurchaseOrderStatusViewComponent } from './purchaseOrderStatus-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PurchaseOrderStatuss'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PurchaseOrderStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PurchaseOrderStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PurchaseOrderStatusCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PurchaseOrderStatusEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PurchaseOrderStatusViewComponent 
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
export class PurchaseOrderStatusRoutingModule { } 
 