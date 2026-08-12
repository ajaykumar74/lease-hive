import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PartyCreditProfileListComponent } from './partyCreditProfile-list.component';
import { PartyCreditProfileCreateComponent } from './partyCreditProfile-create.component';
import { PartyCreditProfileEditComponent } from './partyCreditProfile-edit.component';
import { PartyCreditProfileViewComponent } from './partyCreditProfile-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PartyCreditProfiles'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PartyCreditProfileListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PartyCreditProfileListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PartyCreditProfileCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PartyCreditProfileEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PartyCreditProfileViewComponent 
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
export class PartyCreditProfileRoutingModule { } 
 