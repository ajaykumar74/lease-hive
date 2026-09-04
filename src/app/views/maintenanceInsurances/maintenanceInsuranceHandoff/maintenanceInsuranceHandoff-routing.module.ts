import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceInsuranceHandoffListComponent } from './maintenanceInsuranceHandoff-list.component';
import { MaintenanceInsuranceHandoffCreateComponent } from './maintenanceInsuranceHandoff-create.component';
import { MaintenanceInsuranceHandoffEditComponent } from './maintenanceInsuranceHandoff-edit.component';
import { MaintenanceInsuranceHandoffViewComponent } from './maintenanceInsuranceHandoff-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceInsuranceHandoffs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceHandoffCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceHandoffEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceHandoffViewComponent 
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
export class MaintenanceInsuranceHandoffRoutingModule { } 
 