import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { QuotePricingScheduleListComponent } from './quotePricingSchedule-list.component';
import { QuotePricingScheduleCreateComponent } from './quotePricingSchedule-create.component';
import { QuotePricingScheduleEditComponent } from './quotePricingSchedule-edit.component';
import { QuotePricingScheduleViewComponent } from './quotePricingSchedule-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'QuotePricingSchedules'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: QuotePricingScheduleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: QuotePricingScheduleListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: QuotePricingScheduleCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: QuotePricingScheduleEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: QuotePricingScheduleViewComponent 
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
export class QuotePricingScheduleRoutingModule { } 
 