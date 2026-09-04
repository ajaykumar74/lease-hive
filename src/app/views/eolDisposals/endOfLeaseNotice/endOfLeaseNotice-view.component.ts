import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { EndOfLeaseNoticeService } from './endOfLeaseNotice.service';
import { IEndOfLeaseNotice } from './endOfLeaseNotice';

@Component({
    templateUrl: './endOfLeaseNotice-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class EndOfLeaseNoticeViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    endOfLeaseNotice: IEndOfLeaseNotice = {} as IEndOfLeaseNotice;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private endOfLeaseNoticeService: EndOfLeaseNoticeService, 
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
        this.endOfLeaseNoticeService.getById(this.selectedId).subscribe({
            next: data => {
                this.endOfLeaseNotice = data.data;
                this.permission = data.permission; 
                this.populateUI(this.endOfLeaseNotice);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IEndOfLeaseNotice): void { 
        this.Caption = "EndOfLeaseNotice Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/endOfLeaseNotice/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

