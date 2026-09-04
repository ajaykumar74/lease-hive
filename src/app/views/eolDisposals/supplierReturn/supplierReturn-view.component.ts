import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { SupplierReturnService } from './supplierReturn.service';
import { ISupplierReturn } from './supplierReturn';

@Component({
    templateUrl: './supplierReturn-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class SupplierReturnViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    supplierReturn: ISupplierReturn = {} as ISupplierReturn;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private supplierReturnService: SupplierReturnService, 
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
        this.supplierReturnService.getById(this.selectedId).subscribe({
            next: data => {
                this.supplierReturn = data.data;
                this.permission = data.permission; 
                this.populateUI(this.supplierReturn);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: ISupplierReturn): void { 
        this.Caption = "SupplierReturn Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/supplierReturn/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

