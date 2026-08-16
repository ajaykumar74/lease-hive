import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PartyContactListComponent } from './partyContact-list.component';
import { PartyContactCreateComponent } from './partyContact-create.component';
import { PartyContactEditComponent } from './partyContact-edit.component';
import { PartyContactViewComponent } from './partyContact-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PartyContacts'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PartyContactListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PartyContactListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PartyContactCreateComponent,
        data: {
          title: 'Create'
        }
      },
      { path: 'party/:partyId/create', canActivate: [AuthGuard], component: PartyContactCreateComponent, data: { title: 'Create' } },
      { path: 'party/:partyId/edit/:id', canActivate: [AuthGuard], component: PartyContactEditComponent },
      { path: 'party/:partyId/view/:id', canActivate: [AuthGuard], component: PartyContactViewComponent },
      { path: 'party/:partyId', canActivate: [AuthGuard], component: PartyContactListComponent, data: { title: 'List' } },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PartyContactEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PartyContactViewComponent 
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
export class PartyContactRoutingModule { } 
 
