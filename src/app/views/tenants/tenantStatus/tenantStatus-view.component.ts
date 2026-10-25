import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { TenantStatusService } from './tenantStatus.service';
import { ITenantStatus } from './tenantStatus';

@Component({
    templateUrl: './tenantStatus-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class TenantStatusViewComponent implements OnInit {
    selectedId = 0;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    tenantStatus: ITenantStatus = {} as ITenantStatus;
    Caption: string = 'Loading...';
    

    constructor( 
        private activatedRouter: ActivatedRoute,
        private tenantStatusService: TenantStatusService, 
        private _location: Location
    ) {

    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent; 

       

    ngOnInit(): void { 
        this.selectedId = Number(this.activatedRouter.snapshot.params['id']); 
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 1000);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.tenantStatusService.getById(this.selectedId).subscribe({
            next: data => {
                this.tenantStatus = data.data;
                this.permission = data.permission; 
                this.populateUI(this.tenantStatus);
            },
            error: err => this.messageService.showError(err),
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: ITenantStatus): void { 
        this.Caption = "Tenant Status #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {
            this.loadUI();
        }
        else if (key == "Cancel") {
            this._location.back();
        }
    }

     

    

}

