import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { InsuranceClaimStatusService } from './insuranceClaimStatus.service';
import { IInsuranceClaimStatus } from './insuranceClaimStatus';

@Component({
    templateUrl: './insuranceClaimStatus-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class InsuranceClaimStatusViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    insuranceClaimStatus: IInsuranceClaimStatus = {} as IInsuranceClaimStatus;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private insuranceClaimStatusService: InsuranceClaimStatusService, 
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
        this.insuranceClaimStatusService.getById(this.selectedId).subscribe({
            next: data => {
                this.insuranceClaimStatus = data.data;
                this.permission = data.permission; 
                this.populateUI(this.insuranceClaimStatus);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IInsuranceClaimStatus): void { 
        this.Caption = "InsuranceClaimStatus Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/maintenance-insurance/insurance/configuration/claim-statuses/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

