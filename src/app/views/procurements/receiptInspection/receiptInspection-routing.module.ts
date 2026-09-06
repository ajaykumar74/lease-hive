import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ReceiptInspectionListComponent } from './receiptInspection-list.component';
import { ReceiptInspectionCreateComponent } from './receiptInspection-create.component';
import { ReceiptInspectionEditComponent } from './receiptInspection-edit.component';
import { ReceiptInspectionViewComponent } from './receiptInspection-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ReceiptInspections'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ReceiptInspectionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ReceiptInspectionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ReceiptInspectionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ReceiptInspectionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ReceiptInspectionViewComponent 
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
export class ReceiptInspectionRoutingModule { } 
 