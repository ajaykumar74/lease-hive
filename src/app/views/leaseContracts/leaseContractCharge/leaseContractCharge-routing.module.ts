import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeaseContractChargeListComponent } from './leaseContractCharge-list.component';
import { LeaseContractChargeCreateComponent } from './leaseContractCharge-create.component';
import { LeaseContractChargeEditComponent } from './leaseContractCharge-edit.component';
import { LeaseContractChargeViewComponent } from './leaseContractCharge-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeaseContractCharges'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeaseContractChargeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeaseContractChargeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeaseContractChargeCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeaseContractChargeEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeaseContractChargeViewComponent 
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
export class LeaseContractChargeRoutingModule { } 
 