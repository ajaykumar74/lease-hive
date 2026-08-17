import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CreditApplicationStatusListComponent } from './creditApplicationStatus-list.component';
import { CreditApplicationStatusCreateComponent } from './creditApplicationStatus-create.component';
import { CreditApplicationStatusEditComponent } from './creditApplicationStatus-edit.component';
import { CreditApplicationStatusViewComponent } from './creditApplicationStatus-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CreditApplicationStatuss'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CreditApplicationStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CreditApplicationStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreditApplicationStatusCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CreditApplicationStatusEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CreditApplicationStatusViewComponent 
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
export class CreditApplicationStatusRoutingModule { } 
 