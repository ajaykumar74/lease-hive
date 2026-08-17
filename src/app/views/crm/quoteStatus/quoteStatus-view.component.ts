import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { QuoteStatusService } from './quoteStatus.service';
import { IQuoteStatus } from './quoteStatus';

@Component({
    templateUrl: './quoteStatus-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class QuoteStatusViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    quoteStatus: IQuoteStatus = {} as IQuoteStatus;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private quoteStatusService: QuoteStatusService, 
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
        this.quoteStatusService.getById(this.selectedId).subscribe({
            next: data => {
                this.quoteStatus = data.data;
                this.permission = data.permission; 
                this.populateUI(this.quoteStatus);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IQuoteStatus): void { 
        this.Caption = "QuoteStatus Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/business/origination/config/quote-statuses/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

