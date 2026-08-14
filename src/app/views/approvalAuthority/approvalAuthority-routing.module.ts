import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ApprovalAuthorityListComponent } from './approvalAuthority-list.component';
import { ApprovalAuthorityCreateComponent } from './approvalAuthority-create.component';
import { ApprovalAuthorityEditComponent } from './approvalAuthority-edit.component';
import { ApprovalAuthorityViewComponent } from './approvalAuthority-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ApprovalAuthoritys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ApprovalAuthorityListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ApprovalAuthorityListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ApprovalAuthorityCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ApprovalAuthorityEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ApprovalAuthorityViewComponent 
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
export class ApprovalAuthorityRoutingModule { } 
 