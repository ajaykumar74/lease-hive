import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { PicklistItemListComponent } from './picklistItem-list.component';
import { PicklistItemCreateComponent } from './picklistItem-create.component';
import { PicklistItemEditComponent } from './picklistItem-edit.component';
import { PicklistItemViewComponent } from './picklistItem-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'PicklistItems'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: PicklistItemListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PicklistItemListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: PicklistItemCreateComponent,
        data: {
          title: 'Create'
        }
      },
      {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: PicklistItemEditComponent
      },
      {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: PicklistItemViewComponent
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
export class PicklistItemRoutingModule { }
