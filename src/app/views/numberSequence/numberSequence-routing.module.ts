import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { NumberSequenceListComponent } from './numberSequence-list.component';
import { NumberSequenceCreateComponent } from './numberSequence-create.component';
import { NumberSequenceEditComponent } from './numberSequence-edit.component';
import { NumberSequenceViewComponent } from './numberSequence-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'NumberSequences'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: NumberSequenceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: NumberSequenceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: NumberSequenceCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: NumberSequenceEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: NumberSequenceViewComponent 
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
export class NumberSequenceRoutingModule { } 
 