import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsuranceCoverageTypeListComponent } from './insuranceCoverageType-list.component';
import { InsuranceCoverageTypeCreateComponent } from './insuranceCoverageType-create.component';
import { InsuranceCoverageTypeEditComponent } from './insuranceCoverageType-edit.component';
import { InsuranceCoverageTypeViewComponent } from './insuranceCoverageType-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsuranceCoverageTypes'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsuranceCoverageTypeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsuranceCoverageTypeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsuranceCoverageTypeCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsuranceCoverageTypeEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsuranceCoverageTypeViewComponent 
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
export class InsuranceCoverageTypeRoutingModule { } 
 