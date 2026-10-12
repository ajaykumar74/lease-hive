import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DocumentAuditEventListComponent } from './documentAuditEvent-list.component';
import { DocumentAuditEventCreateComponent } from './documentAuditEvent-create.component';
import { DocumentAuditEventEditComponent } from './documentAuditEvent-edit.component';
import { DocumentAuditEventViewComponent } from './documentAuditEvent-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DocumentAuditEvents'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DocumentAuditEventListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DocumentAuditEventListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DocumentAuditEventCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DocumentAuditEventEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DocumentAuditEventViewComponent 
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
export class DocumentAuditEventRoutingModule { } 
 