import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceExceptionListComponent } from './maintenanceException-list.component';
import { MaintenanceExceptionCreateComponent } from './maintenanceException-create.component';
import { MaintenanceExceptionEditComponent } from './maintenanceException-edit.component';
import { MaintenanceExceptionViewComponent } from './maintenanceException-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceExceptions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceExceptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceExceptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceExceptionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceExceptionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceExceptionViewComponent 
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
export class MaintenanceExceptionRoutingModule { } 
 