import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetLocationHistoryListComponent } from './assetLocationHistory-list.component';
import { AssetLocationHistoryCreateComponent } from './assetLocationHistory-create.component';
import { AssetLocationHistoryEditComponent } from './assetLocationHistory-edit.component';
import { AssetLocationHistoryViewComponent } from './assetLocationHistory-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetLocationHistorys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetLocationHistoryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetLocationHistoryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetLocationHistoryCreateComponent,
        data: {
          title: 'Create'
        }
      },
      {
        path: 'asset/:assetId/create',
        canActivate: [AuthGuard],
        component: AssetLocationHistoryCreateComponent,
        data: { title: 'Create' }
      },
      {
        path: 'asset/:assetId/edit/:id',
        canActivate: [AuthGuard],
        component: AssetLocationHistoryEditComponent
      },
      {
        path: 'asset/:assetId/view/:id',
        canActivate: [AuthGuard],
        component: AssetLocationHistoryViewComponent
      },
      {
        path: 'asset/:assetId',
        canActivate: [AuthGuard],
        component: AssetLocationHistoryListComponent,
        data: { title: 'List' }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetLocationHistoryEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetLocationHistoryViewComponent 
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
export class AssetLocationHistoryRoutingModule { } 
 
