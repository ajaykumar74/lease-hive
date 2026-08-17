import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { QuotePartySnapshotService } from './quotePartySnapshot.service';
import { IQuotePartySnapshot } from './quotePartySnapshot';

@Component({
    templateUrl: './quotePartySnapshot-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class QuotePartySnapshotViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    quotePartySnapshot: IQuotePartySnapshot = {} as IQuotePartySnapshot;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private quotePartySnapshotService: QuotePartySnapshotService, 
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
        this.quotePartySnapshotService.getById(this.selectedId).subscribe({
            next: data => {
                this.quotePartySnapshot = data.data;
                this.permission = data.permission; 
                this.populateUI(this.quotePartySnapshot);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IQuotePartySnapshot): void { 
        this.Caption = "QuotePartySnapshot Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/quotePartySnapshot/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

