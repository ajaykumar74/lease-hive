import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { BillingRunItemListComponent } from './billingRunItem-list.component';
import { BillingRunItemCreateComponent } from './billingRunItem-create.component';
import { BillingRunItemEditComponent } from './billingRunItem-edit.component';
import { BillingRunItemViewComponent } from './billingRunItem-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'BillingRunItems'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: BillingRunItemListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: BillingRunItemListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: BillingRunItemCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: BillingRunItemEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: BillingRunItemViewComponent 
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
export class BillingRunItemRoutingModule { } 
 