import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { DisposalOfferService } from './disposalOffer.service';
import { IDisposalOffer } from './disposalOffer';

@Component({
    templateUrl: './disposalOffer-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class DisposalOfferViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    disposalOffer: IDisposalOffer = {} as IDisposalOffer;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private disposalOfferService: DisposalOfferService, 
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
        this.disposalOfferService.getById(this.selectedId).subscribe({
            next: data => {
                this.disposalOffer = data.data;
                this.permission = data.permission; 
                this.populateUI(this.disposalOffer);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IDisposalOffer): void { 
        this.Caption = "DisposalOffer Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/eol-disposal/disposition/market/offers/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

