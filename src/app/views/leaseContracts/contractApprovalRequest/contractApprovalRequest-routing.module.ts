import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractApprovalRequestListComponent } from './contractApprovalRequest-list.component';
import { ContractApprovalRequestCreateComponent } from './contractApprovalRequest-create.component';
import { ContractApprovalRequestEditComponent } from './contractApprovalRequest-edit.component';
import { ContractApprovalRequestViewComponent } from './contractApprovalRequest-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractApprovalRequests'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractApprovalRequestListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractApprovalRequestListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractApprovalRequestCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractApprovalRequestEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractApprovalRequestViewComponent 
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
export class ContractApprovalRequestRoutingModule { } 
 