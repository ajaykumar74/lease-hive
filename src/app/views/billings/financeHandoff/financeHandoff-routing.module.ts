import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { FinanceHandoffListComponent } from './financeHandoff-list.component';
import { FinanceHandoffCreateComponent } from './financeHandoff-create.component';
import { FinanceHandoffEditComponent } from './financeHandoff-edit.component';
import { FinanceHandoffViewComponent } from './financeHandoff-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'FinanceHandoffs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: FinanceHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: FinanceHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: FinanceHandoffCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: FinanceHandoffEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: FinanceHandoffViewComponent 
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
export class FinanceHandoffRoutingModule { } 
 