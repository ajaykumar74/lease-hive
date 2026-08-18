import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CreditConditionListComponent } from './creditCondition-list.component';
import { CreditConditionCreateComponent } from './creditCondition-create.component';
import { CreditConditionEditComponent } from './creditCondition-edit.component';
import { CreditConditionViewComponent } from './creditCondition-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CreditConditions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CreditConditionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CreditConditionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreditConditionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CreditConditionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CreditConditionViewComponent 
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
export class CreditConditionRoutingModule { } 
 