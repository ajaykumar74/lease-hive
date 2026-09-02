import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeaseContractPartyListComponent } from './leaseContractParty-list.component';
import { LeaseContractPartyCreateComponent } from './leaseContractParty-create.component';
import { LeaseContractPartyEditComponent } from './leaseContractParty-edit.component';
import { LeaseContractPartyViewComponent } from './leaseContractParty-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeaseContractPartys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeaseContractPartyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeaseContractPartyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeaseContractPartyCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeaseContractPartyEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeaseContractPartyViewComponent 
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
export class LeaseContractPartyRoutingModule { } 
 