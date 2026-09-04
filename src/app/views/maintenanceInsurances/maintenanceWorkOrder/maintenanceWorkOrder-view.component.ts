import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { MaintenanceWorkOrderService } from './maintenanceWorkOrder.service';
import { IMaintenanceWorkOrder } from './maintenanceWorkOrder';

@Component({
    templateUrl: './maintenanceWorkOrder-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class MaintenanceWorkOrderViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    maintenanceWorkOrder: IMaintenanceWorkOrder = {} as IMaintenanceWorkOrder;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private maintenanceWorkOrderService: MaintenanceWorkOrderService, 
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
        this.maintenanceWorkOrderService.getById(this.selectedId).subscribe({
            next: data => {
                this.maintenanceWorkOrder = data.data;
                this.permission = data.permission; 
                this.populateUI(this.maintenanceWorkOrder);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IMaintenanceWorkOrder): void { 
        this.Caption = "MaintenanceWorkOrder Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/maintenance-insurance/maintenance/work-orders/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

