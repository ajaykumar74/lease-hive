import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContactListComponent } from './contact-list.component';
import { ContactCreateComponent } from './contact-create.component';
import { ContactEditComponent } from './contact-edit.component';
import { ContactViewComponent } from './contact-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Contacts'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContactListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContactListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContactCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContactEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContactViewComponent 
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
export class ContactRoutingModule { } 
 