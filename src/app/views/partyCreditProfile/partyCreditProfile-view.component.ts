import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { PartyCreditProfileService } from './partyCreditProfile.service';
import { IPartyCreditProfile } from './partyCreditProfile';

@Component({
    templateUrl: './partyCreditProfile-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class PartyCreditProfileViewComponent implements OnInit {
    selectedId: number;
    partyId: number | null = null;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    partyCreditProfile: IPartyCreditProfile = {} as IPartyCreditProfile;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private partyCreditProfileService: PartyCreditProfileService, 
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
        this.partyCreditProfileService.getById(this.selectedId).subscribe({
            next: data => {
                this.partyCreditProfile = data.data;
                if (this.partyId && this.partyCreditProfile.PartyId !== this.partyId) {
                    this.messageService.showError('This record does not belong to the selected party.');
                    this.router.navigate(['/business/parties/credit-profiles/party', this.partyId]);
                    return;
                }
                this.permission = data.permission; 
                this.populateUI(this.partyCreditProfile);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IPartyCreditProfile): void { 
        this.Caption = "PartyCreditProfile Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/business/parties/credit-profiles/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

