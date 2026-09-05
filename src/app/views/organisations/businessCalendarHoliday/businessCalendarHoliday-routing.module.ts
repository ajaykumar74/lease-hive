import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { BusinessCalendarHolidayListComponent } from './businessCalendarHoliday-list.component';
import { BusinessCalendarHolidayCreateComponent } from './businessCalendarHoliday-create.component';
import { BusinessCalendarHolidayEditComponent } from './businessCalendarHoliday-edit.component';
import { BusinessCalendarHolidayViewComponent } from './businessCalendarHoliday-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'BusinessCalendarHolidays'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: BusinessCalendarHolidayListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: BusinessCalendarHolidayListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: BusinessCalendarHolidayCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: BusinessCalendarHolidayEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: BusinessCalendarHolidayViewComponent 
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
export class BusinessCalendarHolidayRoutingModule { } 
 