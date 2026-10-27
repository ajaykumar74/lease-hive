import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { QuoteServiceListComponent } from './quoteService-list.component';
import { QuoteServiceCreateComponent } from './quoteService-create.component';
import { QuoteServiceEditComponent } from './quoteService-edit.component';
import { QuoteServiceViewComponent } from './quoteService-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'QuoteServices'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: QuoteServiceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: QuoteServiceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: QuoteServiceCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: QuoteServiceEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: QuoteServiceViewComponent 
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
export class QuoteServiceRoutingModule { } 
 