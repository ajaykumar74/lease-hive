import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { QuoteStatusListComponent } from './quoteStatus-list.component';
import { QuoteStatusCreateComponent } from './quoteStatus-create.component';
import { QuoteStatusEditComponent } from './quoteStatus-edit.component';
import { QuoteStatusViewComponent } from './quoteStatus-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'QuoteStatuss'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: QuoteStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: QuoteStatusListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: QuoteStatusCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: QuoteStatusEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: QuoteStatusViewComponent 
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
export class QuoteStatusRoutingModule { } 
 