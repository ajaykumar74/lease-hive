import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { EquipmentAssetListComponent } from './equipmentAsset-list.component';
import { EquipmentAssetCreateComponent } from './equipmentAsset-create.component';
import { EquipmentAssetEditComponent } from './equipmentAsset-edit.component';
import { EquipmentAssetViewComponent } from './equipmentAsset-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'EquipmentAssets'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: EquipmentAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: EquipmentAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: EquipmentAssetCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: EquipmentAssetEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: EquipmentAssetViewComponent 
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
export class EquipmentAssetRoutingModule { } 
 