import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { JournalEntryLineListComponent } from './journalEntryLine-list.component';
import { JournalEntryLineCreateComponent } from './journalEntryLine-create.component';
import { JournalEntryLineEditComponent } from './journalEntryLine-edit.component';
import { JournalEntryLineViewComponent } from './journalEntryLine-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'JournalEntryLines'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: JournalEntryLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: JournalEntryLineListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: JournalEntryLineCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: JournalEntryLineEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: JournalEntryLineViewComponent 
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
export class JournalEntryLineRoutingModule { } 
 