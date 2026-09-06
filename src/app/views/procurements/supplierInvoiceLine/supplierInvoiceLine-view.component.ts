import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { SupplierInvoiceLineService } from './supplierInvoiceLine.service';
import { ISupplierInvoiceLine } from './supplierInvoiceLine';

@Component({
    templateUrl: './supplierInvoiceLine-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class SupplierInvoiceLineViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    supplierInvoiceLine: ISupplierInvoiceLine = {} as ISupplierInvoiceLine;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private supplierInvoiceLineService: SupplierInvoiceLineService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService
    ) {

    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent; 

       

    ngOnInit(): void { 
        this.selectedId = this.activatedRouter.snapshot.params['id']; 
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 1000);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.supplierInvoiceLineService.getById(this.selectedId).subscribe({
            next: data => {
                this.supplierInvoiceLine = data.data;
                this.permission = data.permission; 
                this.populateUI(this.supplierInvoiceLine);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: ISupplierInvoiceLine): void { 
        this.Caption = "SupplierInvoiceLine Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/supplierInvoiceLine/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

