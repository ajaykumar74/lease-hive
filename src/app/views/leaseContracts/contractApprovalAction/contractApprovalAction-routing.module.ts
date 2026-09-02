import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractApprovalActionListComponent } from './contractApprovalAction-list.component';
import { ContractApprovalActionCreateComponent } from './contractApprovalAction-create.component';
import { ContractApprovalActionEditComponent } from './contractApprovalAction-edit.component';
import { ContractApprovalActionViewComponent } from './contractApprovalAction-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractApprovalActions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractApprovalActionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractApprovalActionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractApprovalActionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractApprovalActionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractApprovalActionViewComponent 
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
export class ContractApprovalActionRoutingModule { } 
 