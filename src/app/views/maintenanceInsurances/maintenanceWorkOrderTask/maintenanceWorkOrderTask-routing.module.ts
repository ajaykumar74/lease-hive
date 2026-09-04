import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceWorkOrderTaskListComponent } from './maintenanceWorkOrderTask-list.component';
import { MaintenanceWorkOrderTaskCreateComponent } from './maintenanceWorkOrderTask-create.component';
import { MaintenanceWorkOrderTaskEditComponent } from './maintenanceWorkOrderTask-edit.component';
import { MaintenanceWorkOrderTaskViewComponent } from './maintenanceWorkOrderTask-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceWorkOrderTasks'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderTaskListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderTaskListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderTaskCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderTaskEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderTaskViewComponent 
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
export class MaintenanceWorkOrderTaskRoutingModule { } 
 