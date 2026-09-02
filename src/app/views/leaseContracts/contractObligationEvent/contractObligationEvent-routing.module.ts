import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractObligationEventListComponent } from './contractObligationEvent-list.component';
import { ContractObligationEventCreateComponent } from './contractObligationEvent-create.component';
import { ContractObligationEventEditComponent } from './contractObligationEvent-edit.component';
import { ContractObligationEventViewComponent } from './contractObligationEvent-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractObligationEvents'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractObligationEventListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractObligationEventListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractObligationEventCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractObligationEventEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractObligationEventViewComponent 
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
export class ContractObligationEventRoutingModule { } 
 