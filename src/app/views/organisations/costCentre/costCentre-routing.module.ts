import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { CostCentreListComponent } from './costCentre-list.component';
import { CostCentreCreateComponent } from './costCentre-create.component';
import { CostCentreEditComponent } from './costCentre-edit.component';
import { CostCentreViewComponent } from './costCentre-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'CostCentres'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: CostCentreListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: CostCentreListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: CostCentreCreateComponent,
        data: {
          title: 'Create'
        }
      },
      { path: 'organisation-unit/:organisationUnitId/create', canActivate: [AuthGuard], component: CostCentreCreateComponent, data: { title: 'Create' } },
      { path: 'organisation-unit/:organisationUnitId/edit/:id', canActivate: [AuthGuard], component: CostCentreEditComponent },
      { path: 'organisation-unit/:organisationUnitId/view/:id', canActivate: [AuthGuard], component: CostCentreViewComponent },
      { path: 'organisation-unit/:organisationUnitId', canActivate: [AuthGuard], component: CostCentreListComponent, data: { title: 'List' } },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: CostCentreEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: CostCentreViewComponent 
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
export class CostCentreRoutingModule { } 
 
