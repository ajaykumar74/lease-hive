import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { TenantNotificationRecipientRuleService } from './tenantNotificationRecipientRule.service';
import { ITenantNotificationRecipientRule } from './tenantNotificationRecipientRule';

@Component({
    templateUrl: './tenantNotificationRecipientRule-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class TenantNotificationRecipientRuleViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    tenantNotificationRecipientRule: ITenantNotificationRecipientRule = {} as ITenantNotificationRecipientRule;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private tenantNotificationRecipientRuleService: TenantNotificationRecipientRuleService, 
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
        this.tenantNotificationRecipientRuleService.getById(this.selectedId).subscribe({
            next: data => {
                this.tenantNotificationRecipientRule = data.data;
                this.permission = data.permission; 
                this.populateUI(this.tenantNotificationRecipientRule);
            },
            error: err => { this.messageService.showError(err); },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: ITenantNotificationRecipientRule): void { 
        this.Caption = "TenantNotificationRecipientRule Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {
            this.loadUI();
        }
        else if (key == "Create") {
            this.router.navigate(['/dashboard/notificationRecipientRules/create']);
        }
    }

     

    

}

