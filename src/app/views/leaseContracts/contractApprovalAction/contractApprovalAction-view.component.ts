import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { ContractApprovalActionService } from './contractApprovalAction.service';
import { IContractApprovalAction } from './contractApprovalAction';

@Component({
    templateUrl: './contractApprovalAction-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class ContractApprovalActionViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    contractApprovalAction: IContractApprovalAction = {} as IContractApprovalAction;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private contractApprovalActionService: ContractApprovalActionService, 
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
        this.contractApprovalActionService.getById(this.selectedId).subscribe({
            next: data => {
                this.contractApprovalAction = data.data;
                this.permission = data.permission; 
                this.populateUI(this.contractApprovalAction);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IContractApprovalAction): void { 
        this.Caption = "ContractApprovalAction Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/contractApprovalAction/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

