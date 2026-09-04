import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetDowntimeListComponent } from './assetDowntime-list.component';
import { AssetDowntimeCreateComponent } from './assetDowntime-create.component';
import { AssetDowntimeEditComponent } from './assetDowntime-edit.component';
import { AssetDowntimeViewComponent } from './assetDowntime-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetDowntimes'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetDowntimeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetDowntimeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetDowntimeCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetDowntimeEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetDowntimeViewComponent 
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
export class AssetDowntimeRoutingModule { } 
 