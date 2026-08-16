import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetAttributeDefinitionListComponent } from './assetAttributeDefinition-list.component';
import { AssetAttributeDefinitionCreateComponent } from './assetAttributeDefinition-create.component';
import { AssetAttributeDefinitionEditComponent } from './assetAttributeDefinition-edit.component';
import { AssetAttributeDefinitionViewComponent } from './assetAttributeDefinition-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetAttributeDefinitions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetAttributeDefinitionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetAttributeDefinitionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetAttributeDefinitionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetAttributeDefinitionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetAttributeDefinitionViewComponent 
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
export class AssetAttributeDefinitionRoutingModule { } 
 