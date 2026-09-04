import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceInsuranceDocumentLinkListComponent } from './maintenanceInsuranceDocumentLink-list.component';
import { MaintenanceInsuranceDocumentLinkCreateComponent } from './maintenanceInsuranceDocumentLink-create.component';
import { MaintenanceInsuranceDocumentLinkEditComponent } from './maintenanceInsuranceDocumentLink-edit.component';
import { MaintenanceInsuranceDocumentLinkViewComponent } from './maintenanceInsuranceDocumentLink-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceInsuranceDocumentLinks'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceDocumentLinkListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceDocumentLinkListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceDocumentLinkCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceDocumentLinkEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceInsuranceDocumentLinkViewComponent 
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
export class MaintenanceInsuranceDocumentLinkRoutingModule { } 
 