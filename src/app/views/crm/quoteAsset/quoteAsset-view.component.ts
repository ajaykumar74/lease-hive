import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { QuoteAssetService } from './quoteAsset.service';
import { IQuoteAsset } from './quoteAsset';

@Component({
    templateUrl: './quoteAsset-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class QuoteAssetViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    quoteAsset: IQuoteAsset = {} as IQuoteAsset;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private quoteAssetService: QuoteAssetService, 
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
        this.quoteAssetService.getById(this.selectedId).subscribe({
            next: data => {
                this.quoteAsset = data.data;
                this.permission = data.permission; 
                this.populateUI(this.quoteAsset);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IQuoteAsset): void { 
        this.Caption = "QuoteAsset Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/business/origination/quotes/assets/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

