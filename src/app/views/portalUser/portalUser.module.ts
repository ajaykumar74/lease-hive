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
import { DialogModule } from 'primeng/dialog';
import { PortalUserListComponent } from './portalUser-list.component';
import { PortalUserCreateComponent } from './portalUser-create.component';
import { PortalUserEditComponent } from './portalUser-edit.component';
import { PortalUserViewComponent } from './portalUser-view.component';
import { PortalUserRoutingModule } from './portalUser-routing.module';
import { PortalUserRolePermission } from './portalUser-rolePermission.component';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';


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
		PortalUserRoutingModule,
		InputSwitchModule,
		InputGroupAddonModule,
		DialogModule,
		TooltipModule,
		PaginatorModule
	],
	declarations: [
		PortalUserCreateComponent,
		PortalUserListComponent,
		PortalUserEditComponent,
		PortalUserViewComponent,
		PortalUserRolePermission
	]
})
export class PortalUserModule { }


