import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { AssetAssignmentDeliveryFormComponent } from './assetAssignment-delivery-form.component';

/** Presentational assignment form shared by assignment and lease-delivery features. */
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CalendarModule, CheckboxModule, DropdownModule],
  declarations: [AssetAssignmentDeliveryFormComponent],
  exports: [AssetAssignmentDeliveryFormComponent]
})
export class AssetAssignmentDeliveryFormModule {}
