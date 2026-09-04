import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsurancePolicyEndorsementListComponent } from './insurancePolicyEndorsement-list.component';
import { InsurancePolicyEndorsementCreateComponent } from './insurancePolicyEndorsement-create.component';
import { InsurancePolicyEndorsementEditComponent } from './insurancePolicyEndorsement-edit.component';
import { InsurancePolicyEndorsementViewComponent } from './insurancePolicyEndorsement-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsurancePolicyEndorsements'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsurancePolicyEndorsementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsurancePolicyEndorsementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsurancePolicyEndorsementCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsurancePolicyEndorsementEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsurancePolicyEndorsementViewComponent 
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
export class InsurancePolicyEndorsementRoutingModule { } 
 