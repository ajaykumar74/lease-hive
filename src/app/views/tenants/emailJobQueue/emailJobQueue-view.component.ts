import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { EmailJobQueueService } from './emailJobQueue.service';
import { IEmailJobQueue } from './emailJobQueue';

@Component({
    templateUrl: './emailJobQueue-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class EmailJobQueueViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    emailJobQueue: IEmailJobQueue = {} as IEmailJobQueue;
    Caption: string = 'Loading...';
    toRecipients: string[] = [];
    ccRecipients: string[] = [];
    bccRecipients: string[] = [];
    attachments: string[] = [];
    

    constructor( 
        private activatedRouter: ActivatedRoute,
        private emailJobQueueService: EmailJobQueueService
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
        this.emailJobQueueService.getById(this.selectedId).subscribe({
            next: data => {
                this.emailJobQueue = data.data;
                this.permission = data.permission; 
                this.populateUI(this.emailJobQueue);
            },
            error: err => { this.messageService.showError(err); },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IEmailJobQueue): void {
        this.Caption = "EmailJobQueue Details #" + obj.Id;
        this.toRecipients = this.parseStringArray(obj.ToRecipientsJson);
        this.ccRecipients = this.parseStringArray(obj.CcRecipientsJson);
        this.bccRecipients = this.parseStringArray(obj.BccRecipientsJson);
        this.attachments = this.parseAttachmentNames(obj.AttachmentsJson);
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {
            this.loadUI();
        }
    }

    private parseStringArray(value: string): string[] {
        if (!value) {
            return [];
        }

        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed
                    .filter(item => typeof item === 'string' && item.trim().length > 0)
                    .map(item => item.trim());
            }
        } catch {
            // Legacy/manual entries can be a semicolon-delimited value rather than JSON.
        }

        return value
            .split(/[;,]/)
            .map(item => item.trim())
            .filter(Boolean);
    }

    private parseAttachmentNames(value: string): string[] {
        if (!value) {
            return [];
        }

        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed
                    .map(item => {
                        if (typeof item === 'string') {
                            return item;
                        }

                        if (item && typeof item === 'object') {
                            return item.Name || item.name || item.FileName || item.fileName || JSON.stringify(item);
                        }

                        return '';
                    })
                    .filter(item => item && item.trim().length > 0)
                    .map(item => item.trim());
            }
        } catch {
            // Preserve a legacy attachment value so it remains visible in the read-only view.
        }

        return [value];
    }

     

    

}

