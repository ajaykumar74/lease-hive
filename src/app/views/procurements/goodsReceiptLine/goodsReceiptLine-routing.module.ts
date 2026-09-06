import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { GoodsReceiptLineListComponent } from './goodsReceiptLine-list.component';
import { GoodsReceiptLineCreateComponent } from './goodsReceiptLine-create.component';
import { GoodsReceiptLineEditComponent } from './goodsReceiptLine-edit.component';
import { GoodsReceiptLineViewComponent } from './goodsReceiptLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'GoodsReceiptLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: GoodsReceiptLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: GoodsReceiptLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: GoodsReceiptLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: GoodsReceiptLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: GoodsReceiptLineViewComponent 
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
export class GoodsReceiptLineRoutingModule { } 
 