import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CreditApplicantPartyListComponent } from './creditApplicantParty-list.component';
import { CreditApplicantPartyCreateComponent } from './creditApplicantParty-create.component';
import { CreditApplicantPartyEditComponent } from './creditApplicantParty-edit.component';
import { CreditApplicantPartyViewComponent } from './creditApplicantParty-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CreditApplicantPartys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CreditApplicantPartyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CreditApplicantPartyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreditApplicantPartyCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CreditApplicantPartyEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CreditApplicantPartyViewComponent 
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
export class CreditApplicantPartyRoutingModule { } 
 