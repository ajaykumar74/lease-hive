import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetComplianceTypeListComponent } from './assetComplianceType-list.component';
import { AssetComplianceTypeCreateComponent } from './assetComplianceType-create.component';
import { AssetComplianceTypeEditComponent } from './assetComplianceType-edit.component';
import { AssetComplianceTypeViewComponent } from './assetComplianceType-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetComplianceTypes'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetComplianceTypeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetComplianceTypeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetComplianceTypeCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetComplianceTypeEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetComplianceTypeViewComponent 
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
export class AssetComplianceTypeRoutingModule { } 
 