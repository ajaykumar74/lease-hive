import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ServiceAgreementCoverageListComponent } from './serviceAgreementCoverage-list.component';
import { ServiceAgreementCoverageCreateComponent } from './serviceAgreementCoverage-create.component';
import { ServiceAgreementCoverageEditComponent } from './serviceAgreementCoverage-edit.component';
import { ServiceAgreementCoverageViewComponent } from './serviceAgreementCoverage-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ServiceAgreementCoverages'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ServiceAgreementCoverageListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ServiceAgreementCoverageListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ServiceAgreementCoverageCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ServiceAgreementCoverageEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ServiceAgreementCoverageViewComponent 
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
export class ServiceAgreementCoverageRoutingModule { } 
 