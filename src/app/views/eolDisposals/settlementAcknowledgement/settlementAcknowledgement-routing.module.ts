import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SettlementAcknowledgementListComponent } from './settlementAcknowledgement-list.component';
import { SettlementAcknowledgementCreateComponent } from './settlementAcknowledgement-create.component';
import { SettlementAcknowledgementEditComponent } from './settlementAcknowledgement-edit.component';
import { SettlementAcknowledgementViewComponent } from './settlementAcknowledgement-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SettlementAcknowledgements'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SettlementAcknowledgementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SettlementAcknowledgementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SettlementAcknowledgementCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SettlementAcknowledgementEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SettlementAcknowledgementViewComponent 
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
export class SettlementAcknowledgementRoutingModule { } 
 