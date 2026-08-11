import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { InputNumberModule } from "primeng/inputnumber";
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { ReactiveFormsModule } from '@angular/forms';
import { MySharedModule } from '@/shared/shared.module';
import { TableModule } from 'primeng/table';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { ExceptionLogListComponent } from './exceptionLog-list.component';
import { ExceptionLogViewComponent } from './exceptionLog-view.component';
import { ExceptionLogRoutingModule } from './exceptionLog-routing.module';
import { InputSwitchModule } from 'primeng/inputswitch';

import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AutoCompleteModule,
		CalendarModule,
		TableModule,
		InputNumberModule,
		TextareaModule,
		RadioButtonModule,
		InputTextModule,
		CheckboxModule,
		ButtonModule,
		InputGroupModule,
		MySharedModule,
		ExceptionLogRoutingModule,
		InputSwitchModule,
		PaginatorModule,
		InputGroupAddonModule,
		SelectModule,
		DatePickerModule,
		FloatLabelModule
	],
	declarations: [
		ExceptionLogListComponent,
		ExceptionLogViewComponent
	]
})
export class ExceptionLogModule { }


