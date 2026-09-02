import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LeaseAssetAllocationEventListComponent } from './leaseAssetAllocationEvent-list.component';
import { LeaseAssetAllocationEventCreateComponent } from './leaseAssetAllocationEvent-create.component';
import { LeaseAssetAllocationEventEditComponent } from './leaseAssetAllocationEvent-edit.component';
import { LeaseAssetAllocationEventViewComponent } from './leaseAssetAllocationEvent-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'LeaseAssetAllocationEvents'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LeaseAssetAllocationEventListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LeaseAssetAllocationEventListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LeaseAssetAllocationEventCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LeaseAssetAllocationEventEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LeaseAssetAllocationEventViewComponent 
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
export class LeaseAssetAllocationEventRoutingModule { } 
 