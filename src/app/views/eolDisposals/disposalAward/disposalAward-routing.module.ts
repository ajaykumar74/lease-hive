import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DisposalAwardListComponent } from './disposalAward-list.component';
import { DisposalAwardCreateComponent } from './disposalAward-create.component';
import { DisposalAwardEditComponent } from './disposalAward-edit.component';
import { DisposalAwardViewComponent } from './disposalAward-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DisposalAwards'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DisposalAwardListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DisposalAwardListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DisposalAwardCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DisposalAwardEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DisposalAwardViewComponent 
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
export class DisposalAwardRoutingModule { } 
 