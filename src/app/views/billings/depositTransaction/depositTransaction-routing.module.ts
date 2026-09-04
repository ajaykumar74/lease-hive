import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DepositTransactionListComponent } from './depositTransaction-list.component';
import { DepositTransactionCreateComponent } from './depositTransaction-create.component';
import { DepositTransactionEditComponent } from './depositTransaction-edit.component';
import { DepositTransactionViewComponent } from './depositTransaction-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DepositTransactions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DepositTransactionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DepositTransactionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DepositTransactionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DepositTransactionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DepositTransactionViewComponent 
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
export class DepositTransactionRoutingModule { } 
 