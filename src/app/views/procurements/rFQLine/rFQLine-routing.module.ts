import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { RFQLineListComponent } from './rFQLine-list.component';
import { RFQLineCreateComponent } from './rFQLine-create.component';
import { RFQLineEditComponent } from './rFQLine-edit.component';
import { RFQLineViewComponent } from './rFQLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'RFQLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: RFQLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: RFQLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: RFQLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: RFQLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: RFQLineViewComponent 
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
export class RFQLineRoutingModule { } 
 