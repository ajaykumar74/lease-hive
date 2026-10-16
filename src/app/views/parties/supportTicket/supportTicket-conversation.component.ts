import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISupportTicket } from './supportTicket';
import { SupportTicketService } from './supportTicket.service';

@Component({ selector: 'app-support-ticket-conversation', standalone: false, templateUrl: './supportTicket-conversation.component.html' })
export class SupportTicketConversationComponent {
    @Input({ required: true }) ticket!: ISupportTicket;
    @Output() ticketChanged = new EventEmitter<ISupportTicket>();
    message = ''; internalNote = false; saving = false; error = '';
    constructor(private readonly service: SupportTicketService) { }
    post(): void {
        if (!this.message.trim()) return;
        this.saving = true; this.error = '';
        this.service.postMessage(this.ticket.Id, { Message: this.message, IsInternalNote: this.internalNote }).subscribe({
            next: () => { this.message = ''; this.internalNote = false; this.refresh(); },
            error: error => { this.error = typeof error === 'string' ? error : 'Unable to post the message.'; this.saving = false; },
            complete: () => this.saving = false
        });
    }
    private refresh(): void { this.service.getById(this.ticket.Id).subscribe(ticket => { this.ticket = ticket; this.ticketChanged.emit(ticket); }); }
}
