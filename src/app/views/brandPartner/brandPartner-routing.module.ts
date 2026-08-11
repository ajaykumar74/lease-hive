import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { BrandPartnerListComponent } from './brandPartner-list.component';
import { BrandPartnerCreateComponent } from './brandPartner-create.component';
import { BrandPartnerEditComponent } from './brandPartner-edit.component';
import { BrandPartnerViewComponent } from './brandPartner-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'BrandPartners'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: BrandPartnerListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: BrandPartnerListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: BrandPartnerCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: BrandPartnerEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: BrandPartnerViewComponent 
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
export class BrandPartnerRoutingModule { } 
 