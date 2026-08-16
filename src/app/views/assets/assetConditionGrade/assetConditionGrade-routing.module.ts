import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetConditionGradeListComponent } from './assetConditionGrade-list.component';
import { AssetConditionGradeCreateComponent } from './assetConditionGrade-create.component';
import { AssetConditionGradeEditComponent } from './assetConditionGrade-edit.component';
import { AssetConditionGradeViewComponent } from './assetConditionGrade-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetConditionGrades'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetConditionGradeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetConditionGradeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetConditionGradeCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetConditionGradeEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetConditionGradeViewComponent 
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
export class AssetConditionGradeRoutingModule { } 
 