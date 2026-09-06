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

import { PurchaseOrderDeliveryListComponent } from './purchaseOrderDelivery-list.component';
import { PurchaseOrderDeliveryCreateComponent } from './purchaseOrderDelivery-create.component';
import { PurchaseOrderDeliveryEditComponent } from './purchaseOrderDelivery-edit.component';
import { PurchaseOrderDeliveryViewComponent } from './purchaseOrderDelivery-view.component';
import { PurchaseOrderDeliveryRoutingModule } from './purchaseOrderDelivery-routing.module';



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
		PurchaseOrderDeliveryRoutingModule,
	],
	declarations: [
		PurchaseOrderDeliveryCreateComponent,
		PurchaseOrderDeliveryListComponent,
		PurchaseOrderDeliveryEditComponent,
		PurchaseOrderDeliveryViewComponent
	]
})
export class PurchaseOrderDeliveryModule { }


