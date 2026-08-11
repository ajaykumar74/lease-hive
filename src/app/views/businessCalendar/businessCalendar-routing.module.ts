import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { BusinessCalendarListComponent } from './businessCalendar-list.component';
import { BusinessCalendarCreateComponent } from './businessCalendar-create.component';
import { BusinessCalendarEditComponent } from './businessCalendar-edit.component';
import { BusinessCalendarViewComponent } from './businessCalendar-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'BusinessCalendars'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: BusinessCalendarListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: BusinessCalendarListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: BusinessCalendarCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: BusinessCalendarEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: BusinessCalendarViewComponent 
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
export class BusinessCalendarRoutingModule { } 
 