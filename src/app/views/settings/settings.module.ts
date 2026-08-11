import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { ReactiveFormsModule } from '@angular/forms';
import { MySharedModule } from '@/shared/shared.module';
import { TableModule } from 'primeng/table';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsViewComponent } from './settings-view.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TextareaModule } from 'primeng/textarea';



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
		RadioButtonModule,
		InputTextModule,
		CheckboxModule,
		ButtonModule,
		InputGroupModule,
		MySharedModule,
		ConfirmPopupModule,
		ConfirmDialogModule,
		SettingsRoutingModule,
		InputSwitchModule,
		TextareaModule
	],
	declarations: [
		SettingsViewComponent
	]
})
export class SettingsModule { }


