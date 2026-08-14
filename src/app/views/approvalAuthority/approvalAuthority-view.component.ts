import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { ApprovalAuthorityService } from './approvalAuthority.service';
import { IApprovalAuthority } from './approvalAuthority';

@Component({
    templateUrl: './approvalAuthority-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class ApprovalAuthorityViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    approvalAuthority: IApprovalAuthority = {} as IApprovalAuthority;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private approvalAuthorityService: ApprovalAuthorityService, 
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
        this.approvalAuthorityService.getById(this.selectedId).subscribe({
            next: data => {
                this.approvalAuthority = data.data;
                this.permission = data.permission; 
                this.populateUI(this.approvalAuthority);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IApprovalAuthority): void { 
        this.Caption = "ApprovalAuthority Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/approvalAuthority/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

