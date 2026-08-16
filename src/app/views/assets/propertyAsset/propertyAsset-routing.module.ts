import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PropertyAssetListComponent } from './propertyAsset-list.component';
import { PropertyAssetCreateComponent } from './propertyAsset-create.component';
import { PropertyAssetEditComponent } from './propertyAsset-edit.component';
import { PropertyAssetViewComponent } from './propertyAsset-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PropertyAssets'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PropertyAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PropertyAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PropertyAssetCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PropertyAssetEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PropertyAssetViewComponent 
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
export class PropertyAssetRoutingModule { } 
 