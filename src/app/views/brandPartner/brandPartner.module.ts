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
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PaginatorModule } from 'primeng/paginator';

import { BrandPartnerListComponent } from './brandPartner-list.component';
import { BrandPartnerCreateComponent } from './brandPartner-create.component';
import { BrandPartnerEditComponent } from './brandPartner-edit.component';
import { BrandPartnerViewComponent } from './brandPartner-view.component';
import { BrandPartnerRoutingModule } from './brandPartner-routing.module';



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
		BrandPartnerRoutingModule,
		InputSwitchModule,
		InputGroupAddonModule,
		PaginatorModule
	],
	declarations: [
		BrandPartnerCreateComponent,
		BrandPartnerListComponent,
		BrandPartnerEditComponent,
		BrandPartnerViewComponent
	]
})
export class BrandPartnerModule { }


