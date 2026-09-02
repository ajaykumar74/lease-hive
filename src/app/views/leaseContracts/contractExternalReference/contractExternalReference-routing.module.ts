import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractExternalReferenceListComponent } from './contractExternalReference-list.component';
import { ContractExternalReferenceCreateComponent } from './contractExternalReference-create.component';
import { ContractExternalReferenceEditComponent } from './contractExternalReference-edit.component';
import { ContractExternalReferenceViewComponent } from './contractExternalReference-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractExternalReferences'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractExternalReferenceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractExternalReferenceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractExternalReferenceCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractExternalReferenceEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractExternalReferenceViewComponent 
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
export class ContractExternalReferenceRoutingModule { } 
 