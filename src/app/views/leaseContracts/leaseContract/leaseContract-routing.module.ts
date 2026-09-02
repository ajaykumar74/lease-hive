import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeaseContractListComponent } from './leaseContract-list.component';
import { LeaseContractCreateComponent } from './leaseContract-create.component';
import { LeaseContractEditComponent } from './leaseContract-edit.component';
import { LeaseContractViewComponent } from './leaseContract-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeaseContracts'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeaseContractListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeaseContractListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeaseContractCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeaseContractEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeaseContractViewComponent 
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
export class LeaseContractRoutingModule { } 
 