import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsuranceClaimSettlementListComponent } from './insuranceClaimSettlement-list.component';
import { InsuranceClaimSettlementCreateComponent } from './insuranceClaimSettlement-create.component';
import { InsuranceClaimSettlementEditComponent } from './insuranceClaimSettlement-edit.component';
import { InsuranceClaimSettlementViewComponent } from './insuranceClaimSettlement-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsuranceClaimSettlements'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsuranceClaimSettlementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsuranceClaimSettlementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsuranceClaimSettlementCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsuranceClaimSettlementEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsuranceClaimSettlementViewComponent 
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
export class InsuranceClaimSettlementRoutingModule { } 
 