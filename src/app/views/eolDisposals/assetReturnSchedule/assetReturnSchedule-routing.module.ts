import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetReturnScheduleListComponent } from './assetReturnSchedule-list.component';
import { AssetReturnScheduleCreateComponent } from './assetReturnSchedule-create.component';
import { AssetReturnScheduleEditComponent } from './assetReturnSchedule-edit.component';
import { AssetReturnScheduleViewComponent } from './assetReturnSchedule-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetReturnSchedules'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetReturnScheduleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetReturnScheduleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetReturnScheduleCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetReturnScheduleEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetReturnScheduleViewComponent 
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
export class AssetReturnScheduleRoutingModule { } 
 