import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { QuoteDiscountListComponent } from './quoteDiscount-list.component';
import { QuoteDiscountCreateComponent } from './quoteDiscount-create.component';
import { QuoteDiscountEditComponent } from './quoteDiscount-edit.component';
import { QuoteDiscountViewComponent } from './quoteDiscount-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'QuoteDiscounts'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: QuoteDiscountListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: QuoteDiscountListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: QuoteDiscountCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: QuoteDiscountEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: QuoteDiscountViewComponent 
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
export class QuoteDiscountRoutingModule { } 
 