import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ReturnAssessmentListComponent } from './returnAssessment-list.component';
import { ReturnAssessmentCreateComponent } from './returnAssessment-create.component';
import { ReturnAssessmentEditComponent } from './returnAssessment-edit.component';
import { ReturnAssessmentViewComponent } from './returnAssessment-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ReturnAssessments'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ReturnAssessmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ReturnAssessmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ReturnAssessmentCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ReturnAssessmentEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ReturnAssessmentViewComponent 
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
export class ReturnAssessmentRoutingModule { } 
 