import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceWorkOrderServiceListComponent } from './maintenanceWorkOrderService-list.component';
import { MaintenanceWorkOrderServiceCreateComponent } from './maintenanceWorkOrderService-create.component';
import { MaintenanceWorkOrderServiceEditComponent } from './maintenanceWorkOrderService-edit.component';
import { MaintenanceWorkOrderServiceViewComponent } from './maintenanceWorkOrderService-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceWorkOrderServices'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderServiceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderServiceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderServiceCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderServiceEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderServiceViewComponent 
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
export class MaintenanceWorkOrderServiceRoutingModule { } 
 