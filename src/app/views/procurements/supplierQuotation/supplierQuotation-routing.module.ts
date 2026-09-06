import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SupplierQuotationListComponent } from './supplierQuotation-list.component';
import { SupplierQuotationCreateComponent } from './supplierQuotation-create.component';
import { SupplierQuotationEditComponent } from './supplierQuotation-edit.component';
import { SupplierQuotationViewComponent } from './supplierQuotation-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SupplierQuotations'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SupplierQuotationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SupplierQuotationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SupplierQuotationCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SupplierQuotationEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SupplierQuotationViewComponent 
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
export class SupplierQuotationRoutingModule { } 
 