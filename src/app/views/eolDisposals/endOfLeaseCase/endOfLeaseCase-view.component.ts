import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { EndOfLeaseCaseService } from './endOfLeaseCase.service';
import { IEndOfLeaseCase } from './endOfLeaseCase';

@Component({
    templateUrl: './endOfLeaseCase-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class EndOfLeaseCaseViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    endOfLeaseCase: IEndOfLeaseCase = {} as IEndOfLeaseCase;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private endOfLeaseCaseService: EndOfLeaseCaseService, 
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
        this.endOfLeaseCaseService.getById(this.selectedId).subscribe({
            next: data => {
                this.endOfLeaseCase = data.data;
                this.permission = data.permission; 
                this.populateUI(this.endOfLeaseCase);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IEndOfLeaseCase): void { 
        this.Caption = "EndOfLeaseCase Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/eol-disposal/cases/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

