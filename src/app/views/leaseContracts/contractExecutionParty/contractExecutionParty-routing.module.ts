import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractExecutionPartyListComponent } from './contractExecutionParty-list.component';
import { ContractExecutionPartyCreateComponent } from './contractExecutionParty-create.component';
import { ContractExecutionPartyEditComponent } from './contractExecutionParty-edit.component';
import { ContractExecutionPartyViewComponent } from './contractExecutionParty-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractExecutionPartys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractExecutionPartyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractExecutionPartyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractExecutionPartyCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractExecutionPartyEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractExecutionPartyViewComponent 
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
export class ContractExecutionPartyRoutingModule { } 
 