import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { TenantNotificationRecipientRuleListComponent } from './tenantNotificationRecipientRule-list.component';
import { TenantNotificationRecipientRuleCreateComponent } from './tenantNotificationRecipientRule-create.component';
import { TenantNotificationRecipientRuleEditComponent } from './tenantNotificationRecipientRule-edit.component';
import { TenantNotificationRecipientRuleViewComponent } from './tenantNotificationRecipientRule-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Notification recipient rules'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: TenantNotificationRecipientRuleListComponent,      
        data: {
          title: 'Recipient rules'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: TenantNotificationRecipientRuleListComponent,      
        data: {
          title: 'Recipient rules'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: TenantNotificationRecipientRuleCreateComponent,
        data: {
          title: 'Create recipient rule'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: TenantNotificationRecipientRuleEditComponent,
        data: { title: 'Edit recipient rule' }
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: TenantNotificationRecipientRuleViewComponent,
        data: { title: 'View recipient rule' }
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
export class TenantNotificationRecipientRuleRoutingModule { } 
 
