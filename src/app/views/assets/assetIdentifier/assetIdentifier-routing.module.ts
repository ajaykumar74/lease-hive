import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetIdentifierListComponent } from './assetIdentifier-list.component';
import { AssetIdentifierCreateComponent } from './assetIdentifier-create.component';
import { AssetIdentifierEditComponent } from './assetIdentifier-edit.component';
import { AssetIdentifierViewComponent } from './assetIdentifier-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetIdentifiers'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetIdentifierListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetIdentifierListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetIdentifierCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetIdentifierEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetIdentifierViewComponent 
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
export class AssetIdentifierRoutingModule { } 
 