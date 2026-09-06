import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { GoodsReceiptSerialListComponent } from './goodsReceiptSerial-list.component';
import { GoodsReceiptSerialCreateComponent } from './goodsReceiptSerial-create.component';
import { GoodsReceiptSerialEditComponent } from './goodsReceiptSerial-edit.component';
import { GoodsReceiptSerialViewComponent } from './goodsReceiptSerial-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'GoodsReceiptSerials'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: GoodsReceiptSerialListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: GoodsReceiptSerialListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: GoodsReceiptSerialCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: GoodsReceiptSerialEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: GoodsReceiptSerialViewComponent 
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
export class GoodsReceiptSerialRoutingModule { } 
 