import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@/shared/auth-guard.service';
import { SupplierDeliveryListComponent } from './supplierDelivery-list.component';
import { SupplierDeliveryDetailComponent } from './supplierDelivery-detail.component';
const routes: Routes = [{ path: '', canActivate: [AuthGuard], children: [{ path: '', component: SupplierDeliveryListComponent }, { path: ':id', component: SupplierDeliveryDetailComponent }] }];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] }) export class SupplierDeliveryRoutingModule {}
