import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { CustomerInvoiceTaxService } from './customerInvoiceTax.service';
import { ICustomerInvoiceTax } from './customerInvoiceTax';

@Component({
    templateUrl: './customerInvoiceTax-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class CustomerInvoiceTaxViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    customerInvoiceTax: ICustomerInvoiceTax = {} as ICustomerInvoiceTax;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private customerInvoiceTaxService: CustomerInvoiceTaxService, 
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
        this.customerInvoiceTaxService.getById(this.selectedId).subscribe({
            next: data => {
                this.customerInvoiceTax = data.data;
                this.permission = data.permission; 
                this.populateUI(this.customerInvoiceTax);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: ICustomerInvoiceTax): void { 
        this.Caption = "CustomerInvoiceTax Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/billing-finance/invoices/taxes/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

