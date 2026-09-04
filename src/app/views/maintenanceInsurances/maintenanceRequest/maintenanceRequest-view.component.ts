import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { MaintenanceRequestService } from './maintenanceRequest.service';
import { IMaintenanceRequest } from './maintenanceRequest';

@Component({
    templateUrl: './maintenanceRequest-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class MaintenanceRequestViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    maintenanceRequest: IMaintenanceRequest = {} as IMaintenanceRequest;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private maintenanceRequestService: MaintenanceRequestService, 
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
        this.maintenanceRequestService.getById(this.selectedId).subscribe({
            next: data => {
                this.maintenanceRequest = data.data;
                this.permission = data.permission; 
                this.populateUI(this.maintenanceRequest);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IMaintenanceRequest): void { 
        this.Caption = "MaintenanceRequest Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/maintenance-insurance/maintenance/requests/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

