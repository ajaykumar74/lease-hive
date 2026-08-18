import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ApprovalActionListComponent } from './approvalAction-list.component';
import { ApprovalActionCreateComponent } from './approvalAction-create.component';
import { ApprovalActionEditComponent } from './approvalAction-edit.component';
import { ApprovalActionViewComponent } from './approvalAction-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ApprovalActions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ApprovalActionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ApprovalActionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ApprovalActionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ApprovalActionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ApprovalActionViewComponent 
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
export class ApprovalActionRoutingModule { } 
 