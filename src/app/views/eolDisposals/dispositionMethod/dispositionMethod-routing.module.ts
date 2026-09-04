import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DispositionMethodListComponent } from './dispositionMethod-list.component';
import { DispositionMethodCreateComponent } from './dispositionMethod-create.component';
import { DispositionMethodEditComponent } from './dispositionMethod-edit.component';
import { DispositionMethodViewComponent } from './dispositionMethod-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DispositionMethods'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DispositionMethodListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DispositionMethodListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DispositionMethodCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DispositionMethodEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DispositionMethodViewComponent 
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
export class DispositionMethodRoutingModule { } 
 