import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ServiceAgreementListComponent } from './serviceAgreement-list.component';
import { ServiceAgreementCreateComponent } from './serviceAgreement-create.component';
import { ServiceAgreementEditComponent } from './serviceAgreement-edit.component';
import { ServiceAgreementViewComponent } from './serviceAgreement-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ServiceAgreements'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ServiceAgreementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ServiceAgreementListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ServiceAgreementCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ServiceAgreementEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ServiceAgreementViewComponent 
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
export class ServiceAgreementRoutingModule { } 
 