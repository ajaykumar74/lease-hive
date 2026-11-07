import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@/shared/auth-guard.service';
import { PricingSimulatorComponent } from './pricing-simulator.component';

const routes: Routes = [
  {
    path: '',
    component: PricingSimulatorComponent,
    canActivate: [AuthGuard],
    data: { title: 'Pricing Simulator', breadcrumb: 'Pricing Simulator' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingSimulatorRoutingModule {}
