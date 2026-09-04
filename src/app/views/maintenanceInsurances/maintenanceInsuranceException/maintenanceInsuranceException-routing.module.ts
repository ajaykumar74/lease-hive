import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceInsuranceExceptionListComponent } from './maintenanceInsuranceException-list.component';
import { MaintenanceInsuranceExceptionCreateComponent } from './maintenanceInsuranceException-create.component';
import { MaintenanceInsuranceExceptionEditComponent } from './maintenanceInsuranceException-edit.component';
import { MaintenanceInsuranceExceptionViewComponent } from './maintenanceInsuranceException-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceInsuranceExceptions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceExceptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceExceptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceExceptionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceExceptionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceExceptionViewComponent 
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
export class MaintenanceInsuranceExceptionRoutingModule { } 
 