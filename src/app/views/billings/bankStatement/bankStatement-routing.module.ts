import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { BankStatementListComponent } from './bankStatement-list.component';
import { BankStatementCreateComponent } from './bankStatement-create.component';
import { BankStatementEditComponent } from './bankStatement-edit.component';
import { BankStatementViewComponent } from './bankStatement-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'BankStatements'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: BankStatementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: BankStatementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: BankStatementCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: BankStatementEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: BankStatementViewComponent 
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
export class BankStatementRoutingModule { } 
 