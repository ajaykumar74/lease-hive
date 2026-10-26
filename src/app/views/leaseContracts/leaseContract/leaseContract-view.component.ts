import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { LeaseContractService } from './leaseContract.service';
import { ILeaseContract } from './leaseContract';
import { finalize } from 'rxjs';
import { DocumentTemplateService } from '@/views/documents/documentTemplate/document-template.service';
import { DocumentTemplate } from '@/views/documents/documentTemplate/document-template.models';

@Component({
    templateUrl: './leaseContract-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class LeaseContractViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    leaseContract: ILeaseContract = {} as ILeaseContract;
    agreement: any = null;
    templates: DocumentTemplate[] = [];
    selectedTemplateId: number | null = null;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private leaseContractService: LeaseContractService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService,
        private documentTemplateService: DocumentTemplateService
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
        this.leaseContractService.getById(this.selectedId).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: data => {
                this.leaseContract = data.data;
                this.permission = data.permission; 
                this.populateUI(this.leaseContract);
                this.loadAgreement();
                this.loadTemplates();
            },
            error: err => this.messageService.showError(err)
        });
    }

    populateUI(obj: ILeaseContract): void { 
        this.Caption = "LeaseContract Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/contracts/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

    previewAgreement(): void {
        this.runPdfAction(this.leaseContractService.previewAgreement(this.leaseContract.Id, this.selectedTemplateId || undefined), 'Preview opened.');
    }

    generateAgreement(): void {
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.generateAgreement(this.leaseContract.Id).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                this.agreement = response.data;
                this.messageService.showSuccess('The unsigned lease agreement has been generated.');
            },
            error: err => this.messageService.showError(err)
        });
    }

    viewAgreement(): void {
        this.runPdfAction(this.leaseContractService.downloadAgreement(this.leaseContract.Id), 'Lease agreement opened.');
    }

    sendForSignature(): void {
        this.isLoading = true;
        this.spinner.show();
        this.leaseContractService.sendForSignature(this.leaseContract.Id).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: () => this.messageService.showSuccess('The lease agreement has been queued for signature delivery.'),
            error: err => this.messageService.showError(err)
        });
    }

    private loadAgreement(): void {
        this.leaseContractService.getAgreement(this.selectedId).subscribe({
            next: response => this.agreement = response.data,
            error: () => this.agreement = null
        });
    }

    private loadTemplates(): void {
        this.documentTemplateService.list().subscribe({
            next: templates => this.templates = templates.filter(template => template.TemplateTypeCode === 'LEASE_CONTRACT' && template.RecordStatus === 'Active'),
            error: () => this.templates = []
        });
    }

    private runPdfAction(request: any, successMessage: string): void {
        this.isLoading = true;
        this.spinner.show();
        request.pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: (blob: Blob) => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank', 'noopener');
                window.setTimeout(() => URL.revokeObjectURL(url), 60000);
                this.messageService.showSuccess(successMessage);
            },
            error: (err: any) => this.messageService.showError(err)
        });
    }

     

    

}

