import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { ContractAmendmentChangeService } from './contractAmendmentChange.service';
import { IContractAmendmentChange } from './contractAmendmentChange';

@Component({
    templateUrl: './contractAmendmentChange-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class ContractAmendmentChangeViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    contractAmendmentChange: IContractAmendmentChange = {} as IContractAmendmentChange;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private contractAmendmentChangeService: ContractAmendmentChangeService, 
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
        this.contractAmendmentChangeService.getById(this.selectedId).subscribe({
            next: data => {
                this.contractAmendmentChange = data.data;
                this.permission = data.permission; 
                this.populateUI(this.contractAmendmentChange);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IContractAmendmentChange): void { 
        this.Caption = "ContractAmendmentChange Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/contracts/amendments/changes/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

