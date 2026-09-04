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

import { MaintenanceWorkOrderListComponent } from './maintenanceWorkOrder-list.component';
import { MaintenanceWorkOrderCreateComponent } from './maintenanceWorkOrder-create.component';
import { MaintenanceWorkOrderEditComponent } from './maintenanceWorkOrder-edit.component';
import { MaintenanceWorkOrderViewComponent } from './maintenanceWorkOrder-view.component';
import { MaintenanceWorkOrderRoutingModule } from './maintenanceWorkOrder-routing.module';



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
		MaintenanceWorkOrderRoutingModule,
	],
	declarations: [
		MaintenanceWorkOrderCreateComponent,
		MaintenanceWorkOrderListComponent,
		MaintenanceWorkOrderEditComponent,
		MaintenanceWorkOrderViewComponent
	]
})
export class MaintenanceWorkOrderModule { }


