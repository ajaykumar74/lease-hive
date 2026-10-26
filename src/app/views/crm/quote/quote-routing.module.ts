import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { QuoteListComponent } from './quote-list.component';
import { QuoteCreateComponent } from './quote-create.component';
import { QuoteEditComponent } from './quote-edit.component';
import { QuoteViewComponent } from './quote-view.component';
import { QuotationWorkspaceComponent } from './quotation-workspace.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Quotes'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: QuoteListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: QuoteListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: QuotationWorkspaceComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: QuotationWorkspaceComponent
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: QuoteViewComponent 
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
export class QuoteRoutingModule { } 
 
