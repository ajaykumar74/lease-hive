import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { OriginationHandoffListComponent } from './originationHandoff-list.component';
import { OriginationHandoffCreateComponent } from './originationHandoff-create.component';
import { OriginationHandoffEditComponent } from './originationHandoff-edit.component';
import { OriginationHandoffViewComponent } from './originationHandoff-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'OriginationHandoffs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: OriginationHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: OriginationHandoffListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: OriginationHandoffCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: OriginationHandoffEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: OriginationHandoffViewComponent 
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
export class OriginationHandoffRoutingModule { } 
 