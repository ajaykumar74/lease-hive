import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SupportTicketMessageListComponent } from './supportTicketMessage-list.component';
import { SupportTicketMessageCreateComponent } from './supportTicketMessage-create.component';
import { SupportTicketMessageEditComponent } from './supportTicketMessage-edit.component';
import { SupportTicketMessageViewComponent } from './supportTicketMessage-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SupportTicketMessages'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SupportTicketMessageListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SupportTicketMessageListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SupportTicketMessageCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SupportTicketMessageEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SupportTicketMessageViewComponent 
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
export class SupportTicketMessageRoutingModule { } 
 