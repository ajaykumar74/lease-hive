import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { TenantFeatureListComponent } from './tenantFeature-list.component';
import { TenantFeatureCreateComponent } from './tenantFeature-create.component';
import { TenantFeatureEditComponent } from './tenantFeature-edit.component';
import { TenantFeatureViewComponent } from './tenantFeature-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'TenantFeatures'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: TenantFeatureListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: TenantFeatureListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: TenantFeatureCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: TenantFeatureEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: TenantFeatureViewComponent 
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
export class TenantFeatureRoutingModule { } 
 