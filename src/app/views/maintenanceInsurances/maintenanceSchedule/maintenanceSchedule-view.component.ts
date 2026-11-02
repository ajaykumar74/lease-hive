import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { MaintenanceScheduleService } from './maintenanceSchedule.service';
import { IMaintenanceSchedule } from './maintenanceSchedule';
import { ISelectItem } from '@/shared/ISelectItem';

@Component({
    templateUrl: './maintenanceSchedule-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class MaintenanceScheduleViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    maintenanceSchedule: IMaintenanceSchedule = {} as IMaintenanceSchedule;
    Caption: string = 'Loading...';
    assetDisplayName = '';
    maintenancePlanDisplayName = '';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private maintenanceScheduleService: MaintenanceScheduleService, 
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
        this.maintenanceScheduleService.getById(this.selectedId).subscribe({
            next: data => {
                this.maintenanceSchedule = data.data;
                this.permission = data.permission; 
                this.populateUI(this.maintenanceSchedule);
                this.loadPlanDetails();
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IMaintenanceSchedule): void { 
        this.Caption = "Maintenance Schedule Details #" + obj.Id;
    }

    private loadPlanDetails(): void {
        forkJoin({
            assets: this.loggedInUserService.getEntityLookupOptions('assets', this.maintenanceSchedule.AssetId),
            maintenancePlans: this.loggedInUserService.getEntityLookupOptions('maintenance-plans', this.maintenanceSchedule.MaintenancePlanId)
        }).subscribe({
            next: lookups => {
                this.assetDisplayName = this.lookupText(lookups.assets, this.maintenanceSchedule.AssetId);
                this.maintenancePlanDisplayName = this.lookupText(lookups.maintenancePlans, this.maintenanceSchedule.MaintenancePlanId);
            },
            error: err => this.messageService?.showError(err)
        });
    }

    private lookupText(options: ISelectItem[], id: number): string {
        return options.find(option => Number(option.Value) === id)?.Text ?? '';
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/maintenance-insurance/maintenance/schedules/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

