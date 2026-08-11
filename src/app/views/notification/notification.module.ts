import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { InputNumberModule } from "primeng/inputnumber";
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';

import { MySharedModule } from '@/shared/shared.module';

import { NotificationListComponent } from './notification-list.component';
import { NotificationViewComponent } from './notification-view.component';
import { NotificationRoutingModule } from './notification-routing.module';

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
		NotificationRoutingModule,
		InputSwitchModule,
		PaginatorModule,
		InputGroupAddonModule,
		SelectModule
	],
	declarations: [
		NotificationListComponent,
		NotificationViewComponent
	]
})
export class NotificationModule { }
