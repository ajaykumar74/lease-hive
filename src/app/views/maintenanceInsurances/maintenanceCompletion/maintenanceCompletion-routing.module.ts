import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { MaintenanceCompletionListComponent } from './maintenanceCompletion-list.component';
import { MaintenanceCompletionCreateComponent } from './maintenanceCompletion-create.component';
import { MaintenanceCompletionEditComponent } from './maintenanceCompletion-edit.component';
import { MaintenanceCompletionViewComponent } from './maintenanceCompletion-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'MaintenanceCompletions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: MaintenanceCompletionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: MaintenanceCompletionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: MaintenanceCompletionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: MaintenanceCompletionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: MaintenanceCompletionViewComponent 
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
export class MaintenanceCompletionRoutingModule { } 
 