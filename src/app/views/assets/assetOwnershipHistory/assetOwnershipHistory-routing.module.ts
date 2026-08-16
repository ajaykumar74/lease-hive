import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetOwnershipHistoryListComponent } from './assetOwnershipHistory-list.component';
import { AssetOwnershipHistoryCreateComponent } from './assetOwnershipHistory-create.component';
import { AssetOwnershipHistoryEditComponent } from './assetOwnershipHistory-edit.component';
import { AssetOwnershipHistoryViewComponent } from './assetOwnershipHistory-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetOwnershipHistorys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetOwnershipHistoryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetOwnershipHistoryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetOwnershipHistoryCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetOwnershipHistoryEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetOwnershipHistoryViewComponent 
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
export class AssetOwnershipHistoryRoutingModule { } 
 