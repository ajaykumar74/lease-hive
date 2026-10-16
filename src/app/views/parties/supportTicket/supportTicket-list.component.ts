import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { SupportTicketService } from './supportTicket.service';
import { ISupportTicket } from './supportTicket';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';

@Component({ selector: 'app-support-ticket-list', standalone: false, templateUrl: './supportTicket-list.component.html' })
export class SupportTicketListComponent implements OnInit {
    tickets: ISupportTicket[] = []; partyOptions: ISelectItem[] = []; categoryOptions: ISelectItem[] = [];
    priorityOptions: ISelectItem[] = []; statusOptions: ISelectItem[] = [];
    filters = { TicketId: '', PartyId: null as number | null, CategoryCode: '' }; loading = false;
    Caption = 'Support Ticket List';
    permission = { CanCreate: true, CanUpdate: true, CanDelete: false } as IPermission;
    @ViewChild(SpinnerComponent) spinner?: SpinnerComponent;
    @ViewChild(MessageComponent) messageService?: MessageComponent;
    constructor(private readonly ticketsService: SupportTicketService, private readonly router: Router, private readonly users: LoggedInUserService) { }
    ngOnInit(): void {
        this.users.getPartyOptions().subscribe(options => this.partyOptions = options);
        this.categoryOptions = this.users.getPicklistOptions('SupportTicketCategory');
        this.priorityOptions = this.users.getPicklistOptions('SupportTicketPriority');
        this.statusOptions = this.users.getPicklistOptions('SupportTicketStatus');
        this.search();
    }
    search(): void { this.loading = true; this.ticketsService.search({ ...this.filters, Skip: 0, Take: 100 }).subscribe({ next: result => this.tickets = result.Records, error: error => { this.tickets = []; this.messageService?.showError(error); }, complete: () => this.loading = false }); }
    clear(): void { this.filters = { TicketId: '', PartyId: null, CategoryCode: '' }; this.search(); }
    getLabel(options: ISelectItem[], value: string): string { return options.find(option => option.Value === value)?.Text || value || '-'; }
    open(ticket: ISupportTicket): void { this.router.navigate(['/business/support/tickets/edit', ticket.Id]); }
    create(): void { this.router.navigate(['/business/support/tickets/create']); }
    onOptionItemClicked(action: string): void { if (action === 'Create') this.create(); else if (action === 'Refresh') this.search(); }
}
