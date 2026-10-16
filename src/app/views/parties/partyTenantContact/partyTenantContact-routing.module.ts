import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PartyTenantContactListComponent } from './partyTenantContact-list.component';
import { PartyTenantContactCreateComponent } from './partyTenantContact-create.component';
import { PartyTenantContactEditComponent } from './partyTenantContact-edit.component';
import { PartyTenantContactViewComponent } from './partyTenantContact-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PartyTenantContacts'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PartyTenantContactListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PartyTenantContactListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PartyTenantContactCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PartyTenantContactEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PartyTenantContactViewComponent 
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
export class PartyTenantContactRoutingModule { } 
 