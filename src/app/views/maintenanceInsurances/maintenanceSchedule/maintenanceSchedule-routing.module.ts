import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceScheduleListComponent } from './maintenanceSchedule-list.component';
import { MaintenanceScheduleCreateComponent } from './maintenanceSchedule-create.component';
import { MaintenanceScheduleEditComponent } from './maintenanceSchedule-edit.component';
import { MaintenanceScheduleViewComponent } from './maintenanceSchedule-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceSchedules'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceScheduleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceScheduleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceScheduleCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceScheduleEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceScheduleViewComponent 
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
export class MaintenanceScheduleRoutingModule { } 
 