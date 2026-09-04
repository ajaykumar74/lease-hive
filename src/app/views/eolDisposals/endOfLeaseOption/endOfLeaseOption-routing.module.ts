import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { EndOfLeaseOptionListComponent } from './endOfLeaseOption-list.component';
import { EndOfLeaseOptionCreateComponent } from './endOfLeaseOption-create.component';
import { EndOfLeaseOptionEditComponent } from './endOfLeaseOption-edit.component';
import { EndOfLeaseOptionViewComponent } from './endOfLeaseOption-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'EndOfLeaseOptions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: EndOfLeaseOptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: EndOfLeaseOptionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: EndOfLeaseOptionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: EndOfLeaseOptionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: EndOfLeaseOptionViewComponent 
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
export class EndOfLeaseOptionRoutingModule { } 
 