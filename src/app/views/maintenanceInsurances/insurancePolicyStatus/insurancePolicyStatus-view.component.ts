import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { InsurancePolicyStatusService } from './insurancePolicyStatus.service';
import { IInsurancePolicyStatus } from './insurancePolicyStatus';

@Component({
    templateUrl: './insurancePolicyStatus-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class InsurancePolicyStatusViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    insurancePolicyStatus: IInsurancePolicyStatus = {} as IInsurancePolicyStatus;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private insurancePolicyStatusService: InsurancePolicyStatusService, 
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
        this.insurancePolicyStatusService.getById(this.selectedId).subscribe({
            next: data => {
                this.insurancePolicyStatus = data.data;
                this.permission = data.permission; 
                this.populateUI(this.insurancePolicyStatus);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IInsurancePolicyStatus): void { 
        this.Caption = "InsurancePolicyStatus Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/insurancePolicyStatus/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

