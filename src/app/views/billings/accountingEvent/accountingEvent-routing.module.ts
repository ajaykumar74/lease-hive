import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AccountingEventListComponent } from './accountingEvent-list.component';
import { AccountingEventCreateComponent } from './accountingEvent-create.component';
import { AccountingEventEditComponent } from './accountingEvent-edit.component';
import { AccountingEventViewComponent } from './accountingEvent-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AccountingEvents'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AccountingEventListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AccountingEventListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AccountingEventCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AccountingEventEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AccountingEventViewComponent 
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
export class AccountingEventRoutingModule { } 
 