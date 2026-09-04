import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetMaintenancePlanListComponent } from './assetMaintenancePlan-list.component';
import { AssetMaintenancePlanCreateComponent } from './assetMaintenancePlan-create.component';
import { AssetMaintenancePlanEditComponent } from './assetMaintenancePlan-edit.component';
import { AssetMaintenancePlanViewComponent } from './assetMaintenancePlan-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetMaintenancePlans'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetMaintenancePlanListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetMaintenancePlanListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetMaintenancePlanCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetMaintenancePlanEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetMaintenancePlanViewComponent 
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
export class AssetMaintenancePlanRoutingModule { } 
 