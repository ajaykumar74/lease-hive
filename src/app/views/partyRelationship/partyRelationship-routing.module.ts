import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PartyRelationshipListComponent } from './partyRelationship-list.component';
import { PartyRelationshipCreateComponent } from './partyRelationship-create.component';
import { PartyRelationshipEditComponent } from './partyRelationship-edit.component';
import { PartyRelationshipViewComponent } from './partyRelationship-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PartyRelationships'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PartyRelationshipListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PartyRelationshipListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PartyRelationshipCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PartyRelationshipEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PartyRelationshipViewComponent 
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
export class PartyRelationshipRoutingModule { } 
 