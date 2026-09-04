import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DisposalValuationReferenceListComponent } from './disposalValuationReference-list.component';
import { DisposalValuationReferenceCreateComponent } from './disposalValuationReference-create.component';
import { DisposalValuationReferenceEditComponent } from './disposalValuationReference-edit.component';
import { DisposalValuationReferenceViewComponent } from './disposalValuationReference-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DisposalValuationReferences'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DisposalValuationReferenceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DisposalValuationReferenceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DisposalValuationReferenceCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DisposalValuationReferenceEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DisposalValuationReferenceViewComponent 
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
export class DisposalValuationReferenceRoutingModule { } 
 