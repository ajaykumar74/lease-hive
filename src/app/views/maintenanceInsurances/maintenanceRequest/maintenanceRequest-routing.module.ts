import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceRequestListComponent } from './maintenanceRequest-list.component';
import { MaintenanceRequestCreateComponent } from './maintenanceRequest-create.component';
import { MaintenanceRequestEditComponent } from './maintenanceRequest-edit.component';
import { MaintenanceRequestViewComponent } from './maintenanceRequest-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceRequests'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceRequestListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceRequestListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceRequestCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceRequestEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceRequestViewComponent 
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
export class MaintenanceRequestRoutingModule { } 
 