import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeaseContractDepositListComponent } from './leaseContractDeposit-list.component';
import { LeaseContractDepositCreateComponent } from './leaseContractDeposit-create.component';
import { LeaseContractDepositEditComponent } from './leaseContractDeposit-edit.component';
import { LeaseContractDepositViewComponent } from './leaseContractDeposit-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeaseContractDeposits'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeaseContractDepositListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeaseContractDepositListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeaseContractDepositCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeaseContractDepositEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeaseContractDepositViewComponent 
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
export class LeaseContractDepositRoutingModule { } 
 