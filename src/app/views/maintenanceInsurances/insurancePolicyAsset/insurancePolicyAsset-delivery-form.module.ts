import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MySharedModule } from '@/shared/shared.module';
import { InsurancePolicyAssetDeliveryFormComponent } from './insurancePolicyAsset-delivery-form.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CalendarModule, DropdownModule, InputNumberModule, InputTextModule, MySharedModule],
  declarations: [InsurancePolicyAssetDeliveryFormComponent],
  exports: [InsurancePolicyAssetDeliveryFormComponent]
})
export class InsurancePolicyAssetDeliveryFormModule {}
