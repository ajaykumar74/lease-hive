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

import { EndOfLeaseOptionListComponent } from './endOfLeaseOption-list.component';
import { EndOfLeaseOptionCreateComponent } from './endOfLeaseOption-create.component';
import { EndOfLeaseOptionEditComponent } from './endOfLeaseOption-edit.component';
import { EndOfLeaseOptionViewComponent } from './endOfLeaseOption-view.component';
import { EndOfLeaseOptionRoutingModule } from './endOfLeaseOption-routing.module';



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
		EndOfLeaseOptionRoutingModule,
	],
	declarations: [
		EndOfLeaseOptionCreateComponent,
		EndOfLeaseOptionListComponent,
		EndOfLeaseOptionEditComponent,
		EndOfLeaseOptionViewComponent
	]
})
export class EndOfLeaseOptionModule { }


