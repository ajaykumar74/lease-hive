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
import { FluidModule } from 'primeng/fluid';

import { EquipmentAssetListComponent } from './equipmentAsset-list.component';
import { EquipmentAssetCreateComponent } from './equipmentAsset-create.component';
import { EquipmentAssetEditComponent } from './equipmentAsset-edit.component';
import { EquipmentAssetViewComponent } from './equipmentAsset-view.component';
import { EquipmentAssetRoutingModule } from './equipmentAsset-routing.module';



@NgModule({
	imports: [
		CommonModule,
		FormsModule, 
		ReactiveFormsModule, 
		AutoCompleteModule, 
		CalendarModule, 
		DropdownModule, 
		TableModule,
		InputNumberModule, 
		TextareaModule,
		RadioButtonModule,
		InputTextModule, 
		CheckboxModule,
		ButtonModule,
		InputGroupModule, 
		MySharedModule, 
		FluidModule,
		EquipmentAssetRoutingModule,
	],
	declarations: [
		EquipmentAssetCreateComponent,
		EquipmentAssetListComponent,
		EquipmentAssetEditComponent,
		EquipmentAssetViewComponent
	]
})
export class EquipmentAssetModule { }


