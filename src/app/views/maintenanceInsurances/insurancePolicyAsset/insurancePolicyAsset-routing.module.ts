import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsurancePolicyAssetListComponent } from './insurancePolicyAsset-list.component';
import { InsurancePolicyAssetCreateComponent } from './insurancePolicyAsset-create.component';
import { InsurancePolicyAssetEditComponent } from './insurancePolicyAsset-edit.component';
import { InsurancePolicyAssetViewComponent } from './insurancePolicyAsset-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsurancePolicyAssets'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsurancePolicyAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsurancePolicyAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsurancePolicyAssetCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsurancePolicyAssetEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsurancePolicyAssetViewComponent 
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
export class InsurancePolicyAssetRoutingModule { } 
 