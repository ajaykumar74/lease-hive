import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { MaintenanceInsuranceHandoffService } from './maintenanceInsuranceHandoff.service';
import { IMaintenanceInsuranceHandoff } from './maintenanceInsuranceHandoff';

@Component({
    templateUrl: './maintenanceInsuranceHandoff-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class MaintenanceInsuranceHandoffViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    maintenanceInsuranceHandoff: IMaintenanceInsuranceHandoff = {} as IMaintenanceInsuranceHandoff;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private maintenanceInsuranceHandoffService: MaintenanceInsuranceHandoffService, 
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
        this.maintenanceInsuranceHandoffService.getById(this.selectedId).subscribe({
            next: data => {
                this.maintenanceInsuranceHandoff = data.data;
                this.permission = data.permission; 
                this.populateUI(this.maintenanceInsuranceHandoff);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IMaintenanceInsuranceHandoff): void { 
        this.Caption = "MaintenanceInsuranceHandoff Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/maintenance-insurance/handoffs/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

