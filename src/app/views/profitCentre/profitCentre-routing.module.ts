import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ProfitCentreListComponent } from './profitCentre-list.component';
import { ProfitCentreCreateComponent } from './profitCentre-create.component';
import { ProfitCentreEditComponent } from './profitCentre-edit.component';
import { ProfitCentreViewComponent } from './profitCentre-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ProfitCentres'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ProfitCentreListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ProfitCentreListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ProfitCentreCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ProfitCentreEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ProfitCentreViewComponent 
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
export class ProfitCentreRoutingModule { } 
 