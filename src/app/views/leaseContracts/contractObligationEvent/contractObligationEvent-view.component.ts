import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { ContractObligationEventService } from './contractObligationEvent.service';
import { IContractObligationEvent } from './contractObligationEvent';

@Component({
    templateUrl: './contractObligationEvent-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class ContractObligationEventViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    contractObligationEvent: IContractObligationEvent = {} as IContractObligationEvent;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private contractObligationEventService: ContractObligationEventService, 
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
        this.contractObligationEventService.getById(this.selectedId).subscribe({
            next: data => {
                this.contractObligationEvent = data.data;
                this.permission = data.permission; 
                this.populateUI(this.contractObligationEvent);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IContractObligationEvent): void { 
        this.Caption = "ContractObligationEvent Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/contractObligationEvent/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

