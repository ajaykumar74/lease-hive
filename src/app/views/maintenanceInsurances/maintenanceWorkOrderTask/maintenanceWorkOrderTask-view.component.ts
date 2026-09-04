import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { MaintenanceWorkOrderTaskService } from './maintenanceWorkOrderTask.service';
import { IMaintenanceWorkOrderTask } from './maintenanceWorkOrderTask';

@Component({
    templateUrl: './maintenanceWorkOrderTask-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class MaintenanceWorkOrderTaskViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    maintenanceWorkOrderTask: IMaintenanceWorkOrderTask = {} as IMaintenanceWorkOrderTask;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private maintenanceWorkOrderTaskService: MaintenanceWorkOrderTaskService, 
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
        this.maintenanceWorkOrderTaskService.getById(this.selectedId).subscribe({
            next: data => {
                this.maintenanceWorkOrderTask = data.data;
                this.permission = data.permission; 
                this.populateUI(this.maintenanceWorkOrderTask);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IMaintenanceWorkOrderTask): void { 
        this.Caption = "MaintenanceWorkOrderTask Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/maintenance-insurance/maintenance/work-orders/tasks/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

