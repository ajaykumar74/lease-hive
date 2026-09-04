import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CustomerStatementSnapshotListComponent } from './customerStatementSnapshot-list.component';
import { CustomerStatementSnapshotCreateComponent } from './customerStatementSnapshot-create.component';
import { CustomerStatementSnapshotEditComponent } from './customerStatementSnapshot-edit.component';
import { CustomerStatementSnapshotViewComponent } from './customerStatementSnapshot-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CustomerStatementSnapshots'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CustomerStatementSnapshotListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CustomerStatementSnapshotListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CustomerStatementSnapshotCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CustomerStatementSnapshotEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CustomerStatementSnapshotViewComponent 
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
export class CustomerStatementSnapshotRoutingModule { } 
 