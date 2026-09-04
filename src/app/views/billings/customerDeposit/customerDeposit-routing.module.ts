import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CustomerDepositListComponent } from './customerDeposit-list.component';
import { CustomerDepositCreateComponent } from './customerDeposit-create.component';
import { CustomerDepositEditComponent } from './customerDeposit-edit.component';
import { CustomerDepositViewComponent } from './customerDeposit-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CustomerDeposits'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CustomerDepositListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CustomerDepositListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CustomerDepositCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CustomerDepositEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CustomerDepositViewComponent 
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
export class CustomerDepositRoutingModule { } 
 