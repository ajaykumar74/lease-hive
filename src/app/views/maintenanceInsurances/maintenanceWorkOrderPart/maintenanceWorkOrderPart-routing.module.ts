import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceWorkOrderPartListComponent } from './maintenanceWorkOrderPart-list.component';
import { MaintenanceWorkOrderPartCreateComponent } from './maintenanceWorkOrderPart-create.component';
import { MaintenanceWorkOrderPartEditComponent } from './maintenanceWorkOrderPart-edit.component';
import { MaintenanceWorkOrderPartViewComponent } from './maintenanceWorkOrderPart-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceWorkOrderParts'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderPartListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderPartListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderPartCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderPartEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderPartViewComponent 
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
export class MaintenanceWorkOrderPartRoutingModule { } 
 