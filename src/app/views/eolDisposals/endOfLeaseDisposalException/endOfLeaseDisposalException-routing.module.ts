import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { EndOfLeaseDisposalExceptionListComponent } from './endOfLeaseDisposalException-list.component';
import { EndOfLeaseDisposalExceptionCreateComponent } from './endOfLeaseDisposalException-create.component';
import { EndOfLeaseDisposalExceptionEditComponent } from './endOfLeaseDisposalException-edit.component';
import { EndOfLeaseDisposalExceptionViewComponent } from './endOfLeaseDisposalException-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'EndOfLeaseDisposalExceptions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalExceptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalExceptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalExceptionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalExceptionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalExceptionViewComponent 
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
export class EndOfLeaseDisposalExceptionRoutingModule { } 
 