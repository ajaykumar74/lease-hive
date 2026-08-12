import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PartyLocationListComponent } from './partyLocation-list.component';
import { PartyLocationCreateComponent } from './partyLocation-create.component';
import { PartyLocationEditComponent } from './partyLocation-edit.component';
import { PartyLocationViewComponent } from './partyLocation-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PartyLocations'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PartyLocationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PartyLocationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PartyLocationCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PartyLocationEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PartyLocationViewComponent 
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
export class PartyLocationRoutingModule { } 
 