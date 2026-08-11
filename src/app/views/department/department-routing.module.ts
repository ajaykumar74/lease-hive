import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DepartmentListComponent } from './department-list.component';
import { DepartmentCreateComponent } from './department-create.component';
import { DepartmentEditComponent } from './department-edit.component';
import { DepartmentViewComponent } from './department-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Departments'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DepartmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DepartmentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DepartmentCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DepartmentEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DepartmentViewComponent 
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
export class DepartmentRoutingModule { } 
 