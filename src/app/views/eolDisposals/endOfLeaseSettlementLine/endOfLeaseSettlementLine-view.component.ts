import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { EndOfLeaseSettlementLineService } from './endOfLeaseSettlementLine.service';
import { IEndOfLeaseSettlementLine } from './endOfLeaseSettlementLine';

@Component({
    templateUrl: './endOfLeaseSettlementLine-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class EndOfLeaseSettlementLineViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    endOfLeaseSettlementLine: IEndOfLeaseSettlementLine = {} as IEndOfLeaseSettlementLine;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private endOfLeaseSettlementLineService: EndOfLeaseSettlementLineService, 
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
        this.endOfLeaseSettlementLineService.getById(this.selectedId).subscribe({
            next: data => {
                this.endOfLeaseSettlementLine = data.data;
                this.permission = data.permission; 
                this.populateUI(this.endOfLeaseSettlementLine);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IEndOfLeaseSettlementLine): void { 
        this.Caption = "EndOfLeaseSettlementLine Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/eol-disposal/settlements/lines/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

