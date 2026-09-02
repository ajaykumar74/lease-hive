import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeaseContractTermListComponent } from './leaseContractTerm-list.component';
import { LeaseContractTermCreateComponent } from './leaseContractTerm-create.component';
import { LeaseContractTermEditComponent } from './leaseContractTerm-edit.component';
import { LeaseContractTermViewComponent } from './leaseContractTerm-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeaseContractTerms'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeaseContractTermListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeaseContractTermListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeaseContractTermCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeaseContractTermEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeaseContractTermViewComponent 
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
export class LeaseContractTermRoutingModule { } 
 