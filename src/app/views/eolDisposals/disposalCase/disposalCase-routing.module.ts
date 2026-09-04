import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DisposalCaseListComponent } from './disposalCase-list.component';
import { DisposalCaseCreateComponent } from './disposalCase-create.component';
import { DisposalCaseEditComponent } from './disposalCase-edit.component';
import { DisposalCaseViewComponent } from './disposalCase-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DisposalCases'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DisposalCaseListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DisposalCaseListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DisposalCaseCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DisposalCaseEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DisposalCaseViewComponent 
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
export class DisposalCaseRoutingModule { } 
 