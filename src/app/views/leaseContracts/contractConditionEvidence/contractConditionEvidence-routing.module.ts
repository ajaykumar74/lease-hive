import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractConditionEvidenceListComponent } from './contractConditionEvidence-list.component';
import { ContractConditionEvidenceCreateComponent } from './contractConditionEvidence-create.component';
import { ContractConditionEvidenceEditComponent } from './contractConditionEvidence-edit.component';
import { ContractConditionEvidenceViewComponent } from './contractConditionEvidence-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractConditionEvidences'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractConditionEvidenceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractConditionEvidenceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractConditionEvidenceCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractConditionEvidenceEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractConditionEvidenceViewComponent 
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
export class ContractConditionEvidenceRoutingModule { } 
 