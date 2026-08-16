import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetMeasureReadingListComponent } from './assetMeasureReading-list.component';
import { AssetMeasureReadingCreateComponent } from './assetMeasureReading-create.component';
import { AssetMeasureReadingEditComponent } from './assetMeasureReading-edit.component';
import { AssetMeasureReadingViewComponent } from './assetMeasureReading-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetMeasureReadings'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetMeasureReadingListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetMeasureReadingListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetMeasureReadingCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetMeasureReadingEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetMeasureReadingViewComponent 
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
export class AssetMeasureReadingRoutingModule { } 
 