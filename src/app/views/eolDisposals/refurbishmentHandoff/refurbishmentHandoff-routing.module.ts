import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { RefurbishmentHandoffListComponent } from './refurbishmentHandoff-list.component';
import { RefurbishmentHandoffCreateComponent } from './refurbishmentHandoff-create.component';
import { RefurbishmentHandoffEditComponent } from './refurbishmentHandoff-edit.component';
import { RefurbishmentHandoffViewComponent } from './refurbishmentHandoff-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'RefurbishmentHandoffs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: RefurbishmentHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: RefurbishmentHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: RefurbishmentHandoffCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: RefurbishmentHandoffEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: RefurbishmentHandoffViewComponent 
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
export class RefurbishmentHandoffRoutingModule { } 
 