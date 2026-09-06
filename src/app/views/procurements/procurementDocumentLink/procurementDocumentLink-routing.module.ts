import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ProcurementDocumentLinkListComponent } from './procurementDocumentLink-list.component';
import { ProcurementDocumentLinkCreateComponent } from './procurementDocumentLink-create.component';
import { ProcurementDocumentLinkEditComponent } from './procurementDocumentLink-edit.component';
import { ProcurementDocumentLinkViewComponent } from './procurementDocumentLink-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ProcurementDocumentLinks'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ProcurementDocumentLinkListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ProcurementDocumentLinkListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ProcurementDocumentLinkCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ProcurementDocumentLinkEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ProcurementDocumentLinkViewComponent 
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
export class ProcurementDocumentLinkRoutingModule { } 
 