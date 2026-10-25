import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { FluidModule } from 'primeng/fluid';
import { MySharedModule } from '@/shared/shared.module';
import { TenantAssetCategoryComponent } from './tenant-asset-category.component';
import { TenantAssetCategoryRoutingModule } from './tenant-asset-category-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    CheckboxModule,
    TableModule,
    FluidModule,
    MySharedModule,
    TenantAssetCategoryRoutingModule
  ],
  declarations: [TenantAssetCategoryComponent]
})
export class TenantAssetCategoryModule {}
