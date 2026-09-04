import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ExcessUsageAssessmentListComponent } from './excessUsageAssessment-list.component';
import { ExcessUsageAssessmentCreateComponent } from './excessUsageAssessment-create.component';
import { ExcessUsageAssessmentEditComponent } from './excessUsageAssessment-edit.component';
import { ExcessUsageAssessmentViewComponent } from './excessUsageAssessment-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ExcessUsageAssessments'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ExcessUsageAssessmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ExcessUsageAssessmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ExcessUsageAssessmentCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ExcessUsageAssessmentEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ExcessUsageAssessmentViewComponent 
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
export class ExcessUsageAssessmentRoutingModule { } 
 