import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetStatusHistoryListComponent } from './assetStatusHistory-list.component';
import { AssetStatusHistoryCreateComponent } from './assetStatusHistory-create.component';
import { AssetStatusHistoryEditComponent } from './assetStatusHistory-edit.component';
import { AssetStatusHistoryViewComponent } from './assetStatusHistory-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetStatusHistorys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetStatusHistoryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetStatusHistoryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetStatusHistoryCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetStatusHistoryEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetStatusHistoryViewComponent 
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
export class AssetStatusHistoryRoutingModule { } 
 