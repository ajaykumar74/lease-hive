import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { MySharedModule } from '@/shared/shared.module';
import { AssetFundingRoutingModule } from './assetFunding-routing.module';
import { AssetFundingListComponent } from './assetFunding-list.component';
import { AssetFundingFormComponent } from './assetFunding-form.component';
import { AssetFundingViewComponent } from './assetFunding-view.component';
@NgModule({ imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, CalendarModule, DropdownModule, InputNumberModule, InputTextModule, TableModule, TextareaModule, MySharedModule, AssetFundingRoutingModule], declarations: [AssetFundingListComponent, AssetFundingFormComponent, AssetFundingViewComponent] }) export class AssetFundingModule {}
