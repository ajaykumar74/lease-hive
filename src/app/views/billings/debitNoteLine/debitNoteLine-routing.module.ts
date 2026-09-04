import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DebitNoteLineListComponent } from './debitNoteLine-list.component';
import { DebitNoteLineCreateComponent } from './debitNoteLine-create.component';
import { DebitNoteLineEditComponent } from './debitNoteLine-edit.component';
import { DebitNoteLineViewComponent } from './debitNoteLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DebitNoteLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DebitNoteLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DebitNoteLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DebitNoteLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DebitNoteLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DebitNoteLineViewComponent 
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
export class DebitNoteLineRoutingModule { } 
 