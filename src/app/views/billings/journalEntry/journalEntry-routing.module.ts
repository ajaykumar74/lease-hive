import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { JournalEntryListComponent } from './journalEntry-list.component';
import { JournalEntryCreateComponent } from './journalEntry-create.component';
import { JournalEntryEditComponent } from './journalEntry-edit.component';
import { JournalEntryViewComponent } from './journalEntry-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'JournalEntrys'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: JournalEntryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: JournalEntryListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: JournalEntryCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: JournalEntryEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: JournalEntryViewComponent 
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
export class JournalEntryRoutingModule { } 
 