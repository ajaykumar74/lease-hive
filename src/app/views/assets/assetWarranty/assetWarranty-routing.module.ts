import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetWarrantyListComponent } from './assetWarranty-list.component';
import { AssetWarrantyCreateComponent } from './assetWarranty-create.component';
import { AssetWarrantyEditComponent } from './assetWarranty-edit.component';
import { AssetWarrantyViewComponent } from './assetWarranty-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Asset Warranties'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetWarrantyListComponent,      
        data: {
          title: 'Asset Warranties'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetWarrantyListComponent,      
        data: {
          title: 'Asset Warranties'
        }
      },
      {
        path: 'asset/:assetId',
        canActivate: [AuthGuard],
        component: AssetWarrantyListComponent,
        data: { title: 'Asset Warranties' }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetWarrantyCreateComponent,
        data: {
          title: 'Create Asset Warranty'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetWarrantyEditComponent,
        data: {
          title: 'Edit Asset Warranty'
        }
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetWarrantyViewComponent,
        data: {
          title: 'View Asset Warranty'
        }
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
export class AssetWarrantyRoutingModule { }
