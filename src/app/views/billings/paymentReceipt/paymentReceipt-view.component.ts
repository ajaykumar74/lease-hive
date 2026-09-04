import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { PaymentReceiptService } from './paymentReceipt.service';
import { IPaymentReceipt } from './paymentReceipt';

@Component({
    templateUrl: './paymentReceipt-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class PaymentReceiptViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    paymentReceipt: IPaymentReceipt = {} as IPaymentReceipt;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private paymentReceiptService: PaymentReceiptService, 
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
        this.paymentReceiptService.getById(this.selectedId).subscribe({
            next: data => {
                this.paymentReceipt = data.data;
                this.permission = data.permission; 
                this.populateUI(this.paymentReceipt);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IPaymentReceipt): void { 
        this.Caption = "PaymentReceipt Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/billing-finance/payments/receipts/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

