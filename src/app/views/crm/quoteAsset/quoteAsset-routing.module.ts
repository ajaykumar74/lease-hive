import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { QuoteAssetListComponent } from './quoteAsset-list.component';
import { QuoteAssetCreateComponent } from './quoteAsset-create.component';
import { QuoteAssetEditComponent } from './quoteAsset-edit.component';
import { QuoteAssetViewComponent } from './quoteAsset-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'QuoteAssets'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: QuoteAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: QuoteAssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: QuoteAssetCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: QuoteAssetEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: QuoteAssetViewComponent 
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
export class QuoteAssetRoutingModule { } 
 