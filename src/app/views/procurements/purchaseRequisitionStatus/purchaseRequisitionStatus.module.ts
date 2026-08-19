import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar"; 
import { DropdownModule } from "primeng/dropdown"; 
import { InputNumberModule } from "primeng/inputnumber"; 
import {TextareaModule} from 'primeng/textarea';
import { InputTextModule } from "primeng/inputtext"; 
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button'; 
import { RadioButtonModule } from 'primeng/radiobutton'; 
import { InputGroupModule } from 'primeng/inputgroup';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MySharedModule } from '@/shared/shared.module';
import { TableModule } from 'primeng/table';
import { FluidModule } from 'primeng/fluid';

import { PurchaseRequisitionStatusListComponent } from './purchaseRequisitionStatus-list.component';
import { PurchaseRequisitionStatusCreateComponent } from './purchaseRequisitionStatus-create.component';
import { PurchaseRequisitionStatusEditComponent } from './purchaseRequisitionStatus-edit.component';
import { PurchaseRequisitionStatusViewComponent } from './purchaseRequisitionStatus-view.component';
import { PurchaseRequisitionStatusRoutingModule } from './purchaseRequisitionStatus-routing.module';



@NgModule({
	imports: [
		CommonModule,
		FormsModule, 
		ReactiveFormsModule, 
		AutoCompleteModule, 
		CalendarModule, 
		DropdownModule, 
		TableModule,
		InputNumberModule, 
		TextareaModule,
		RadioButtonModule,
		InputTextModule, 
		CheckboxModule,
		ButtonModule,
		InputGroupModule, 
		MySharedModule, 
		FluidModule,
		PurchaseRequisitionStatusRoutingModule,
	],
	declarations: [
		PurchaseRequisitionStatusCreateComponent,
		PurchaseRequisitionStatusListComponent,
		PurchaseRequisitionStatusEditComponent,
		PurchaseRequisitionStatusViewComponent
	]
})
export class PurchaseRequisitionStatusModule { }


