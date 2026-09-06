import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { GoodsReceiptListComponent } from './goodsReceipt-list.component';
import { GoodsReceiptCreateComponent } from './goodsReceipt-create.component';
import { GoodsReceiptEditComponent } from './goodsReceipt-edit.component';
import { GoodsReceiptViewComponent } from './goodsReceipt-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'GoodsReceipts'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: GoodsReceiptListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: GoodsReceiptListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: GoodsReceiptCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: GoodsReceiptEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: GoodsReceiptViewComponent 
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
export class GoodsReceiptRoutingModule { } 
 