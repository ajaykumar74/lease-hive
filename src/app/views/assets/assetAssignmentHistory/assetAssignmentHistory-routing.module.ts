import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetAssignmentHistoryListComponent } from './assetAssignmentHistory-list.component';
import { AssetAssignmentHistoryCreateComponent } from './assetAssignmentHistory-create.component';
import { AssetAssignmentHistoryEditComponent } from './assetAssignmentHistory-edit.component';
import { AssetAssignmentHistoryViewComponent } from './assetAssignmentHistory-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetAssignmentHistorys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetAssignmentHistoryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetAssignmentHistoryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetAssignmentHistoryCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetAssignmentHistoryEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetAssignmentHistoryViewComponent 
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
export class AssetAssignmentHistoryRoutingModule { } 
 