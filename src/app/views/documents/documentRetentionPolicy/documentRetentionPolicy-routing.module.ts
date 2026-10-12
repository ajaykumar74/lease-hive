import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DocumentRetentionPolicyListComponent } from './documentRetentionPolicy-list.component';
import { DocumentRetentionPolicyCreateComponent } from './documentRetentionPolicy-create.component';
import { DocumentRetentionPolicyEditComponent } from './documentRetentionPolicy-edit.component';
import { DocumentRetentionPolicyViewComponent } from './documentRetentionPolicy-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DocumentRetentionPolicys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DocumentRetentionPolicyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DocumentRetentionPolicyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DocumentRetentionPolicyCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DocumentRetentionPolicyEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DocumentRetentionPolicyViewComponent 
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
export class DocumentRetentionPolicyRoutingModule { } 
 