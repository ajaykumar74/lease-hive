import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetComplianceRecordListComponent } from './assetComplianceRecord-list.component';
import { AssetComplianceRecordCreateComponent } from './assetComplianceRecord-create.component';
import { AssetComplianceRecordEditComponent } from './assetComplianceRecord-edit.component';
import { AssetComplianceRecordViewComponent } from './assetComplianceRecord-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetComplianceRecords'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetComplianceRecordListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetComplianceRecordListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetComplianceRecordCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetComplianceRecordEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetComplianceRecordViewComponent 
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
export class AssetComplianceRecordRoutingModule { } 
 