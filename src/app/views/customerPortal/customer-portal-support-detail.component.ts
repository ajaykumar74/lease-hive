import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerPortalSupportTicket, CustomerPortalWorkspaceService } from './customer-portal-workspace.service';
import { workspaceStyles } from './customer-portal-contracts.component';

@Component({
    selector: 'app-customer-portal-support-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, DatePipe],
    template: `
    <section class="portal-workspace">
      <div class="heading">
        <div>
          <p class="eyebrow">Support Ticket</p>
          <h1>{{ ticket?.TicketId || 'Support Ticket' }}</h1>
          <p *ngIf="ticket">{{ ticket.Subject }}</p>
        </div>
        <a routerLink="/customer-portal/support">Back to tickets</a>
      </div>

      <p *ngIf="loading" class="state">Loading ticket details…</p>
      <p *ngIf="error" class="error">{{ error }}</p>

      <ng-container *ngIf="ticket && !loading">
        <div class="detail-card">
          <div class="ticket-summary"><span class="status">{{ formatStatus(ticket.StatusCode) }}</span><span>Created {{ ticket.RaisedAtUtc | date:'medium' }}</span></div>
          <dl class="detail-grid">
            <div><dt>Party</dt><dd>{{ ticket.PartyName }}</dd></div>
            <div><dt>Ticket type</dt><dd>{{ formatStatus(ticket.TicketTypeCode) }}</dd></div>
            <div><dt>Category</dt><dd>{{ formatStatus(ticket.CategoryCode) }}</dd></div>
            <div><dt>Priority</dt><dd>{{ formatStatus(ticket.PriorityCode) }}</dd></div>
            <div *ngIf="ticket.PartyLocationName"><dt>Party location</dt><dd>{{ ticket.PartyLocationName }}</dd></div>
            <div *ngIf="ticket.CustomerProfileName"><dt>Customer profile</dt><dd>{{ ticket.CustomerProfileName }}</dd></div>
            <div *ngIf="ticket.ContractNo"><dt>Lease contract</dt><dd>{{ ticket.ContractNo }}</dd></div>
            <div *ngIf="ticket.AssetNo"><dt>Asset</dt><dd>{{ ticket.AssetNo }}</dd></div>
          </dl>
          <div class="description"><h2>Request</h2><p>{{ ticket.Description }}</p></div>
          <div class="resolution" *ngIf="ticket.ResolutionSummary"><h2>Resolution</h2><p>{{ ticket.ResolutionSummary }}</p></div>
        </div>

        <div class="conversation-card">
          <h2>Conversation</h2>
          <p *ngIf="!ticket.Messages?.length" class="state">There are no replies yet.</p>
          <div class="messages" *ngIf="ticket.Messages?.length">
            <article *ngFor="let message of ticket.Messages" class="message" [class.customer]="message.SenderTypeCode === 'CUSTOMER'">
              <header><strong>{{ message.SenderName }}</strong><time>{{ message.CreatedDateTime | date:'medium' }}</time></header>
              <p>{{ message.Message }}</p>
            </article>
          </div>
          <div class="reply-box">
            <label for="reply">Reply</label>
            <textarea id="reply" [(ngModel)]="reply" rows="4" maxlength="4000" placeholder="Write a reply to the support team"></textarea>
            <div class="reply-actions"><small>{{ reply.length }}/4000</small><button type="button" class="primary-action" (click)="postReply()" [disabled]="sending || !reply.trim()">{{ sending ? 'Sending…' : 'Send Reply' }}</button></div>
          </div>
        </div>
      </ng-container>
    </section>
    `,
    styles: [workspaceStyles, `
      .detail-card,.conversation-card{padding:1.25rem;border:1px solid var(--surface-border);border-radius:.75rem;background:var(--surface-card)}.conversation-card{margin-top:1rem}
      .ticket-summary{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding-bottom:1rem;border-bottom:1px solid var(--surface-border);color:var(--text-color-secondary)}
      .detail-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem;margin:1rem 0}.detail-grid dt{font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--text-color-secondary)}.detail-grid dd{margin:.25rem 0 0}
      .description,.resolution{margin-top:1rem}.description h2,.resolution h2,.conversation-card h2{font-size:1.05rem;margin:0 0 .45rem}.description p,.resolution p,.message p{white-space:pre-wrap;line-height:1.5;margin:0}
      .messages{display:flex;flex-direction:column;gap:.75rem;margin:1rem 0}.message{max-width:80%;padding:.8rem 1rem;border-radius:.6rem;background:var(--surface-ground)}.message.customer{align-self:flex-end;background:#e7f5fb}.message header{display:flex;justify-content:space-between;gap:1rem;margin-bottom:.35rem}.message time{font-size:.8rem;color:var(--text-color-secondary);white-space:nowrap}
      .reply-box{border-top:1px solid var(--surface-border);padding-top:1rem}.reply-box label{display:block;font-weight:700;margin-bottom:.35rem}.reply-box textarea{width:100%;box-sizing:border-box;padding:.7rem;border:1px solid var(--surface-border);border-radius:.4rem;background:var(--surface-card);color:var(--text-color)}.reply-actions{display:flex;justify-content:space-between;align-items:center;margin-top:.5rem}.reply-actions small{color:var(--text-color-secondary)}.primary-action{padding:.65rem .95rem;border:0;border-radius:.4rem;background:#1d6f8c;color:#fff;font-weight:700;cursor:pointer}.primary-action:disabled{opacity:.6;cursor:wait}
      @media(max-width:760px){.detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.message{max-width:100%}}
    `]
})
export class CustomerPortalSupportDetailComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    ticket?: CustomerPortalSupportTicket;
    reply = '';
    loading = true;
    sending = false;
    error = '';

    constructor(private readonly route: ActivatedRoute, private readonly workspace: CustomerPortalWorkspaceService) {}

    ngOnInit(): void {
        const ticketId = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isInteger(ticketId) || ticketId <= 0) {
            this.error = 'The support ticket reference is invalid.';
            this.loading = false;
            return;
        }

        this.loadTicket(ticketId);
    }

    postReply(): void {
        if (!this.ticket || !this.reply.trim()) return;

        this.sending = true;
        this.error = '';
        this.workspace.postSupportMessage(this.ticket.Id, this.reply).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.reply = '';
                this.loadTicket(this.ticket!.Id);
            },
            error: () => {
                this.error = 'The reply could not be sent. Please try again.';
                this.sending = false;
            },
            complete: () => this.sending = false
        });
    }

    formatStatus(status: string): string {
        return (status || '').replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, character => character.toUpperCase());
    }

    private loadTicket(id: number): void {
        this.loading = true;
        this.workspace.supportTicket(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ticket => this.ticket = ticket,
            error: () => {
                this.error = 'The support ticket could not be loaded.';
                this.loading = false;
            },
            complete: () => this.loading = false
        });
    }
}
