import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DocumentVersionListComponent } from './documentVersion-list.component';
import { DocumentVersionCreateComponent } from './documentVersion-create.component';
import { DocumentVersionEditComponent } from './documentVersion-edit.component';
import { DocumentVersionViewComponent } from './documentVersion-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DocumentVersions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DocumentVersionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DocumentVersionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DocumentVersionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DocumentVersionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DocumentVersionViewComponent 
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
export class DocumentVersionRoutingModule { } 
 