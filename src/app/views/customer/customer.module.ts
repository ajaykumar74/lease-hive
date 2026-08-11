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

import { CustomerListComponent } from './customer-list.component';
import { CustomerCreateComponent } from './customer-create.component';
import { CustomerEditComponent } from './customer-edit.component';
import { CustomerViewComponent } from './customer-view.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { FluidModule } from 'primeng/fluid';



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
		FluidModule,
		MySharedModule, 
		CustomerRoutingModule,
	],
	declarations: [
		CustomerCreateComponent,
		CustomerListComponent,
		CustomerEditComponent,
		CustomerViewComponent
	]
})
export class CustomerModule { }


