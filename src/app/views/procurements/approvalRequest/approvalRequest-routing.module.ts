import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ApprovalRequestListComponent } from './approvalRequest-list.component';
import { ApprovalRequestCreateComponent } from './approvalRequest-create.component';
import { ApprovalRequestEditComponent } from './approvalRequest-edit.component';
import { ApprovalRequestViewComponent } from './approvalRequest-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ApprovalRequests'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ApprovalRequestListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ApprovalRequestListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ApprovalRequestCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ApprovalRequestEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ApprovalRequestViewComponent 
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
export class ApprovalRequestRoutingModule { } 
 