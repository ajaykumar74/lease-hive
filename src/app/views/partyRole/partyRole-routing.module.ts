import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PartyRoleListComponent } from './partyRole-list.component';
import { PartyRoleCreateComponent } from './partyRole-create.component';
import { PartyRoleEditComponent } from './partyRole-edit.component';
import { PartyRoleViewComponent } from './partyRole-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PartyRoles'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PartyRoleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PartyRoleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PartyRoleCreateComponent,
        data: {
          title: 'Create'
        }
      },
      { path: 'party/:partyId/create', canActivate: [AuthGuard], component: PartyRoleCreateComponent, data: { title: 'Create' } },
      { path: 'party/:partyId/edit/:id', canActivate: [AuthGuard], component: PartyRoleEditComponent },
      { path: 'party/:partyId/view/:id', canActivate: [AuthGuard], component: PartyRoleViewComponent },
      { path: 'party/:partyId', canActivate: [AuthGuard], component: PartyRoleListComponent, data: { title: 'List' } },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PartyRoleEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PartyRoleViewComponent 
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
export class PartyRoleRoutingModule { } 
 
