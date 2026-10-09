import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { TenantNotificationListComponent } from './tenantNotification-list.component';
import { TenantNotificationCreateComponent } from './tenantNotification-create.component';
import { TenantNotificationEditComponent } from './tenantNotification-edit.component';
import { TenantNotificationViewComponent } from './tenantNotification-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Email templates'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: TenantNotificationListComponent,      
        data: {
          title: 'Email templates'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: TenantNotificationListComponent,      
        data: {
          title: 'Email templates'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: TenantNotificationCreateComponent,
        data: {
          title: 'Create email template'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: TenantNotificationEditComponent,
        data: { title: 'Edit email template' }
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: TenantNotificationViewComponent,
        data: { title: 'View email template' }
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
export class TenantNotificationRoutingModule { } 
 
