import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { UploadSessionListComponent } from './uploadSession-list.component';
import { UploadSessionCreateComponent } from './uploadSession-create.component';
import { UploadSessionEditComponent } from './uploadSession-edit.component';
import { UploadSessionViewComponent } from './uploadSession-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'UploadSessions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: UploadSessionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: UploadSessionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: UploadSessionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: UploadSessionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: UploadSessionViewComponent 
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
export class UploadSessionRoutingModule { } 
 