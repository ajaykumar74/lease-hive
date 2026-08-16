import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetInspectionListComponent } from './assetInspection-list.component';
import { AssetInspectionCreateComponent } from './assetInspection-create.component';
import { AssetInspectionEditComponent } from './assetInspection-edit.component';
import { AssetInspectionViewComponent } from './assetInspection-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetInspections'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetInspectionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetInspectionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetInspectionCreateComponent,
        data: {
          title: 'Create'
        }
      },
      {
        path: 'asset/:assetId/create',
        canActivate: [AuthGuard],
        component: AssetInspectionCreateComponent,
        data: { title: 'Create' }
      },
      {
        path: 'asset/:assetId/edit/:id',
        canActivate: [AuthGuard],
        component: AssetInspectionEditComponent
      },
      {
        path: 'asset/:assetId/view/:id',
        canActivate: [AuthGuard],
        component: AssetInspectionViewComponent
      },
      {
        path: 'asset/:assetId',
        canActivate: [AuthGuard],
        component: AssetInspectionListComponent,
        data: { title: 'List' }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetInspectionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetInspectionViewComponent 
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
export class AssetInspectionRoutingModule { } 
 
