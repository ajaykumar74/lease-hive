import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractAmendmentChangeListComponent } from './contractAmendmentChange-list.component';
import { ContractAmendmentChangeCreateComponent } from './contractAmendmentChange-create.component';
import { ContractAmendmentChangeEditComponent } from './contractAmendmentChange-edit.component';
import { ContractAmendmentChangeViewComponent } from './contractAmendmentChange-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractAmendmentChanges'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractAmendmentChangeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractAmendmentChangeListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractAmendmentChangeCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractAmendmentChangeEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractAmendmentChangeViewComponent 
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
export class ContractAmendmentChangeRoutingModule { } 
 