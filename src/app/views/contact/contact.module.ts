import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar"; 
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
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';


import { ContactListComponent } from './contact-list.component';
import { ContactCreateComponent } from './contact-create.component';
import { ContactEditComponent } from './contact-edit.component';
import { ContactViewComponent } from './contact-view.component';
import { ContactRoutingModule } from './contact-routing.module';

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
		ContactRoutingModule,
		InputSwitchModule,
		PaginatorModule,
		InputGroupAddonModule
	],
	declarations: [
		ContactCreateComponent,
		ContactListComponent,
		ContactEditComponent,
		ContactViewComponent
	]
})
export class ContactModule { }


