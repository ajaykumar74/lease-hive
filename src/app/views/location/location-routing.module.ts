import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { LocationListComponent } from './location-list.component';
import { LocationCreateComponent } from './location-create.component';
import { LocationEditComponent } from './location-edit.component';
import { LocationViewComponent } from './location-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Locations'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: LocationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: LocationListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: LocationCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: LocationEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: LocationViewComponent 
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
export class LocationRoutingModule { } 
 