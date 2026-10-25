import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@/shared/auth-guard.service';
import { TenantAssetCategoryComponent } from './tenant-asset-category.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: TenantAssetCategoryComponent,
    data: { title: 'Tenant Asset Categories' }
  },
  {
    path: ':tenantId',
    canActivate: [AuthGuard],
    component: TenantAssetCategoryComponent,
    data: { title: 'Tenant Asset Categories' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantAssetCategoryRoutingModule {}
