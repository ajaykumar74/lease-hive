import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetLifecycleEventListComponent } from './assetLifecycleEvent-list.component';
import { AssetLifecycleEventCreateComponent } from './assetLifecycleEvent-create.component';
import { AssetLifecycleEventEditComponent } from './assetLifecycleEvent-edit.component';
import { AssetLifecycleEventViewComponent } from './assetLifecycleEvent-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetLifecycleEvents'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetLifecycleEventListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetLifecycleEventListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetLifecycleEventCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetLifecycleEventEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetLifecycleEventViewComponent 
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
export class AssetLifecycleEventRoutingModule { } 
 