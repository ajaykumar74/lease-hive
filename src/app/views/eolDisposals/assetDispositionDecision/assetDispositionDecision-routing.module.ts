import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetDispositionDecisionListComponent } from './assetDispositionDecision-list.component';
import { AssetDispositionDecisionCreateComponent } from './assetDispositionDecision-create.component';
import { AssetDispositionDecisionEditComponent } from './assetDispositionDecision-edit.component';
import { AssetDispositionDecisionViewComponent } from './assetDispositionDecision-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'AssetDispositionDecisions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetDispositionDecisionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetDispositionDecisionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetDispositionDecisionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetDispositionDecisionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: AssetDispositionDecisionViewComponent 
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
export class AssetDispositionDecisionRoutingModule { } 
 