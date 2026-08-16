import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetMeasureDefinitionListComponent } from './assetMeasureDefinition-list.component';
import { AssetMeasureDefinitionCreateComponent } from './assetMeasureDefinition-create.component';
import { AssetMeasureDefinitionEditComponent } from './assetMeasureDefinition-edit.component';
import { AssetMeasureDefinitionViewComponent } from './assetMeasureDefinition-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetMeasureDefinitions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetMeasureDefinitionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetMeasureDefinitionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetMeasureDefinitionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetMeasureDefinitionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetMeasureDefinitionViewComponent 
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
export class AssetMeasureDefinitionRoutingModule { } 
 