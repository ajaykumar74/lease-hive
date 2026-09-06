import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { GoodsReceiptStatusListComponent } from './goodsReceiptStatus-list.component';
import { GoodsReceiptStatusCreateComponent } from './goodsReceiptStatus-create.component';
import { GoodsReceiptStatusEditComponent } from './goodsReceiptStatus-edit.component';
import { GoodsReceiptStatusViewComponent } from './goodsReceiptStatus-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'GoodsReceiptStatuss'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: GoodsReceiptStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: GoodsReceiptStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: GoodsReceiptStatusCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: GoodsReceiptStatusEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: GoodsReceiptStatusViewComponent 
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
export class GoodsReceiptStatusRoutingModule { } 
 