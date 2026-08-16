import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetAttributeValueListComponent } from './assetAttributeValue-list.component';
import { AssetAttributeValueCreateComponent } from './assetAttributeValue-create.component';
import { AssetAttributeValueEditComponent } from './assetAttributeValue-edit.component';
import { AssetAttributeValueViewComponent } from './assetAttributeValue-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetAttributeValues'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetAttributeValueListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetAttributeValueListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetAttributeValueCreateComponent,
        data: {
          title: 'Create'
        }
      },
      {
        path: 'asset/:assetId/create',
        canActivate: [AuthGuard],
        component: AssetAttributeValueCreateComponent,
        data: { title: 'Create' }
      },
      {
        path: 'asset/:assetId/edit/:id',
        canActivate: [AuthGuard],
        component: AssetAttributeValueEditComponent
      },
      {
        path: 'asset/:assetId/view/:id',
        canActivate: [AuthGuard],
        component: AssetAttributeValueViewComponent
      },
      {
        path: 'asset/:assetId',
        canActivate: [AuthGuard],
        component: AssetAttributeValueListComponent,
        data: { title: 'List' }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetAttributeValueEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetAttributeValueViewComponent 
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
export class AssetAttributeValueRoutingModule { } 
 
