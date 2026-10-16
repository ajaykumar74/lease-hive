import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SupportTicketStatusHistoryListComponent } from './supportTicketStatusHistory-list.component';
import { SupportTicketStatusHistoryCreateComponent } from './supportTicketStatusHistory-create.component';
import { SupportTicketStatusHistoryEditComponent } from './supportTicketStatusHistory-edit.component';
import { SupportTicketStatusHistoryViewComponent } from './supportTicketStatusHistory-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SupportTicketStatusHistorys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SupportTicketStatusHistoryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SupportTicketStatusHistoryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SupportTicketStatusHistoryCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SupportTicketStatusHistoryEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SupportTicketStatusHistoryViewComponent 
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
export class SupportTicketStatusHistoryRoutingModule { } 
 