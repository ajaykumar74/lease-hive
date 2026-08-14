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

import { SupplierServiceAreaListComponent } from './supplierServiceArea-list.component';
import { SupplierServiceAreaCreateComponent } from './supplierServiceArea-create.component';
import { SupplierServiceAreaEditComponent } from './supplierServiceArea-edit.component';
import { SupplierServiceAreaViewComponent } from './supplierServiceArea-view.component';
import { SupplierServiceAreaRoutingModule } from './supplierServiceArea-routing.module';



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
		SupplierServiceAreaRoutingModule,
	],
	declarations: [
		SupplierServiceAreaCreateComponent,
		SupplierServiceAreaListComponent,
		SupplierServiceAreaEditComponent,
		SupplierServiceAreaViewComponent
	]
})
export class SupplierServiceAreaModule { }


