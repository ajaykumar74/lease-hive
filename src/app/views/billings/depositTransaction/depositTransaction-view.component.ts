import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { DepositTransactionService } from './depositTransaction.service';
import { IDepositTransaction } from './depositTransaction';

@Component({
    templateUrl: './depositTransaction-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class DepositTransactionViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    depositTransaction: IDepositTransaction = {} as IDepositTransaction;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private depositTransactionService: DepositTransactionService, 
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
        this.depositTransactionService.getById(this.selectedId).subscribe({
            next: data => {
                this.depositTransaction = data.data;
                this.permission = data.permission; 
                this.populateUI(this.depositTransaction);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IDepositTransaction): void { 
        this.Caption = "DepositTransaction Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/depositTransaction/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

