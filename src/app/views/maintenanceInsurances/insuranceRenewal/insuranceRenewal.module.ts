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

import { InsuranceRenewalListComponent } from './insuranceRenewal-list.component';
import { InsuranceRenewalCreateComponent } from './insuranceRenewal-create.component';
import { InsuranceRenewalEditComponent } from './insuranceRenewal-edit.component';
import { InsuranceRenewalViewComponent } from './insuranceRenewal-view.component';
import { InsuranceRenewalRoutingModule } from './insuranceRenewal-routing.module';



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
		InsuranceRenewalRoutingModule,
	],
	declarations: [
		InsuranceRenewalCreateComponent,
		InsuranceRenewalListComponent,
		InsuranceRenewalEditComponent,
		InsuranceRenewalViewComponent
	]
})
export class InsuranceRenewalModule { }


