import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { SettlementChargeTypeListComponent } from './settlementChargeType-list.component';
import { SettlementChargeTypeCreateComponent } from './settlementChargeType-create.component';
import { SettlementChargeTypeEditComponent } from './settlementChargeType-edit.component';
import { SettlementChargeTypeViewComponent } from './settlementChargeType-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SettlementChargeTypes'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SettlementChargeTypeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: SettlementChargeTypeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SettlementChargeTypeCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SettlementChargeTypeEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: SettlementChargeTypeViewComponent 
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
export class SettlementChargeTypeRoutingModule { } 
 