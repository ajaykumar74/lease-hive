import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { LeaseAssetAllocationEventService } from './leaseAssetAllocationEvent.service';
import { ILeaseAssetAllocationEvent } from './leaseAssetAllocationEvent';

@Component({
    templateUrl: './leaseAssetAllocationEvent-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class LeaseAssetAllocationEventViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    leaseAssetAllocationEvent: ILeaseAssetAllocationEvent = {} as ILeaseAssetAllocationEvent;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private leaseAssetAllocationEventService: LeaseAssetAllocationEventService, 
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
        this.leaseAssetAllocationEventService.getById(this.selectedId).subscribe({
            next: data => {
                this.leaseAssetAllocationEvent = data.data;
                this.permission = data.permission; 
                this.populateUI(this.leaseAssetAllocationEvent);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: ILeaseAssetAllocationEvent): void { 
        this.Caption = "LeaseAssetAllocationEvent Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/contracts/assets/history/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

