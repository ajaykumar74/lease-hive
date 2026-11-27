import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetListComponent } from './asset-list.component';
import { AssetCreateComponent } from './asset-create.component';
import { AssetEditComponent } from './asset-edit.component';
import { AssetViewComponent } from './asset-view.component';
import { AssetProfileComponent } from './asset-profile.component';
import { AssetProfileOverviewComponent } from './asset-profile-overview.component';
import { AssetProfileRecordsComponent } from './asset-profile-records.component';
import { AssetProfileDocumentsComponent } from './asset-profile-documents.component';
import { AssetProfileSpecialisedDetailsComponent } from './asset-profile-specialised-details.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Assets'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: AssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: AssetListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: AssetCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: AssetEditComponent 
      },
	  {
        path: 'profile/:id',
        canActivate: [AuthGuard],
        component: AssetProfileComponent,
        data: { title: 'Asset Profile' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'overview' },
          { path: 'overview', component: AssetProfileOverviewComponent, data: { title: 'Overview' } },
          { path: 'details', component: AssetProfileSpecialisedDetailsComponent, data: { title: 'Details' } },
          { path: 'acquisition', component: AssetProfileRecordsComponent, data: { section: 'acquisition', title: 'Acquisition & Purchase' } },
          { path: 'contracts', component: AssetProfileRecordsComponent, data: { section: 'contracts', title: 'Contracts' } },
          { path: 'finance', component: AssetProfileRecordsComponent, data: { section: 'finance', title: 'Billing & Finance' } },
          { path: 'users', component: AssetProfileRecordsComponent, data: { section: 'users', title: 'Customer & Assigned Users' } },
          { path: 'deliveries', component: AssetProfileRecordsComponent, data: { section: 'deliveries', title: 'Deliveries' } },
          { path: 'insurance', component: AssetProfileRecordsComponent, data: { section: 'insurance', title: 'Insurance' } },
          { path: 'maintenance', component: AssetProfileRecordsComponent, data: { section: 'maintenance', title: 'Maintenance' } },
          { path: 'locations', component: AssetProfileRecordsComponent, data: { section: 'locations', title: 'Location & Movements' } },
          { path: 'documents', component: AssetProfileDocumentsComponent, data: { title: 'Documents' } },
          { path: 'funding', component: AssetProfileRecordsComponent, data: { section: 'funding', title: 'Funding & Depreciation' } },
          { path: 'usage', component: AssetProfileRecordsComponent, data: { section: 'usage', title: 'Usage & Telemetry' } },
          { path: 'relationships', component: AssetProfileRecordsComponent, data: { section: 'relationships', title: 'Relationships' } },
          { path: 'activity', component: AssetProfileRecordsComponent, data: { section: 'activity', title: 'Activity History' } }
        ]
      },
	  {
        path: 'view/:id',
        redirectTo: 'profile/:id/overview',
        pathMatch: 'full'
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
export class AssetRoutingModule { }
