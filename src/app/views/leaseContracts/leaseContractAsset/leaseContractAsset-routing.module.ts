import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeaseContractAssetListComponent } from './leaseContractAsset-list.component';
import { LeaseContractAssetCreateComponent } from './leaseContractAsset-create.component';
import { LeaseContractAssetEditComponent } from './leaseContractAsset-edit.component';
import { LeaseContractAssetViewComponent } from './leaseContractAsset-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeaseContractAssets'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeaseContractAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeaseContractAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeaseContractAssetCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeaseContractAssetEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeaseContractAssetViewComponent 
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
export class LeaseContractAssetRoutingModule { } 
 