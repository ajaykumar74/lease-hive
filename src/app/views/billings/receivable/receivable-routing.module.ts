import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ReceivableListComponent } from './receivable-list.component';
import { ReceivableCreateComponent } from './receivable-create.component';
import { ReceivableEditComponent } from './receivable-edit.component';
import { ReceivableViewComponent } from './receivable-view.component';
import { ReceivablesAgeingComponent } from './receivables-ageing.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Receivables'
    },
    children: [
      {
        path: 'open',
        canActivate: [AuthGuard],
        component: ReceivableListComponent,
        data: {
          title: 'Open Receivables',
          openReceivables: true
        }
      },
      {
        path: 'overdue',
        canActivate: [AuthGuard],
        component: ReceivableListComponent,
        data: {
          title: 'Overdue Receivables',
          overdueReceivables: true
        }
      },
      {
        path: 'ageing',
        canActivate: [AuthGuard],
        component: ReceivablesAgeingComponent,
        data: {
          title: 'Receivables Ageing Analysis'
        }
      },
      {
        path: '',
        canActivate: [AuthGuard],
        component: ReceivableListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ReceivableListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ReceivableCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ReceivableEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ReceivableViewComponent 
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
export class ReceivableRoutingModule { }
