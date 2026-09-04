import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { MaintenancePlanService } from './maintenancePlan.service';
import { IMaintenancePlan } from './maintenancePlan';

@Component({
    templateUrl: './maintenancePlan-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class MaintenancePlanViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    maintenancePlan: IMaintenancePlan = {} as IMaintenancePlan;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private maintenancePlanService: MaintenancePlanService, 
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
        this.maintenancePlanService.getById(this.selectedId).subscribe({
            next: data => {
                this.maintenancePlan = data.data;
                this.permission = data.permission; 
                this.populateUI(this.maintenancePlan);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IMaintenancePlan): void { 
        this.Caption = "MaintenancePlan Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/maintenancePlan/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

