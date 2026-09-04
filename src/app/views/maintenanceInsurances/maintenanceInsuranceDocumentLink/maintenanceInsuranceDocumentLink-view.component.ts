import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { MaintenanceInsuranceDocumentLinkService } from './maintenanceInsuranceDocumentLink.service';
import { IMaintenanceInsuranceDocumentLink } from './maintenanceInsuranceDocumentLink';

@Component({
    templateUrl: './maintenanceInsuranceDocumentLink-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class MaintenanceInsuranceDocumentLinkViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    maintenanceInsuranceDocumentLink: IMaintenanceInsuranceDocumentLink = {} as IMaintenanceInsuranceDocumentLink;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private maintenanceInsuranceDocumentLinkService: MaintenanceInsuranceDocumentLinkService, 
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
        this.maintenanceInsuranceDocumentLinkService.getById(this.selectedId).subscribe({
            next: data => {
                this.maintenanceInsuranceDocumentLink = data.data;
                this.permission = data.permission; 
                this.populateUI(this.maintenanceInsuranceDocumentLink);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IMaintenanceInsuranceDocumentLink): void { 
        this.Caption = "MaintenanceInsuranceDocumentLink Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/maintenance-insurance/documents/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

