import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetFundingListComponent } from './assetFunding-list.component';
import { AssetFundingFormComponent } from './assetFunding-form.component';
import { AssetFundingViewComponent } from './assetFunding-view.component';
const routes: Routes = [{ path: '', component: AssetFundingListComponent }, { path: 'create', component: AssetFundingFormComponent }, { path: ':id/edit', component: AssetFundingFormComponent }, { path: ':id', component: AssetFundingViewComponent }];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] }) export class AssetFundingRoutingModule {}
