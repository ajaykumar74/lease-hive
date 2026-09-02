import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractTerminationChargeListComponent } from './contractTerminationCharge-list.component';
import { ContractTerminationChargeCreateComponent } from './contractTerminationCharge-create.component';
import { ContractTerminationChargeEditComponent } from './contractTerminationCharge-edit.component';
import { ContractTerminationChargeViewComponent } from './contractTerminationCharge-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractTerminationCharges'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractTerminationChargeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractTerminationChargeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractTerminationChargeCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractTerminationChargeEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractTerminationChargeViewComponent 
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
export class ContractTerminationChargeRoutingModule { } 
 