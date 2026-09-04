import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetWriteOffListComponent } from './assetWriteOff-list.component';
import { AssetWriteOffCreateComponent } from './assetWriteOff-create.component';
import { AssetWriteOffEditComponent } from './assetWriteOff-edit.component';
import { AssetWriteOffViewComponent } from './assetWriteOff-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetWriteOffs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetWriteOffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetWriteOffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetWriteOffCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetWriteOffEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetWriteOffViewComponent 
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
export class AssetWriteOffRoutingModule { } 
 