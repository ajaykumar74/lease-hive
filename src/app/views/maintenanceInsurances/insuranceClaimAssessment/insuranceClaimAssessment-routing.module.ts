import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsuranceClaimAssessmentListComponent } from './insuranceClaimAssessment-list.component';
import { InsuranceClaimAssessmentCreateComponent } from './insuranceClaimAssessment-create.component';
import { InsuranceClaimAssessmentEditComponent } from './insuranceClaimAssessment-edit.component';
import { InsuranceClaimAssessmentViewComponent } from './insuranceClaimAssessment-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsuranceClaimAssessments'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsuranceClaimAssessmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsuranceClaimAssessmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsuranceClaimAssessmentCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsuranceClaimAssessmentEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsuranceClaimAssessmentViewComponent 
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
export class InsuranceClaimAssessmentRoutingModule { } 
 