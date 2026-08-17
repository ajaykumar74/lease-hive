import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeaseRequirementAssetListComponent } from './leaseRequirementAsset-list.component';
import { LeaseRequirementAssetCreateComponent } from './leaseRequirementAsset-create.component';
import { LeaseRequirementAssetEditComponent } from './leaseRequirementAsset-edit.component';
import { LeaseRequirementAssetViewComponent } from './leaseRequirementAsset-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeaseRequirementAssets'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeaseRequirementAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeaseRequirementAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeaseRequirementAssetCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeaseRequirementAssetEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeaseRequirementAssetViewComponent 
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
export class LeaseRequirementAssetRoutingModule { } 
 