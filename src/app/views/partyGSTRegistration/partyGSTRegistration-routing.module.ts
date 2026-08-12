import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PartyGSTRegistrationListComponent } from './partyGSTRegistration-list.component';
import { PartyGSTRegistrationCreateComponent } from './partyGSTRegistration-create.component';
import { PartyGSTRegistrationEditComponent } from './partyGSTRegistration-edit.component';
import { PartyGSTRegistrationViewComponent } from './partyGSTRegistration-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PartyGSTRegistrations'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PartyGSTRegistrationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PartyGSTRegistrationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PartyGSTRegistrationCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PartyGSTRegistrationEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PartyGSTRegistrationViewComponent 
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
export class PartyGSTRegistrationRoutingModule { } 
 