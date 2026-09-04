import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { FinanceReconciliationListComponent } from './financeReconciliation-list.component';
import { FinanceReconciliationCreateComponent } from './financeReconciliation-create.component';
import { FinanceReconciliationEditComponent } from './financeReconciliation-edit.component';
import { FinanceReconciliationViewComponent } from './financeReconciliation-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'FinanceReconciliations'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: FinanceReconciliationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: FinanceReconciliationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: FinanceReconciliationCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: FinanceReconciliationEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: FinanceReconciliationViewComponent 
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
export class FinanceReconciliationRoutingModule { } 
 