import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DocumentListComponent } from './document-list.component';
import { DocumentCreateComponent } from './document-create.component';
import { DocumentEditComponent } from './document-edit.component';
import { DocumentViewComponent } from './document-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'documents'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DocumentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DocumentListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DocumentCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DocumentEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DocumentViewComponent 
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
export class DocumentRoutingModule { } 
 