import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { AppConstants } from '@/shared/constants/AppConstants'
import { SupportTicketService } from './supportTicket.service';
import { ISupportTicket, ITicketMessage, ITicketStatusHistory, TagSeverity } from './supportTicket';
import { IBrandPartner } from '../brandPartner/brandPartner';

@Component({
    templateUrl: './supportTicket-view.component.html',
    standalone: false,
    providers: [MessageService]
})
export class SupportTicketViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    supportTicket: ISupportTicket = {} as ISupportTicket;
    ticketMessage: ITicketMessage = {} as ITicketMessage;
    ticketStatusHistory: ITicketStatusHistory[] = [];
    Caption: string = 'Loading...';
    isCustomer: boolean = false;
    editForm: any;
    objMaster: ISupportTicket = {} as ISupportTicket;
    isShowHistory: boolean = false;

    constructor(
        private readonly router: Router,
        private readonly activatedRouter: ActivatedRoute,
        private readonly supportTicketService: SupportTicketService,
        private readonly loggedInUserService: LoggedInUserService,
        private readonly fb: FormBuilder,
        private readonly appConstants: AppConstants,
    ) {

    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;
    @ViewChild('messageContainer') private messageContainer!: ElementRef;
    brandPartner: IBrandPartner;

    // Todo move in SupportTicketService
    getTagSeverity(key: string | null | undefined): TagSeverity {
        const map: Record<string, TagSeverity> = {
            high: 'danger',
            medium: 'warn',
            low: 'info',

            Open: 'warn',
            InProgress: 'info',
            Resolved: 'secondary',
            Closed: 'success',
            Reopened: 'danger',
        };
        return map[key?.toLowerCase() ?? ''] ?? 'info';
    }


    ngOnInit(): void {
        this.isCustomer = (this.loggedInUserService.loggedInUser?.AccountType === 'Customer')
        this.selectedId = this.activatedRouter.snapshot.params['id'];
        this.brandPartner = this.loggedInUserService.loggedInUser.BrandPartner;
        this.objMaster = { ...this.supportTicket };

        this.editForm = this.fb.group({
            Message: new FormControl('', [Validators.maxLength(2000),]),
            IsInternalNote: new FormControl(false),
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.supportTicketService.getById(this.selectedId).subscribe({
            next: data => {
                this.supportTicket = data.data;
                if (this.isCustomer) {// don't show internal notes to Customer
                    this.supportTicket.TicketMessages = this.supportTicket.TicketMessages.filter(m => !m.IsInternalNote);
                }
                this.supportTicket.LoggedInUserFormatted = JSON.stringify(JSON.parse(this.supportTicket.LoggedInUserJson), null, 2);
                this.permission = data.permission;
                this.objMaster = { ...this.supportTicket };
                this.populateUI(this.supportTicket);
                setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    this.scrollToMessageBottom();
                }, 50);


            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: ISupportTicket): void {
        this.editForm.patchValue(
            {
                Message: this.ticketMessage.Message || '',
                IsInternalNote: this.ticketMessage.IsInternalNote || false,
            }
        );
        this.Caption = "SupportTicket Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {
            this.loadUI();
        }
    }



    onSaveMessage() {
        // get from from
        const supportTicketCopy = this.PopulateMessageCreateObj();

        this.spinner.show();
        this.supportTicketService.update(this.supportTicket.Id, supportTicketCopy).subscribe({
            next: data => {
                // update UI
                this.supportTicket.TicketMessages.push({ ...this.ticketMessage });
                if (this.isCustomer && this.supportTicket.Status === this.appConstants.SupportTicketStatus.Closed) {
                    this.supportTicket.Status = this.appConstants.SupportTicketStatus.Reopened;
                }
                else if (!this.isCustomer && (this.supportTicket.Status === this.appConstants.SupportTicketStatus.Open ||
                    this.supportTicket.Status === this.appConstants.SupportTicketStatus.Reopened)) {
                    this.supportTicket.Status = this.appConstants.SupportTicketStatus.InProgress;
                }
                // clear object
                this.editForm.patchValue({ Message: '', IsInternalNote: false });
                this.ticketMessage.Message = '';
                this.ticketMessage.IsInternalNote = false;
                this.supportTicketService.CacheData.IsLoaded = false;

                setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    this.scrollToMessageBottom();
                }, 50);
            },
            error: err => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.messageService.showError(err);
                this.spinner.hide();
            },
            complete: () => { this.spinner.hide(); }
        });
    }

    private PopulateMessageCreateObj() {
        this.ticketMessage.Message = this.editForm.value.Message;
        this.ticketMessage.IsInternalNote = this.editForm.value.IsInternalNote;

        // set other vals
        this.ticketMessage.TicketId = this.selectedId;
        this.ticketMessage.CreatedDateTime = new Date;

        if (this.isCustomer) {
            this.ticketMessage.SenderType = this.appConstants.SupportTicketSender.Customer;
            this.ticketMessage.SenderId = this.loggedInUserService.loggedInUser.Customer.Id;
            this.ticketMessage.CreatedByCode = this.loggedInUserService.loggedInUser.Name; // to show on UI
        }
        else {
            this.ticketMessage.SenderType = this.appConstants.SupportTicketSender.BrandPartner;
            this.ticketMessage.SenderId = this.loggedInUserService.loggedInUser.BrandPartner.Id;
            this.ticketMessage.CreatedByCode = this.loggedInUserService.loggedInUser.BrandPartner.ShortName; // to show on UI
        }

        this.isLoading = true;
        const supportTicketCopy = { ...this.supportTicket, TicketMessages: [] };
        supportTicketCopy.TicketMessages.push(this.ticketMessage);
        supportTicketCopy.RowVersionStr = this.objMaster.RowVersionStr;
        return supportTicketCopy;
    }


    scrollToMessageBottom(): void {
        try {
            const container = this.messageContainer.nativeElement;
            container.scrollTop = container.scrollHeight;
        } catch (err) {

        }
    }
    onUpdateTicketStatus(key: string) {
        this.supportTicket.Status = key;
        this.isLoading = true;
        const supportTicketCopy = { ...this.supportTicket, TicketMessages: [] };

        this.spinner.show();
        this.supportTicketService.update(this.supportTicket.Id, supportTicketCopy).subscribe({
            next: data => {
                this.messageService.showSuccess('Ticket status updated successfully.');
            },
            error: err => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.messageService.showError(err);
                this.spinner.hide();
            },
            complete: () => { this.spinner.hide(); }
        });

    }

    onShowTicketStatusHistory() {

        this.isLoading = true;
        this.spinner.show();
        this.supportTicketService.getTicketHistory(this.supportTicket.Id).subscribe({
            next: data => {
                this.isShowHistory = true;
                this.ticketStatusHistory = data;
            },
            error: err => {
               this.messageService.showError(err);
                this.spinner.hide();
            },
            complete: () => { this.spinner.hide(); }
        });
    }

}

