import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { FinanceApprovalRequestListComponent } from './financeApprovalRequest-list.component';
import { FinanceApprovalRequestCreateComponent } from './financeApprovalRequest-create.component';
import { FinanceApprovalRequestEditComponent } from './financeApprovalRequest-edit.component';
import { FinanceApprovalRequestViewComponent } from './financeApprovalRequest-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'FinanceApprovalRequests'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: FinanceApprovalRequestListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: FinanceApprovalRequestListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: FinanceApprovalRequestCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: FinanceApprovalRequestEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: FinanceApprovalRequestViewComponent 
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
export class FinanceApprovalRequestRoutingModule { } 
 