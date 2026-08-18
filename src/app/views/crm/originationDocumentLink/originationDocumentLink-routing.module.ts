import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { OriginationDocumentLinkListComponent } from './originationDocumentLink-list.component';
import { OriginationDocumentLinkCreateComponent } from './originationDocumentLink-create.component';
import { OriginationDocumentLinkEditComponent } from './originationDocumentLink-edit.component';
import { OriginationDocumentLinkViewComponent } from './originationDocumentLink-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'OriginationDocumentLinks'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: OriginationDocumentLinkListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: OriginationDocumentLinkListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: OriginationDocumentLinkCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: OriginationDocumentLinkEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: OriginationDocumentLinkViewComponent 
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
export class OriginationDocumentLinkRoutingModule { } 
 