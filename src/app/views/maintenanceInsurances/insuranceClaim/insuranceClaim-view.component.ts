import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { InsuranceClaimService } from './insuranceClaim.service';
import { IInsuranceClaim } from './insuranceClaim';

@Component({
    templateUrl: './insuranceClaim-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class InsuranceClaimViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    insuranceClaim: IInsuranceClaim = {} as IInsuranceClaim;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private insuranceClaimService: InsuranceClaimService, 
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
        this.insuranceClaimService.getById(this.selectedId).subscribe({
            next: data => {
                this.insuranceClaim = data.data;
                this.permission = data.permission; 
                this.populateUI(this.insuranceClaim);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IInsuranceClaim): void { 
        this.Caption = "InsuranceClaim Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/insuranceClaim/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

