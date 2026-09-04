import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { DisposalAuctionListComponent } from './disposalAuction-list.component';
import { DisposalAuctionCreateComponent } from './disposalAuction-create.component';
import { DisposalAuctionEditComponent } from './disposalAuction-edit.component';
import { DisposalAuctionViewComponent } from './disposalAuction-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'DisposalAuctions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DisposalAuctionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: DisposalAuctionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: DisposalAuctionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: DisposalAuctionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: DisposalAuctionViewComponent 
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
export class DisposalAuctionRoutingModule { } 
 