import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceWorkOrderLabourListComponent } from './maintenanceWorkOrderLabour-list.component';
import { MaintenanceWorkOrderLabourCreateComponent } from './maintenanceWorkOrderLabour-create.component';
import { MaintenanceWorkOrderLabourEditComponent } from './maintenanceWorkOrderLabour-edit.component';
import { MaintenanceWorkOrderLabourViewComponent } from './maintenanceWorkOrderLabour-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceWorkOrderLabours'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderLabourListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderLabourListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderLabourCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderLabourEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderLabourViewComponent 
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
export class MaintenanceWorkOrderLabourRoutingModule { } 
 