import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsuranceClaimStatusListComponent } from './insuranceClaimStatus-list.component';
import { InsuranceClaimStatusCreateComponent } from './insuranceClaimStatus-create.component';
import { InsuranceClaimStatusEditComponent } from './insuranceClaimStatus-edit.component';
import { InsuranceClaimStatusViewComponent } from './insuranceClaimStatus-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsuranceClaimStatuss'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsuranceClaimStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsuranceClaimStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsuranceClaimStatusCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsuranceClaimStatusEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsuranceClaimStatusViewComponent 
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
export class InsuranceClaimStatusRoutingModule { } 
 