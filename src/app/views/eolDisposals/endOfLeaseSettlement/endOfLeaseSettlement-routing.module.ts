import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { EndOfLeaseSettlementListComponent } from './endOfLeaseSettlement-list.component';
import { EndOfLeaseSettlementCreateComponent } from './endOfLeaseSettlement-create.component';
import { EndOfLeaseSettlementEditComponent } from './endOfLeaseSettlement-edit.component';
import { EndOfLeaseSettlementViewComponent } from './endOfLeaseSettlement-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'EndOfLeaseSettlements'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: EndOfLeaseSettlementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: EndOfLeaseSettlementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: EndOfLeaseSettlementCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: EndOfLeaseSettlementEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: EndOfLeaseSettlementViewComponent 
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
export class EndOfLeaseSettlementRoutingModule { } 
 