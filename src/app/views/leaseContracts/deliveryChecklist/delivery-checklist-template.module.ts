import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryChecklistTemplateComponent } from './delivery-checklist-template.component';
const routes: Routes = [{ path: '', component: DeliveryChecklistTemplateComponent }];
@NgModule({ imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), ButtonModule, CheckboxModule, DropdownModule, InputNumberModule, InputTextModule], declarations: [DeliveryChecklistTemplateComponent] })
export class DeliveryChecklistTemplateModule {}
