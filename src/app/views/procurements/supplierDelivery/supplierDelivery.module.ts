import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MySharedModule } from '@/shared/shared.module';
import { SupplierDeliveryRoutingModule } from './supplierDelivery-routing.module';
import { SupplierDeliveryListComponent } from './supplierDelivery-list.component';
import { SupplierDeliveryDetailComponent } from './supplierDelivery-detail.component';
@NgModule({ imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DropdownModule, MySharedModule, SupplierDeliveryRoutingModule], declarations: [SupplierDeliveryListComponent, SupplierDeliveryDetailComponent] }) export class SupplierDeliveryModule {}
