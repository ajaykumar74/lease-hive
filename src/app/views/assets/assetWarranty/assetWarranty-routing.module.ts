import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetWarrantyListComponent } from './assetWarranty-list.component';
import { AssetWarrantyCreateComponent } from './assetWarranty-create.component';
import { AssetWarrantyEditComponent } from './assetWarranty-edit.component';
import { AssetWarrantyViewComponent } from './assetWarranty-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetWarrantys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetWarrantyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetWarrantyListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetWarrantyCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetWarrantyEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetWarrantyViewComponent 
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
export class AssetWarrantyRoutingModule { } 
 