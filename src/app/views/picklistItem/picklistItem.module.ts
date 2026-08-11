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
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { PicklistItemListComponent } from './picklistItem-list.component';
import { PicklistItemCreateComponent } from './picklistItem-create.component';
import { PicklistItemEditComponent } from './picklistItem-edit.component';
import { PicklistItemViewComponent } from './picklistItem-view.component';
import { PicklistItemRoutingModule } from './picklistItem-routing.module';



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
		PicklistItemRoutingModule,
		InputGroupAddonModule
	],
	declarations: [
		PicklistItemCreateComponent,
		PicklistItemListComponent,
		PicklistItemEditComponent,
		PicklistItemViewComponent
	]
})
export class PicklistItemModule { }


