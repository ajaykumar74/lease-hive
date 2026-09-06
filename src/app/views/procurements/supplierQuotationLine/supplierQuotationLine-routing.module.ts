import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SupplierQuotationLineListComponent } from './supplierQuotationLine-list.component';
import { SupplierQuotationLineCreateComponent } from './supplierQuotationLine-create.component';
import { SupplierQuotationLineEditComponent } from './supplierQuotationLine-edit.component';
import { SupplierQuotationLineViewComponent } from './supplierQuotationLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SupplierQuotationLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SupplierQuotationLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SupplierQuotationLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SupplierQuotationLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SupplierQuotationLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SupplierQuotationLineViewComponent 
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
export class SupplierQuotationLineRoutingModule { } 
 