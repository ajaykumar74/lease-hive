import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsuranceRenewalListComponent } from './insuranceRenewal-list.component';
import { InsuranceRenewalCreateComponent } from './insuranceRenewal-create.component';
import { InsuranceRenewalEditComponent } from './insuranceRenewal-edit.component';
import { InsuranceRenewalViewComponent } from './insuranceRenewal-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsuranceRenewals'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsuranceRenewalListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsuranceRenewalListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsuranceRenewalCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsuranceRenewalEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsuranceRenewalViewComponent 
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
export class InsuranceRenewalRoutingModule { } 
 