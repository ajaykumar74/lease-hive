import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsurancePolicyListComponent } from './insurancePolicy-list.component';
import { InsurancePolicyCreateComponent } from './insurancePolicy-create.component';
import { InsurancePolicyEditComponent } from './insurancePolicy-edit.component';
import { InsurancePolicyViewComponent } from './insurancePolicy-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsurancePolicys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsurancePolicyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsurancePolicyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsurancePolicyCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsurancePolicyEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsurancePolicyViewComponent 
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
export class InsurancePolicyRoutingModule { } 
 