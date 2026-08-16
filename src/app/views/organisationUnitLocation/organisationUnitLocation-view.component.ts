import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { OrganisationUnitLocationService } from './organisationUnitLocation.service';
import { IOrganisationUnitLocation } from './organisationUnitLocation';

@Component({
    templateUrl: './organisationUnitLocation-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class OrganisationUnitLocationViewComponent implements OnInit {
    selectedId: number;
    organisationUnitId: number | null = null;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    organisationUnitLocation: IOrganisationUnitLocation = {} as IOrganisationUnitLocation;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private organisationUnitLocationService: OrganisationUnitLocationService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService
    ) {

    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent; 

       

    ngOnInit(): void { 
        this.selectedId = this.activatedRouter.snapshot.params['id'];
        const routeId = Number(this.activatedRouter.snapshot.paramMap.get('organisationUnitId'));
        this.organisationUnitId = routeId > 0 ? routeId : null;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 1000);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.organisationUnitLocationService.getById(this.selectedId).subscribe({
            next: data => {
                this.organisationUnitLocation = data.data;
                if (this.organisationUnitId && this.organisationUnitLocation.OrganisationUnitId !== this.organisationUnitId) {
                    this.messageService.showError('This record does not belong to the selected organisation unit.');
                    this.router.navigate(['/dashboard/organisationUnitLocations/organisation-unit', this.organisationUnitId]);
                    return;
                }
                this.permission = data.permission; 
                this.populateUI(this.organisationUnitLocation);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IOrganisationUnitLocation): void { 
        this.Caption = "OrganisationUnitLocation Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/organisationUnitLocation/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

