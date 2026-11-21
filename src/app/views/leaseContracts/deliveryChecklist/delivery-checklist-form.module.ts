import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { MySharedModule } from '@/shared/shared.module';
import { DeliveryChecklistFormComponent } from './delivery-checklist-form.component';

@NgModule({ imports: [CommonModule, FormsModule, ButtonModule, DropdownModule, InputTextModule, ProgressBarModule, TagModule, MySharedModule], declarations: [DeliveryChecklistFormComponent], exports: [DeliveryChecklistFormComponent] })
export class DeliveryChecklistFormModule {}
