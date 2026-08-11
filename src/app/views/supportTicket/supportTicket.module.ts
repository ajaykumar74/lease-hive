import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { SelectModule } from 'primeng/select';
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
import { AccordionModule } from 'primeng/accordion';

import { SupportTicketListComponent } from './supportTicket-list.component';
import { SupportTicketCreateComponent } from './supportTicket-create.component';
import { SupportTicketEditComponent } from './supportTicket-edit.component';
import { SupportTicketViewComponent } from './supportTicket-view.component';
import { SupportTicketRoutingModule } from './supportTicket-routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';


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
		SupportTicketRoutingModule,
		InputGroupAddonModule,
		PaginatorModule,
		InputSwitchModule,
		TagModule,
		AccordionModule,
		DialogModule,
	],
	declarations: [
		SupportTicketCreateComponent,
		SupportTicketListComponent,
		SupportTicketEditComponent,
		SupportTicketViewComponent
	]
})
export class SupportTicketModule { }


