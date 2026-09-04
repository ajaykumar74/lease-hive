import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { FinanceExceptionListComponent } from './financeException-list.component';
import { FinanceExceptionCreateComponent } from './financeException-create.component';
import { FinanceExceptionEditComponent } from './financeException-edit.component';
import { FinanceExceptionViewComponent } from './financeException-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'FinanceExceptions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: FinanceExceptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: FinanceExceptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: FinanceExceptionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: FinanceExceptionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: FinanceExceptionViewComponent 
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
export class FinanceExceptionRoutingModule { } 
 