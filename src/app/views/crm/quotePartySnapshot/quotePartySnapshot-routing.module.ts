import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { QuotePartySnapshotListComponent } from './quotePartySnapshot-list.component';
import { QuotePartySnapshotCreateComponent } from './quotePartySnapshot-create.component';
import { QuotePartySnapshotEditComponent } from './quotePartySnapshot-edit.component';
import { QuotePartySnapshotViewComponent } from './quotePartySnapshot-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'QuotePartySnapshots'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: QuotePartySnapshotListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: QuotePartySnapshotListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: QuotePartySnapshotCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: QuotePartySnapshotEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: QuotePartySnapshotViewComponent 
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
export class QuotePartySnapshotRoutingModule { } 
 