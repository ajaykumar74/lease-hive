import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { CreditFinancialSnapshotService } from './creditFinancialSnapshot.service';
import { ICreditFinancialSnapshot } from './creditFinancialSnapshot';

@Component({
    templateUrl: './creditFinancialSnapshot-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class CreditFinancialSnapshotViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    creditFinancialSnapshot: ICreditFinancialSnapshot = {} as ICreditFinancialSnapshot;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private creditFinancialSnapshotService: CreditFinancialSnapshotService, 
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
        this.creditFinancialSnapshotService.getById(this.selectedId).subscribe({
            next: data => {
                this.creditFinancialSnapshot = data.data;
                this.permission = data.permission; 
                this.populateUI(this.creditFinancialSnapshot);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: ICreditFinancialSnapshot): void { 
        this.Caption = "CreditFinancialSnapshot Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['origination/credit/snapshot/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

