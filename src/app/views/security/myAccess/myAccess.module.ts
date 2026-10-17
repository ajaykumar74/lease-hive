import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { MyAccessComponent } from './myAccess.component';
import { MyAccessRoutingModule } from './myAccess-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        MyAccessRoutingModule
    ],
    declarations: [MyAccessComponent]
})
export class MyAccessModule {
}
