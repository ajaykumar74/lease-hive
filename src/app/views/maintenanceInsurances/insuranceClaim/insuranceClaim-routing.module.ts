import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsuranceClaimListComponent } from './insuranceClaim-list.component';
import { InsuranceClaimCreateComponent } from './insuranceClaim-create.component';
import { InsuranceClaimEditComponent } from './insuranceClaim-edit.component';
import { InsuranceClaimViewComponent } from './insuranceClaim-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsuranceClaims'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsuranceClaimListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsuranceClaimListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsuranceClaimCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsuranceClaimEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsuranceClaimViewComponent 
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
export class InsuranceClaimRoutingModule { } 
 