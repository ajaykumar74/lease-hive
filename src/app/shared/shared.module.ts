
/* 
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';    


import { ButtonModule } from 'primeng/button';  
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar'; 
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
 
import { YesNoPipe } from './yes-no.pipe'; 
import { DateFormatPipe } from './date-format.pipe';
import { MessageComponent } from './message.component';
import { SpinnerComponent } from './spinner.component'; */



import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { SpinnerComponent } from './spinner.component';
import { MessageComponent } from './message.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { TruncatePipe } from './pipes/string.pipe';
import { SplitCamelCasePipe } from './pipes/split-camel-case.pipe';
import { DateFormatPipe, RemainingDaysPipe } from './pipes/date-format.pipe';
import { ToolbarButtonsComponent } from './toolbar-buttons.component';
import { DownloadComponent } from './download.component';
import { AuditDetailsComponent } from './audit-details.component';
import { AuthInterceptor } from './auth.inteceptor';
import { InputFormatDirective } from '@/shared/InputFormatDirective';
import { UploadComponent } from './upload.component';
import { ViewFieldComponent } from './view-field.component';
import { ValidationErrorsComponent } from './uicontrols/app-validation-errors';
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ConfirmPopupModule,
		ConfirmDialogModule,
		OverlayPanelModule,
		ToastModule,
		ProgressSpinnerModule,
		ProgressBarModule,
		DialogModule,
		TooltipModule,
		ButtonModule,
		MessagesModule,
		MessageModule,
		InputFormatDirective
	],
	providers: [
		DatePipe,
		ConfirmationService,
		MessageService,
		AuthInterceptor
	],
	declarations: [
		MessageComponent,
		YesNoPipe,
		TruncatePipe,
		SplitCamelCasePipe,
		DateFormatPipe,
		RemainingDaysPipe,
		SpinnerComponent,
		ToolbarButtonsComponent,
		DownloadComponent,
		AuditDetailsComponent,
		UploadComponent,
		ViewFieldComponent, 
		ValidationErrorsComponent
	],
	exports: [
		MessageComponent,
		YesNoPipe,
		TruncatePipe,
		SplitCamelCasePipe,
		DateFormatPipe,
		RemainingDaysPipe,
		DatePipe,
		SpinnerComponent,
		ToolbarButtonsComponent,
		DownloadComponent,
		AuditDetailsComponent,
		InputFormatDirective,
		UploadComponent,
		ViewFieldComponent,
		ValidationErrorsComponent
	]
})
export class MySharedModule { }
