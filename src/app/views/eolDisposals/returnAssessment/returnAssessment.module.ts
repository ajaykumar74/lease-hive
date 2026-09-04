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

import { ReturnAssessmentListComponent } from './returnAssessment-list.component';
import { ReturnAssessmentCreateComponent } from './returnAssessment-create.component';
import { ReturnAssessmentEditComponent } from './returnAssessment-edit.component';
import { ReturnAssessmentViewComponent } from './returnAssessment-view.component';
import { ReturnAssessmentRoutingModule } from './returnAssessment-routing.module';



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
		ReturnAssessmentRoutingModule,
	],
	declarations: [
		ReturnAssessmentCreateComponent,
		ReturnAssessmentListComponent,
		ReturnAssessmentEditComponent,
		ReturnAssessmentViewComponent
	]
})
export class ReturnAssessmentModule { }


