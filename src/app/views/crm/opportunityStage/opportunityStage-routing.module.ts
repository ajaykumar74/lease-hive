import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { OpportunityStageListComponent } from './opportunityStage-list.component';
import { OpportunityStageCreateComponent } from './opportunityStage-create.component';
import { OpportunityStageEditComponent } from './opportunityStage-edit.component';
import { OpportunityStageViewComponent } from './opportunityStage-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'OpportunityStages'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: OpportunityStageListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: OpportunityStageListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: OpportunityStageCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: OpportunityStageEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: OpportunityStageViewComponent 
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
export class OpportunityStageRoutingModule { } 
 