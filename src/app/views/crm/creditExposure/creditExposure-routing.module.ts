import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CreditExposureListComponent } from './creditExposure-list.component';
import { CreditExposureCreateComponent } from './creditExposure-create.component';
import { CreditExposureEditComponent } from './creditExposure-edit.component';
import { CreditExposureViewComponent } from './creditExposure-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CreditExposures'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CreditExposureListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CreditExposureListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreditExposureCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CreditExposureEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CreditExposureViewComponent 
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
export class CreditExposureRoutingModule { } 
 