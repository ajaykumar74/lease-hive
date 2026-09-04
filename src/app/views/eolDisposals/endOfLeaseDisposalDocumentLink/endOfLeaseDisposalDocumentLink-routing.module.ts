import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { EndOfLeaseDisposalDocumentLinkListComponent } from './endOfLeaseDisposalDocumentLink-list.component';
import { EndOfLeaseDisposalDocumentLinkCreateComponent } from './endOfLeaseDisposalDocumentLink-create.component';
import { EndOfLeaseDisposalDocumentLinkEditComponent } from './endOfLeaseDisposalDocumentLink-edit.component';
import { EndOfLeaseDisposalDocumentLinkViewComponent } from './endOfLeaseDisposalDocumentLink-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'EndOfLeaseDisposalDocumentLinks'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalDocumentLinkListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalDocumentLinkListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalDocumentLinkCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalDocumentLinkEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: EndOfLeaseDisposalDocumentLinkViewComponent 
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
export class EndOfLeaseDisposalDocumentLinkRoutingModule { } 
 