import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CreditLimitListComponent } from './creditLimit-list.component';
import { CreditLimitCreateComponent } from './creditLimit-create.component';
import { CreditLimitEditComponent } from './creditLimit-edit.component';
import { CreditLimitViewComponent } from './creditLimit-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CreditLimits'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CreditLimitListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CreditLimitListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreditLimitCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CreditLimitEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CreditLimitViewComponent 
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
export class CreditLimitRoutingModule { } 
 