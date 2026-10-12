import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DocumentLegalHoldListComponent } from './documentLegalHold-list.component';
import { DocumentLegalHoldCreateComponent } from './documentLegalHold-create.component';
import { DocumentLegalHoldEditComponent } from './documentLegalHold-edit.component';
import { DocumentLegalHoldViewComponent } from './documentLegalHold-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DocumentLegalHolds'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DocumentLegalHoldListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DocumentLegalHoldListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DocumentLegalHoldCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DocumentLegalHoldEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DocumentLegalHoldViewComponent 
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
export class DocumentLegalHoldRoutingModule { } 
 