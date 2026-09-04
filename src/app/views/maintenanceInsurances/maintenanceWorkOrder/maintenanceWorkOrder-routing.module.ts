import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceWorkOrderListComponent } from './maintenanceWorkOrder-list.component';
import { MaintenanceWorkOrderCreateComponent } from './maintenanceWorkOrder-create.component';
import { MaintenanceWorkOrderEditComponent } from './maintenanceWorkOrder-edit.component';
import { MaintenanceWorkOrderViewComponent } from './maintenanceWorkOrder-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceWorkOrders'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceWorkOrderViewComponent 
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
export class MaintenanceWorkOrderRoutingModule { } 
 