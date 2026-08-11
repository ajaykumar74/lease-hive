import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@/shared/auth-guard.service';
import { NotificationListComponent } from './notification-list.component';
import { NotificationViewComponent } from './notification-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Notifications'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: NotificationListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: NotificationListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: NotificationViewComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
