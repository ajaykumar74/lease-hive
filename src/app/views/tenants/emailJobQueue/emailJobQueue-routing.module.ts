import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { EmailJobQueueListComponent } from './emailJobQueue-list.component';
import { EmailJobQueueCreateComponent } from './emailJobQueue-create.component';
import { EmailJobQueueEditComponent } from './emailJobQueue-edit.component';
import { EmailJobQueueViewComponent } from './emailJobQueue-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'EmailJobQueues'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: EmailJobQueueListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: EmailJobQueueListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: EmailJobQueueCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: EmailJobQueueEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: EmailJobQueueViewComponent 
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
export class EmailJobQueueRoutingModule { } 
 