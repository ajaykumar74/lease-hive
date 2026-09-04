import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { CreditNoteLineService } from './creditNoteLine.service';
import { ICreditNoteLine } from './creditNoteLine';

@Component({
    templateUrl: './creditNoteLine-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class CreditNoteLineViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    creditNoteLine: ICreditNoteLine = {} as ICreditNoteLine;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private creditNoteLineService: CreditNoteLineService, 
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
        this.creditNoteLineService.getById(this.selectedId).subscribe({
            next: data => {
                this.creditNoteLine = data.data;
                this.permission = data.permission; 
                this.populateUI(this.creditNoteLine);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: ICreditNoteLine): void { 
        this.Caption = "CreditNoteLine Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/billing-finance/credit-notes/lines/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

