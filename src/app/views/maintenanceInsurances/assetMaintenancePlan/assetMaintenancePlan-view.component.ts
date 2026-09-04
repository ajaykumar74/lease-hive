import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { AssetMaintenancePlanService } from './assetMaintenancePlan.service';
import { IAssetMaintenancePlan } from './assetMaintenancePlan';

@Component({
    templateUrl: './assetMaintenancePlan-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class AssetMaintenancePlanViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    assetMaintenancePlan: IAssetMaintenancePlan = {} as IAssetMaintenancePlan;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private assetMaintenancePlanService: AssetMaintenancePlanService, 
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
        this.assetMaintenancePlanService.getById(this.selectedId).subscribe({
            next: data => {
                this.assetMaintenancePlan = data.data;
                this.permission = data.permission; 
                this.populateUI(this.assetMaintenancePlan);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IAssetMaintenancePlan): void { 
        this.Caption = "AssetMaintenancePlan Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/maintenance-insurance/maintenance/asset-plans/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

