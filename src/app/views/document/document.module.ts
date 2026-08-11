import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar"; 
import { SelectModule } from 'primeng/select';
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
import { FileUpload } from 'primeng/fileupload';

import { DocumentListComponent } from './document-list.component';
import { DocumentCreateComponent } from './document-create.component';
import { DocumentEditComponent } from './document-edit.component';
import { DocumentViewComponent } from './document-view.component';
import { DocumentRoutingModule } from './document-routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@NgModule({
	imports: [
		CommonModule,
		FormsModule, 
		ReactiveFormsModule, 
		AutoCompleteModule, 
		CalendarModule, 
		SelectModule, 
		TableModule,
		InputNumberModule, 
		TextareaModule,
		RadioButtonModule,
		InputTextModule, 
		CheckboxModule,
		ButtonModule,
		InputGroupModule, 
		MySharedModule, 
		DocumentRoutingModule,
		InputSwitchModule,
		PaginatorModule,
		InputGroupAddonModule,
		FileUpload,
		ConfirmDialogModule
	],
	declarations: [
		DocumentCreateComponent,
		DocumentListComponent,
		DocumentEditComponent,
		DocumentViewComponent
	]
})
export class documentModule { }


