import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { FeatureListComponent } from './feature-list.component';
import { FeatureCreateComponent } from './feature-create.component';
import { FeatureEditComponent } from './feature-edit.component';
import { FeatureViewComponent } from './feature-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Feature Definitions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: FeatureListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: FeatureListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: FeatureCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: FeatureEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: FeatureViewComponent 
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
export class FeatureRoutingModule { } 
 
