import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenancePlanListComponent } from './maintenancePlan-list.component';
import { MaintenancePlanCreateComponent } from './maintenancePlan-create.component';
import { MaintenancePlanEditComponent } from './maintenancePlan-edit.component';
import { MaintenancePlanViewComponent } from './maintenancePlan-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenancePlans'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenancePlanListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenancePlanListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenancePlanCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenancePlanEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenancePlanViewComponent 
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
export class MaintenancePlanRoutingModule { } 
 