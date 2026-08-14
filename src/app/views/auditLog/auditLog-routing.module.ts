import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AuditLogListComponent } from './auditLog-list.component';
import { AuditLogCreateComponent } from './auditLog-create.component';
import { AuditLogEditComponent } from './auditLog-edit.component';
import { AuditLogViewComponent } from './auditLog-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AuditLogs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AuditLogListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AuditLogListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AuditLogCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AuditLogEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AuditLogViewComponent 
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
export class AuditLogRoutingModule { } 
 