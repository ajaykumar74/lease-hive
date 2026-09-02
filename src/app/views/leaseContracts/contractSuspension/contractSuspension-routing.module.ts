import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractSuspensionListComponent } from './contractSuspension-list.component';
import { ContractSuspensionCreateComponent } from './contractSuspension-create.component';
import { ContractSuspensionEditComponent } from './contractSuspension-edit.component';
import { ContractSuspensionViewComponent } from './contractSuspension-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractSuspensions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractSuspensionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractSuspensionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractSuspensionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractSuspensionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractSuspensionViewComponent 
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
export class ContractSuspensionRoutingModule { } 
 