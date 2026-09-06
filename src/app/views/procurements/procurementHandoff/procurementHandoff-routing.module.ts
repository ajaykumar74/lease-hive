import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ProcurementHandoffListComponent } from './procurementHandoff-list.component';
import { ProcurementHandoffCreateComponent } from './procurementHandoff-create.component';
import { ProcurementHandoffEditComponent } from './procurementHandoff-edit.component';
import { ProcurementHandoffViewComponent } from './procurementHandoff-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ProcurementHandoffs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ProcurementHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ProcurementHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ProcurementHandoffCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ProcurementHandoffEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ProcurementHandoffViewComponent 
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
export class ProcurementHandoffRoutingModule { } 
 