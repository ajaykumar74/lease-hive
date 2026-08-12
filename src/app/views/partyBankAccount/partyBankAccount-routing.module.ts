import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PartyBankAccountListComponent } from './partyBankAccount-list.component';
import { PartyBankAccountCreateComponent } from './partyBankAccount-create.component';
import { PartyBankAccountEditComponent } from './partyBankAccount-edit.component';
import { PartyBankAccountViewComponent } from './partyBankAccount-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PartyBankAccounts'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PartyBankAccountListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PartyBankAccountListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PartyBankAccountCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PartyBankAccountEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PartyBankAccountViewComponent 
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
export class PartyBankAccountRoutingModule { } 
 