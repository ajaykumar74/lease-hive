import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CreditBureauResultListComponent } from './creditBureauResult-list.component';
import { CreditBureauResultCreateComponent } from './creditBureauResult-create.component';
import { CreditBureauResultEditComponent } from './creditBureauResult-edit.component';
import { CreditBureauResultViewComponent } from './creditBureauResult-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CreditBureauResults'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CreditBureauResultListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CreditBureauResultListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreditBureauResultCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CreditBureauResultEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CreditBureauResultViewComponent 
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
export class CreditBureauResultRoutingModule { } 
 