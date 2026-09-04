import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { ContractAssetReturnInstructionService } from './contractAssetReturnInstruction.service';
import { IContractAssetReturnInstruction } from './contractAssetReturnInstruction';

@Component({
    templateUrl: './contractAssetReturnInstruction-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class ContractAssetReturnInstructionViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    contractAssetReturnInstruction: IContractAssetReturnInstruction = {} as IContractAssetReturnInstruction;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private contractAssetReturnInstructionService: ContractAssetReturnInstructionService, 
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
        this.contractAssetReturnInstructionService.getById(this.selectedId).subscribe({
            next: data => {
                this.contractAssetReturnInstruction = data.data;
                this.permission = data.permission; 
                this.populateUI(this.contractAssetReturnInstruction);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IContractAssetReturnInstruction): void { 
        this.Caption = "ContractAssetReturnInstruction Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/contracts/asset-return/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

