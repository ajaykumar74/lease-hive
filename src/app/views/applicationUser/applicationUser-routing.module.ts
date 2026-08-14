import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ApplicationUserListComponent } from './applicationUser-list.component';
import { ApplicationUserCreateComponent } from './applicationUser-create.component';
import { ApplicationUserEditComponent } from './applicationUser-edit.component';
import { ApplicationUserViewComponent } from './applicationUser-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ApplicationUsers'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ApplicationUserListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ApplicationUserListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ApplicationUserCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ApplicationUserEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ApplicationUserViewComponent 
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
export class ApplicationUserRoutingModule { } 
 