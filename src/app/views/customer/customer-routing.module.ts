import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CustomerListComponent } from './customer-list.component';
import { CustomerCreateComponent } from './customer-create.component';
import { CustomerEditComponent } from './customer-edit.component';
import { CustomerViewComponent } from './customer-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Customers'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CustomerListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CustomerListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CustomerCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CustomerEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CustomerViewComponent 
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
export class CustomerRoutingModule { } 
 