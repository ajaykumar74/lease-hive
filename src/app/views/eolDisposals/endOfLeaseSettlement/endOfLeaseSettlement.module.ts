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

import { EndOfLeaseSettlementListComponent } from './endOfLeaseSettlement-list.component';
import { EndOfLeaseSettlementCreateComponent } from './endOfLeaseSettlement-create.component';
import { EndOfLeaseSettlementEditComponent } from './endOfLeaseSettlement-edit.component';
import { EndOfLeaseSettlementViewComponent } from './endOfLeaseSettlement-view.component';
import { EndOfLeaseSettlementRoutingModule } from './endOfLeaseSettlement-routing.module';



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
		EndOfLeaseSettlementRoutingModule,
	],
	declarations: [
		EndOfLeaseSettlementCreateComponent,
		EndOfLeaseSettlementListComponent,
		EndOfLeaseSettlementEditComponent,
		EndOfLeaseSettlementViewComponent
	]
})
export class EndOfLeaseSettlementModule { }


