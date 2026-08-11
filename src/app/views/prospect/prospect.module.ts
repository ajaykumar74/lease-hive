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

import { ProspectListComponent } from './prospect-list.component';
import { ProspectCreateComponent } from './prospect-create.component';
import { ProspectEditComponent } from './prospect-edit.component';
import { ProspectViewComponent } from './prospect-view.component';
import { ProspectRoutingModule } from './prospect-routing.module';
import { PaginatorModule } from 'primeng/paginator';



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
		ProspectRoutingModule,
		PaginatorModule,
		InputGroupAddonModule
	],
	declarations: [
		ProspectCreateComponent,
		ProspectListComponent,
		ProspectEditComponent,
		ProspectViewComponent
	]
})
export class ProspectModule { }


