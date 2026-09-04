import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ReturnItemChecklistListComponent } from './returnItemChecklist-list.component';
import { ReturnItemChecklistCreateComponent } from './returnItemChecklist-create.component';
import { ReturnItemChecklistEditComponent } from './returnItemChecklist-edit.component';
import { ReturnItemChecklistViewComponent } from './returnItemChecklist-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ReturnItemChecklists'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ReturnItemChecklistListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ReturnItemChecklistListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ReturnItemChecklistCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ReturnItemChecklistEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ReturnItemChecklistViewComponent 
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
export class ReturnItemChecklistRoutingModule { } 
 