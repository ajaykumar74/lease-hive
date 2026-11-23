import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { AssetCatalogueListComponent } from './assetCatalogue-list.component';
import { AssetCatalogueEditorComponent } from './assetCatalogue-editor.component';
import { AssetCatalogueRoutingModule } from './assetCatalogue-routing.module';

@NgModule({ imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, DropdownModule, InputTextModule, InputNumberModule, TextareaModule, CalendarModule, TableModule, PaginatorModule, AssetCatalogueRoutingModule], declarations: [AssetCatalogueListComponent, AssetCatalogueEditorComponent] })
export class AssetCatalogueModule { }
