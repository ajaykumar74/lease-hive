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

import { ProcurementExceptionListComponent } from './procurementException-list.component';
import { ProcurementExceptionCreateComponent } from './procurementException-create.component';
import { ProcurementExceptionEditComponent } from './procurementException-edit.component';
import { ProcurementExceptionViewComponent } from './procurementException-view.component';
import { ProcurementExceptionRoutingModule } from './procurementException-routing.module';



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
		ProcurementExceptionRoutingModule,
	],
	declarations: [
		ProcurementExceptionCreateComponent,
		ProcurementExceptionListComponent,
		ProcurementExceptionEditComponent,
		ProcurementExceptionViewComponent
	]
})
export class ProcurementExceptionModule { }


