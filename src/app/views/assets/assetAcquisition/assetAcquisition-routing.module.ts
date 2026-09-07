import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetAcquisitionListComponent } from './assetAcquisition-list.component';
import { AssetAcquisitionCreateComponent } from './assetAcquisition-create.component';
import { AssetAcquisitionEditComponent } from './assetAcquisition-edit.component';
import { AssetAcquisitionViewComponent } from './assetAcquisition-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetAcquisitions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetAcquisitionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetAcquisitionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetAcquisitionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetAcquisitionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetAcquisitionViewComponent 
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
export class AssetAcquisitionRoutingModule { } 
 