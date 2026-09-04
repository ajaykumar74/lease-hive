import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DebitNoteListComponent } from './debitNote-list.component';
import { DebitNoteCreateComponent } from './debitNote-create.component';
import { DebitNoteEditComponent } from './debitNote-edit.component';
import { DebitNoteViewComponent } from './debitNote-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DebitNotes'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DebitNoteListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DebitNoteListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DebitNoteCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DebitNoteEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DebitNoteViewComponent 
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
export class DebitNoteRoutingModule { } 
 