import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { BankStatementLineListComponent } from './bankStatementLine-list.component';
import { BankStatementLineCreateComponent } from './bankStatementLine-create.component';
import { BankStatementLineEditComponent } from './bankStatementLine-edit.component';
import { BankStatementLineViewComponent } from './bankStatementLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'BankStatementLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: BankStatementLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: BankStatementLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: BankStatementLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: BankStatementLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: BankStatementLineViewComponent 
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
export class BankStatementLineRoutingModule { } 
 