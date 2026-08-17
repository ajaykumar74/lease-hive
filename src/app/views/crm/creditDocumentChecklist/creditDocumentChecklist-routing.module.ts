import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CreditDocumentChecklistListComponent } from './creditDocumentChecklist-list.component';
import { CreditDocumentChecklistCreateComponent } from './creditDocumentChecklist-create.component';
import { CreditDocumentChecklistEditComponent } from './creditDocumentChecklist-edit.component';
import { CreditDocumentChecklistViewComponent } from './creditDocumentChecklist-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CreditDocumentChecklists'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CreditDocumentChecklistListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CreditDocumentChecklistListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreditDocumentChecklistCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CreditDocumentChecklistEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CreditDocumentChecklistViewComponent 
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
export class CreditDocumentChecklistRoutingModule { } 
 