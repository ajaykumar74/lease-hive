import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { VehicleAssetListComponent } from './vehicleAsset-list.component';
import { VehicleAssetCreateComponent } from './vehicleAsset-create.component';
import { VehicleAssetEditComponent } from './vehicleAsset-edit.component';
import { VehicleAssetViewComponent } from './vehicleAsset-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'VehicleAssets'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: VehicleAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: VehicleAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: VehicleAssetCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: VehicleAssetEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: VehicleAssetViewComponent 
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
export class VehicleAssetRoutingModule { } 
 