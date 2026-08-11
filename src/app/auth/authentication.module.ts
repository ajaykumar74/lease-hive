import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { InputNumberModule } from "primeng/inputnumber";
import { InputText, InputTextModule } from "primeng/inputtext";
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { Button, ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Login } from './login';
import { AuthenticationRoutingModule } from './account.routes';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ForgotPassword } from './forgotpassword';
import { ResetPassword } from './reset-password'; 

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AutoCompleteModule,
		CalendarModule,
		TableModule,
		InputNumberModule,
		RadioButtonModule,
		InputTextModule,
		CheckboxModule,
		ButtonModule,
		InputGroupModule,
		CheckboxModule,
		InputTextModule,
		InputNumberModule,
		InputGroupModule,
		CheckboxModule,
		FormsModule,
		RouterModule,
		AppConfigurator,
		IconFieldModule,
		InputIconModule,
		AuthenticationRoutingModule,
		MessagesModule,
		MessageModule
	],
	declarations: [
		Login,
		ForgotPassword,
		ResetPassword, 
		// ExternalRegisterSuccess
	],
	providers: [MessageService],
})
export class AuthenticationModule { }


