import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ProcurementExceptionListComponent } from './procurementException-list.component';
import { ProcurementExceptionCreateComponent } from './procurementException-create.component';
import { ProcurementExceptionEditComponent } from './procurementException-edit.component';
import { ProcurementExceptionViewComponent } from './procurementException-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ProcurementExceptions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ProcurementExceptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ProcurementExceptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ProcurementExceptionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ProcurementExceptionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ProcurementExceptionViewComponent 
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
export class ProcurementExceptionRoutingModule { } 
 