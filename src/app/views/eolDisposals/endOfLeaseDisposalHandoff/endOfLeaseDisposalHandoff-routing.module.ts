import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { EndOfLeaseDisposalHandoffListComponent } from './endOfLeaseDisposalHandoff-list.component';
import { EndOfLeaseDisposalHandoffCreateComponent } from './endOfLeaseDisposalHandoff-create.component';
import { EndOfLeaseDisposalHandoffEditComponent } from './endOfLeaseDisposalHandoff-edit.component';
import { EndOfLeaseDisposalHandoffViewComponent } from './endOfLeaseDisposalHandoff-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'EndOfLeaseDisposalHandoffs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalHandoffCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalHandoffEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalHandoffViewComponent 
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
export class EndOfLeaseDisposalHandoffRoutingModule { } 
 