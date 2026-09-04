import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DisposalOfferListComponent } from './disposalOffer-list.component';
import { DisposalOfferCreateComponent } from './disposalOffer-create.component';
import { DisposalOfferEditComponent } from './disposalOffer-edit.component';
import { DisposalOfferViewComponent } from './disposalOffer-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DisposalOffers'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DisposalOfferListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DisposalOfferListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DisposalOfferCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DisposalOfferEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DisposalOfferViewComponent 
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
export class DisposalOfferRoutingModule { } 
 