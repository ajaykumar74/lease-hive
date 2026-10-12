import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DocumentAccessLogListComponent } from './documentAccessLog-list.component';
import { DocumentAccessLogCreateComponent } from './documentAccessLog-create.component';
import { DocumentAccessLogEditComponent } from './documentAccessLog-edit.component';
import { DocumentAccessLogViewComponent } from './documentAccessLog-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DocumentAccessLogs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DocumentAccessLogListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DocumentAccessLogListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DocumentAccessLogCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DocumentAccessLogEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DocumentAccessLogViewComponent 
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
export class DocumentAccessLogRoutingModule { } 
 