import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractRenewalOptionListComponent } from './contractRenewalOption-list.component';
import { ContractRenewalOptionCreateComponent } from './contractRenewalOption-create.component';
import { ContractRenewalOptionEditComponent } from './contractRenewalOption-edit.component';
import { ContractRenewalOptionViewComponent } from './contractRenewalOption-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractRenewalOptions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractRenewalOptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractRenewalOptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractRenewalOptionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractRenewalOptionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractRenewalOptionViewComponent 
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
export class ContractRenewalOptionRoutingModule { } 
 