import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ProspectListComponent } from './prospect-list.component';
import { ProspectCreateComponent } from './prospect-create.component';
import { ProspectEditComponent } from './prospect-edit.component';
import { ProspectViewComponent } from './prospect-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Prospects'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ProspectListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ProspectListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ProspectCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ProspectEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ProspectViewComponent 
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
export class ProspectRoutingModule { } 
 