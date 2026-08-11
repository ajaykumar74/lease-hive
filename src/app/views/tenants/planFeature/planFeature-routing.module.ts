import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PlanFeatureListComponent } from './planFeature-list.component';
import { PlanFeatureCreateComponent } from './planFeature-create.component';
import { PlanFeatureEditComponent } from './planFeature-edit.component';
import { PlanFeatureViewComponent } from './planFeature-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PlanFeatures'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PlanFeatureListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PlanFeatureListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PlanFeatureCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PlanFeatureEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PlanFeatureViewComponent 
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
export class PlanFeatureRoutingModule { } 
 