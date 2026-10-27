import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { QuotePricingScenarioListComponent } from './quotePricingScenario-list.component';
import { QuotePricingScenarioCreateComponent } from './quotePricingScenario-create.component';
import { QuotePricingScenarioEditComponent } from './quotePricingScenario-edit.component';
import { QuotePricingScenarioViewComponent } from './quotePricingScenario-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'QuotePricingScenarios'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: QuotePricingScenarioListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: QuotePricingScenarioListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: QuotePricingScenarioCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: QuotePricingScenarioEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: QuotePricingScenarioViewComponent 
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
export class QuotePricingScenarioRoutingModule { } 
 