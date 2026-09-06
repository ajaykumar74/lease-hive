import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { PurchaseOrderDeliveryService } from './purchaseOrderDelivery.service';
import { IPurchaseOrderDelivery } from './purchaseOrderDelivery';

@Component({
    templateUrl: './purchaseOrderDelivery-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class PurchaseOrderDeliveryViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    purchaseOrderDelivery: IPurchaseOrderDelivery = {} as IPurchaseOrderDelivery;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private purchaseOrderDeliveryService: PurchaseOrderDeliveryService, 
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
        this.purchaseOrderDeliveryService.getById(this.selectedId).subscribe({
            next: data => {
                this.purchaseOrderDelivery = data.data;
                this.permission = data.permission; 
                this.populateUI(this.purchaseOrderDelivery);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IPurchaseOrderDelivery): void { 
        this.Caption = "PurchaseOrderDelivery Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/purchaseOrderDelivery/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

