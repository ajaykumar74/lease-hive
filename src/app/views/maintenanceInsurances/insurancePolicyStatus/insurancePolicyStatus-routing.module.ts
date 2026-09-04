import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsurancePolicyStatusListComponent } from './insurancePolicyStatus-list.component';
import { InsurancePolicyStatusCreateComponent } from './insurancePolicyStatus-create.component';
import { InsurancePolicyStatusEditComponent } from './insurancePolicyStatus-edit.component';
import { InsurancePolicyStatusViewComponent } from './insurancePolicyStatus-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsurancePolicyStatuss'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsurancePolicyStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsurancePolicyStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsurancePolicyStatusCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsurancePolicyStatusEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsurancePolicyStatusViewComponent 
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
export class InsurancePolicyStatusRoutingModule { } 
 