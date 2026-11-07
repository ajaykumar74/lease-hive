import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MySharedModule } from '@/shared/shared.module';
import { PricingSimulatorComponent } from './pricing-simulator.component';
import { PricingSimulatorRoutingModule } from './pricing-simulator-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
    MySharedModule,
    PricingSimulatorRoutingModule
  ],
  declarations: [PricingSimulatorComponent]
})
export class PricingSimulatorModule {}
