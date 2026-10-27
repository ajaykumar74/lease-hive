import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { QuoteService } from './quote.service';
import { IQuote } from './quote';
import { finalize } from 'rxjs';
import { DocumentTemplateService } from '@/views/documents/documentTemplate/document-template.service';
import { DocumentTemplate } from '@/views/documents/documentTemplate/document-template.models';

@Component({
    templateUrl: './quote-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class QuoteViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    quote: IQuote = {} as IQuote;
    issuedDocument: any = null;
    templates: DocumentTemplate[] = [];
    selectedTemplateId: number | null = null;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private quoteService: QuoteService, 
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
        this.quoteService.getById(this.selectedId).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: data => {
                this.quote = data.data;
                this.permission = data.permission; 
                this.populateUI(this.quote);
                this.loadIssuedDocument();
                this.loadTemplates();
            },
            error: err => this.messageService.showError(err)
        });
    }

    populateUI(obj: IQuote): void { 
        this.Caption = "Quote Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/business/origination/quotes/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

    createRevision(): void {
        if (!['ISSUED', 'ACCEPTED'].includes(this.quote?.StatusCode?.toUpperCase())) {
            return;
        }

        this.isLoading = true;
        this.spinner.show();
        this.quoteService.createRevision(this.quote.Id).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: response => {
                this.router.navigate(['/business/origination/quotes/edit/' + response.Id]);
            },
            error: err => this.messageService.showError(err)
        });
    }

    previewDocument(): void {
        this.runDocumentAction(this.quoteService.previewDocument(this.quote.Id, this.selectedTemplateId || undefined), 'Preview opened.');
    }

    viewIssuedDocument(): void {
        this.runDocumentAction(this.quoteService.downloadIssuedDocument(this.quote.Id), 'Issued quotation opened.');
    }

    sendToCustomer(): void {
        this.isLoading = true;
        this.spinner.show();
        this.quoteService.sendIssuedDocument(this.quote.Id).pipe(finalize(() => {
            this.spinner.hide();
            this.isLoading = false;
        })).subscribe({
            next: () => this.messageService.showSuccess('The issued quotation has been queued for delivery.'),
            error: err => this.messageService.showError(err)
        });
    }

    private loadIssuedDocument(): void {
        this.quoteService.getIssuedDocument(this.selectedId).subscribe({
            next: response => this.issuedDocument = response.data,
            error: () => this.issuedDocument = null
        });
    }

    private loadTemplates(): void {
        this.documentTemplateService.list().subscribe({
            next: templates => this.templates = templates.filter(template => template.TemplateTypeCode === 'QUOTATION' && template.RecordStatus === 'Active'),
            error: () => this.templates = []
        });
    }

    private runDocumentAction(request: any, successMessage: string): void {
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

