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

import { FinanceHandoffListComponent } from './financeHandoff-list.component';
import { FinanceHandoffCreateComponent } from './financeHandoff-create.component';
import { FinanceHandoffEditComponent } from './financeHandoff-edit.component';
import { FinanceHandoffViewComponent } from './financeHandoff-view.component';
import { FinanceHandoffRoutingModule } from './financeHandoff-routing.module';



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
		FinanceHandoffRoutingModule,
	],
	declarations: [
		FinanceHandoffCreateComponent,
		FinanceHandoffListComponent,
		FinanceHandoffEditComponent,
		FinanceHandoffViewComponent
	]
})
export class FinanceHandoffModule { }


