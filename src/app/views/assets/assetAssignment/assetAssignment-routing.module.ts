import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetAssignmentListComponent } from './assetAssignment-list.component';
import { AssetAssignmentCreateComponent } from './assetAssignment-create.component';
import { AssetAssignmentEditComponent } from './assetAssignment-edit.component';
import { AssetAssignmentViewComponent } from './assetAssignment-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetAssignments'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetAssignmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetAssignmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetAssignmentCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetAssignmentEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetAssignmentViewComponent 
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
export class AssetAssignmentRoutingModule { } 
 