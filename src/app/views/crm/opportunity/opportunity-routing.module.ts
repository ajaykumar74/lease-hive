import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { OpportunityListComponent } from './opportunity-list.component';
import { OpportunityCreateComponent } from './opportunity-create.component';
import { OpportunityEditComponent } from './opportunity-edit.component';
import { OpportunityViewComponent } from './opportunity-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Opportunitys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: OpportunityListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: OpportunityListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: OpportunityCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: OpportunityEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: OpportunityViewComponent 
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
export class OpportunityRoutingModule { } 
 