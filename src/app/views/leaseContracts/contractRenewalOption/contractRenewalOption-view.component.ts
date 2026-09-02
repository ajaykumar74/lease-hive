import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { ContractRenewalOptionService } from './contractRenewalOption.service';
import { IContractRenewalOption } from './contractRenewalOption';

@Component({
    templateUrl: './contractRenewalOption-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class ContractRenewalOptionViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    contractRenewalOption: IContractRenewalOption = {} as IContractRenewalOption;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private contractRenewalOptionService: ContractRenewalOptionService, 
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
        this.contractRenewalOptionService.getById(this.selectedId).subscribe({
            next: data => {
                this.contractRenewalOption = data.data;
                this.permission = data.permission; 
                this.populateUI(this.contractRenewalOption);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IContractRenewalOption): void { 
        this.Caption = "ContractRenewalOption Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/contractRenewalOption/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

