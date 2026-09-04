import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsuranceIncidentListComponent } from './insuranceIncident-list.component';
import { InsuranceIncidentCreateComponent } from './insuranceIncident-create.component';
import { InsuranceIncidentEditComponent } from './insuranceIncident-edit.component';
import { InsuranceIncidentViewComponent } from './insuranceIncident-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsuranceIncidents'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsuranceIncidentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsuranceIncidentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsuranceIncidentCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsuranceIncidentEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsuranceIncidentViewComponent 
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
export class InsuranceIncidentRoutingModule { } 
 