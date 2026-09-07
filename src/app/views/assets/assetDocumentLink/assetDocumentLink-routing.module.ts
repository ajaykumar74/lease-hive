import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetDocumentLinkListComponent } from './assetDocumentLink-list.component';
import { AssetDocumentLinkCreateComponent } from './assetDocumentLink-create.component';
import { AssetDocumentLinkEditComponent } from './assetDocumentLink-edit.component';
import { AssetDocumentLinkViewComponent } from './assetDocumentLink-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetDocumentLinks'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetDocumentLinkListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetDocumentLinkListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetDocumentLinkCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetDocumentLinkEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetDocumentLinkViewComponent 
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
export class AssetDocumentLinkRoutingModule { } 
 