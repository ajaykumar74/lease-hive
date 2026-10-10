import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { EmailJobQueueListComponent } from './emailJobQueue-list.component';
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
