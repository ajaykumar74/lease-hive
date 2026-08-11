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
import {SplitButtonModule} from 'primeng/splitbutton';


import { TenantListComponent } from './tenant-list.component';
import { TenantCreateComponent } from './tenant-create.component';
import { TenantEditComponent } from './tenant-edit.component';
import { TenantViewComponent } from './tenant-view.component';
import { TenantRoutingModule } from './tenant-routing.module';



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
		TenantRoutingModule,
		SplitButtonModule
	],
	declarations: [
		TenantCreateComponent,
		TenantListComponent,
		TenantEditComponent,
		TenantViewComponent
	]
})
export class TenantModule { }


