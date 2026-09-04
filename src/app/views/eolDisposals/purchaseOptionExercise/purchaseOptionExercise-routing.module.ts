import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PurchaseOptionExerciseListComponent } from './purchaseOptionExercise-list.component';
import { PurchaseOptionExerciseCreateComponent } from './purchaseOptionExercise-create.component';
import { PurchaseOptionExerciseEditComponent } from './purchaseOptionExercise-edit.component';
import { PurchaseOptionExerciseViewComponent } from './purchaseOptionExercise-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PurchaseOptionExercises'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PurchaseOptionExerciseListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PurchaseOptionExerciseListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PurchaseOptionExerciseCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PurchaseOptionExerciseEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PurchaseOptionExerciseViewComponent 
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
export class PurchaseOptionExerciseRoutingModule { } 
 