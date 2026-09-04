import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { InsuranceRecoveryListComponent } from './insuranceRecovery-list.component';
import { InsuranceRecoveryCreateComponent } from './insuranceRecovery-create.component';
import { InsuranceRecoveryEditComponent } from './insuranceRecovery-edit.component';
import { InsuranceRecoveryViewComponent } from './insuranceRecovery-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'InsuranceRecoverys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: InsuranceRecoveryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: InsuranceRecoveryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: InsuranceRecoveryCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: InsuranceRecoveryEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: InsuranceRecoveryViewComponent 
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
export class InsuranceRecoveryRoutingModule { } 
 