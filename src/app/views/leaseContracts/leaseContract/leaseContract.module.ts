import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar"; 
import { DropdownModule } from "primeng/dropdown"; 
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
import { PaginatorModule } from 'primeng/paginator';
import { FluidModule } from 'primeng/fluid';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { AssetAssignmentDeliveryFormModule } from '@/views/assets/assetAssignment/assetAssignment-delivery-form.module';
import { InsurancePolicyAssetDeliveryFormModule } from '@/views/maintenanceInsurances/insurancePolicyAsset/insurancePolicyAsset-delivery-form.module';
import { DeliveryChecklistFormModule } from '../deliveryChecklist/delivery-checklist-form.module';

import { LeaseContractListComponent } from './leaseContract-list.component';
import { LeaseContractCreateComponent } from './leaseContract-create.component';
import { LeaseContractEditComponent } from './leaseContract-edit.component';
import { LeaseContractViewComponent } from './leaseContract-view.component';
import { LeaseContractRoutingModule } from './leaseContract-routing.module';



@NgModule({
	imports: [
		CommonModule,
		FormsModule, 
		ReactiveFormsModule, 
		AutoCompleteModule, 
		CalendarModule, 
		DropdownModule, 
		TableModule,
		PaginatorModule,
		TooltipModule,
		DialogModule,
		AssetAssignmentDeliveryFormModule,
		InsurancePolicyAssetDeliveryFormModule,
		DeliveryChecklistFormModule,
		InputNumberModule, 
		TextareaModule,
		RadioButtonModule,
		InputTextModule, 
		CheckboxModule,
		ButtonModule,
		InputGroupModule, 
		MySharedModule, 
		FluidModule,
		TagModule,
		SplitButtonModule,
		LeaseContractRoutingModule,
	],
	declarations: [
		LeaseContractCreateComponent,
		LeaseContractListComponent,
		LeaseContractEditComponent,
		LeaseContractViewComponent
	]
})
export class LeaseContractModule { }


