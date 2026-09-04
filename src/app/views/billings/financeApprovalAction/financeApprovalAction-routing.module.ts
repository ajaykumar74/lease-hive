import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { FinanceApprovalActionListComponent } from './financeApprovalAction-list.component';
import { FinanceApprovalActionCreateComponent } from './financeApprovalAction-create.component';
import { FinanceApprovalActionEditComponent } from './financeApprovalAction-edit.component';
import { FinanceApprovalActionViewComponent } from './financeApprovalAction-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'FinanceApprovalActions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: FinanceApprovalActionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: FinanceApprovalActionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: FinanceApprovalActionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: FinanceApprovalActionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: FinanceApprovalActionViewComponent 
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
export class FinanceApprovalActionRoutingModule { } 
 