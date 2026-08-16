import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetAttributeOptionListComponent } from './assetAttributeOption-list.component';
import { AssetAttributeOptionCreateComponent } from './assetAttributeOption-create.component';
import { AssetAttributeOptionEditComponent } from './assetAttributeOption-edit.component';
import { AssetAttributeOptionViewComponent } from './assetAttributeOption-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetAttributeOptions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetAttributeOptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetAttributeOptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetAttributeOptionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetAttributeOptionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetAttributeOptionViewComponent 
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
export class AssetAttributeOptionRoutingModule { } 
 