import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { PartyLocationService } from './partyLocation.service';
import { IPartyLocation } from './partyLocation';

@Component({
    templateUrl: './partyLocation-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class PartyLocationViewComponent implements OnInit {
    selectedId: number;
    partyId: number | null = null;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    partyLocation: IPartyLocation = {} as IPartyLocation;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private partyLocationService: PartyLocationService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService
    ) {

    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent; 

       

    ngOnInit(): void { 
        this.selectedId = this.activatedRouter.snapshot.params['id'];
        const routePartyId = Number(this.activatedRouter.snapshot.paramMap.get('partyId'));
        this.partyId = routePartyId > 0 ? routePartyId : null;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 1000);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.partyLocationService.getById(this.selectedId).subscribe({
            next: data => {
                this.partyLocation = data.data;
                if (this.partyId && this.partyLocation.PartyId !== this.partyId) {
                    this.messageService.showError('This record does not belong to the selected party.');
                    this.router.navigate(['/dashboard/partyLocations/party', this.partyId]);
                    return;
                }
                this.permission = data.permission; 
                this.populateUI(this.partyLocation);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IPartyLocation): void { 
        this.Caption = "PartyLocation Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/partyLocation/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

