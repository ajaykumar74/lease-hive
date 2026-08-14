import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CustomerDepartmentListComponent } from './customerDepartment-list.component';
import { CustomerDepartmentCreateComponent } from './customerDepartment-create.component';
import { CustomerDepartmentEditComponent } from './customerDepartment-edit.component';
import { CustomerDepartmentViewComponent } from './customerDepartment-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CustomerDepartments'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CustomerDepartmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CustomerDepartmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CustomerDepartmentCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CustomerDepartmentEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CustomerDepartmentViewComponent 
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
export class CustomerDepartmentRoutingModule { } 
 