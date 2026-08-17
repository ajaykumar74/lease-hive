import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CreditDecisionListComponent } from './creditDecision-list.component';
import { CreditDecisionCreateComponent } from './creditDecision-create.component';
import { CreditDecisionEditComponent } from './creditDecision-edit.component';
import { CreditDecisionViewComponent } from './creditDecision-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CreditDecisions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CreditDecisionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CreditDecisionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreditDecisionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CreditDecisionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CreditDecisionViewComponent 
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
export class CreditDecisionRoutingModule { } 
 