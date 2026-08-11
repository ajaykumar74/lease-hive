import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ExceptionLogListComponent } from './exceptionLog-list.component';
import { ExceptionLogViewComponent } from './exceptionLog-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ExceptionLogs'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ExceptionLogListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ExceptionLogListComponent,      
        data: {
          title: 'List'
        }
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ExceptionLogViewComponent 
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
export class ExceptionLogRoutingModule { } 
 