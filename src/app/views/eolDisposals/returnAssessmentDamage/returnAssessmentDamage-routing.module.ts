import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ReturnAssessmentDamageListComponent } from './returnAssessmentDamage-list.component';
import { ReturnAssessmentDamageCreateComponent } from './returnAssessmentDamage-create.component';
import { ReturnAssessmentDamageEditComponent } from './returnAssessmentDamage-edit.component';
import { ReturnAssessmentDamageViewComponent } from './returnAssessmentDamage-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ReturnAssessmentDamages'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ReturnAssessmentDamageListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ReturnAssessmentDamageListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ReturnAssessmentDamageCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ReturnAssessmentDamageEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ReturnAssessmentDamageViewComponent 
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
export class ReturnAssessmentDamageRoutingModule { } 
 