import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ITAssetListComponent } from './iTAsset-list.component';
import { ITAssetCreateComponent } from './iTAsset-create.component';
import { ITAssetEditComponent } from './iTAsset-edit.component';
import { ITAssetViewComponent } from './iTAsset-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ITAssets'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ITAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ITAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ITAssetCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ITAssetEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ITAssetViewComponent 
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
export class ITAssetRoutingModule { } 
 