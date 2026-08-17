import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { QuoteAcceptanceListComponent } from './quoteAcceptance-list.component';
import { QuoteAcceptanceCreateComponent } from './quoteAcceptance-create.component';
import { QuoteAcceptanceEditComponent } from './quoteAcceptance-edit.component';
import { QuoteAcceptanceViewComponent } from './quoteAcceptance-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'QuoteAcceptances'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: QuoteAcceptanceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: QuoteAcceptanceListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: QuoteAcceptanceCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: QuoteAcceptanceEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: QuoteAcceptanceViewComponent 
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
export class QuoteAcceptanceRoutingModule { } 
 