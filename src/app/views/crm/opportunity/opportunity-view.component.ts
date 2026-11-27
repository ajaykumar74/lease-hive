import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { OpportunityService } from './opportunity.service';
import { IOpportunity } from './opportunity';

@Component({
    templateUrl: './opportunity-view.component.html', 
standalone: false,
    styles: [`
        .portal-request-details { margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid #e2e8f0; }
        .portal-request-details h3 { margin: 0 0 .85rem; color: #0f4c6a; font-size: 1.05rem; }
        .portal-request-details table { width: 100%; border-collapse: collapse; }
        .portal-request-details th, .portal-request-details td { padding: .7rem .85rem; border: 1px solid #dbe7ec; text-align: left; vertical-align: top; }
        .portal-request-details th { width: 35%; background: #f1f8fa; color: #31576a; font-size: .8rem; text-transform: uppercase; }
        .portal-request-details td { color: #173c52; white-space: pre-wrap; word-break: break-word; }
    `],
    providers: [MessageService]
})
export class OpportunityViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    opportunity: IOpportunity = {} as IOpportunity;
    Caption: string = 'Loading...';
    portalRequestDetails: Array<{ caption: string; data: string }> = [];
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private opportunityService: OpportunityService, 
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
        this.opportunityService.getById(this.selectedId).subscribe({
            next: data => {
                this.opportunity = data.data;
                this.permission = data.permission; 
                this.populateUI(this.opportunity);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IOpportunity): void { 
        this.Caption = "Opportunity Details #" + obj.Id;
        this.portalRequestDetails = this.formatPortalRequestDetails(obj.PortalRequestConfigurationSnapshotJson);
    }

    private formatPortalRequestDetails(snapshot?: string): Array<{ caption: string; data: string }> {
        if (!snapshot) return [];

        try {
            const configuration = JSON.parse(snapshot);
            if (!configuration || Array.isArray(configuration) || typeof configuration !== 'object') return [];

            return Object.entries(configuration).map(([key, value]) => ({
                caption: this.captionFor(key),
                data: this.formatPortalRequestValue(value)
            }));
        } catch {
            return [];
        }
    }

    private captionFor(key: string): string {
        return key
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            .replace(/[_-]+/g, ' ')
            .replace(/\b\w/g, character => character.toUpperCase());
    }

    private formatPortalRequestValue(value: unknown): string {
        if (Array.isArray(value)) return value.length ? value.join(', ') : 'None';
        if (value === null || value === undefined || value === '') return '—';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/business/crm/opportunities/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

