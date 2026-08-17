import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CreditFinancialSnapshotListComponent } from './creditFinancialSnapshot-list.component';
import { CreditFinancialSnapshotCreateComponent } from './creditFinancialSnapshot-create.component';
import { CreditFinancialSnapshotEditComponent } from './creditFinancialSnapshot-edit.component';
import { CreditFinancialSnapshotViewComponent } from './creditFinancialSnapshot-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CreditFinancialSnapshots'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CreditFinancialSnapshotListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CreditFinancialSnapshotListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreditFinancialSnapshotCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CreditFinancialSnapshotEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CreditFinancialSnapshotViewComponent 
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
export class CreditFinancialSnapshotRoutingModule { } 
 