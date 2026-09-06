import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { RFQListComponent } from './rFQ-list.component';
import { RFQCreateComponent } from './rFQ-create.component';
import { RFQEditComponent } from './rFQ-edit.component';
import { RFQViewComponent } from './rFQ-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'RFQs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: RFQListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: RFQListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: RFQCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: RFQEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: RFQViewComponent 
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
export class RFQRoutingModule { } 
 