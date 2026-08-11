import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DashboardRoutingModule } from './dashboard.routes';

import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { UserComponent } from './user-component';
import { DashboardComponent } from './dashboard-component';
import { MySharedModule } from '@/shared/shared.module';


import { MultiSelectModule } from 'primeng/multiselect';
import { Select, SelectModule } from 'primeng/select';
import { Slider, SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { Tag, TagModule } from 'primeng/tag';
import { DriverComponent } from './driver-component';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { StatsWidget } from './component/statswidget';
import { KnobModule } from 'primeng/knob'; 
import { PaginatorModule } from 'primeng/paginator'; 
import { UIChart } from "primeng/chart"; 
import { AdminDashboardComponent } from './dashboardAdmin-component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

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
    MySharedModule,
    InputSwitchModule,
    DashboardRoutingModule,
    InputGroupAddonModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    KnobModule,
    PaginatorModule,
    UIChart, 
    ConfirmDialogModule,
    ConfirmPopupModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    DriverComponent,
    StatsWidget,  
    AdminDashboardComponent
  ],
  providers: [
    JwtHelperService,
    {
      provide: JwtHelperService,
      useFactory: () => {
        return new JwtHelperService();
      }
    },

  ]
})
export class DashboardModule { }


