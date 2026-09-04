import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { FinanceAccountMappingListComponent } from './financeAccountMapping-list.component';
import { FinanceAccountMappingCreateComponent } from './financeAccountMapping-create.component';
import { FinanceAccountMappingEditComponent } from './financeAccountMapping-edit.component';
import { FinanceAccountMappingViewComponent } from './financeAccountMapping-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'FinanceAccountMappings'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: FinanceAccountMappingListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: FinanceAccountMappingListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: FinanceAccountMappingCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: FinanceAccountMappingEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: FinanceAccountMappingViewComponent 
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
export class FinanceAccountMappingRoutingModule { } 
 