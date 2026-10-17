import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    CustomerPortalSupportAttachment,
    CustomerPortalSupportAttachmentRequirement,
    CustomerPortalSupportTicket,
    CustomerPortalWorkspaceService
} from './customer-portal-workspace.service';
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
          <h2>Attachments</h2>
          <p *ngIf="attachmentNotice" class="error">{{ attachmentNotice }}</p>
          <p *ngIf="attachmentsLoading" class="state">Loading attachments…</p>
          <p *ngIf="attachmentError" class="error">{{ attachmentError }}</p>
          <ng-container *ngIf="!attachmentsLoading">
            <p *ngIf="!attachmentRequirements.length" class="state">Attachments are not configured for support tickets yet.</p>
            <div *ngIf="attachmentRequirements.length" class="reply-box attachment-upload">
              <label for="attachmentType">Document type</label>
              <select id="attachmentType" [(ngModel)]="selectedAttachmentRequirementId" [disabled]="uploadingAttachment">
                <option *ngFor="let requirement of attachmentRequirements" [ngValue]="requirement.Id">{{ requirement.DisplayName }}</option>
              </select>
              <label for="attachmentFile">File</label>
              <input id="attachmentFile" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" (change)="onAttachmentSelected($event)" [disabled]="uploadingAttachment">
              <label for="attachmentTitle">Title <span>(optional)</span></label>
              <input id="attachmentTitle" type="text" maxlength="250" [(ngModel)]="attachmentTitle" placeholder="Describe the attachment" [disabled]="uploadingAttachment">
              <div class="reply-actions"><small *ngIf="selectedAttachmentRequirement">PDF, JPG or PNG · maximum {{ formatFileSize(selectedAttachmentRequirement.MaxFileSizeBytes) }}</small><button type="button" class="primary-action" (click)="uploadAttachment()" [disabled]="uploadingAttachment || !selectedAttachmentFile || !selectedAttachmentRequirementId">{{ uploadingAttachment ? 'Uploading…' : 'Add Attachment' }}</button></div>
            </div>
            <div *ngIf="attachments.length" class="attachments-list">
              <article *ngFor="let attachment of attachments" class="attachment">
                <div><strong>{{ attachment.Title || attachment.OriginalFileName }}</strong><small>{{ attachment.DocumentTypeName || attachment.DocumentTypeCode }} · {{ attachment.StoredSizeBytes | number }} bytes · {{ attachment.UploadedAtUtc | date:'medium' }}</small></div>
                <button type="button" class="download-action" (click)="downloadAttachment(attachment)">Download</button>
              </article>
            </div>
          </ng-container>
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
      .reply-box{border-top:1px solid var(--surface-border);padding-top:1rem}.reply-box label{display:block;font-weight:700;margin:.55rem 0 .35rem}.reply-box label:first-child{margin-top:0}.reply-box label span,.reply-actions small,.attachment small{color:var(--text-color-secondary);font-weight:400}.reply-box textarea,.reply-box select,.reply-box input[type=text]{width:100%;box-sizing:border-box;padding:.7rem;border:1px solid var(--surface-border);border-radius:.4rem;background:var(--surface-card);color:var(--text-color)}.reply-actions{display:flex;justify-content:space-between;gap:.75rem;align-items:center;margin-top:.65rem}.primary-action{padding:.65rem .95rem;border:0;border-radius:.4rem;background:#1d6f8c;color:#fff;font-weight:700;cursor:pointer}.primary-action:disabled{opacity:.6;cursor:wait}.attachments-list{margin-top:1rem;border-top:1px solid var(--surface-border)}.attachment{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:.75rem 0;border-bottom:1px solid var(--surface-border)}.attachment strong,.attachment small{display:block}.attachment small{margin-top:.2rem}.download-action{border:1px solid var(--surface-border);border-radius:.4rem;padding:.45rem .65rem;background:var(--surface-card);color:var(--text-color);cursor:pointer}
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
    attachmentRequirements: CustomerPortalSupportAttachmentRequirement[] = [];
    attachments: CustomerPortalSupportAttachment[] = [];
    selectedAttachmentRequirementId: number | null = null;
    selectedAttachmentFile?: File;
    attachmentTitle = '';
    attachmentsLoading = false;
    uploadingAttachment = false;
    attachmentError = '';
    attachmentNotice = '';

    constructor(private readonly route: ActivatedRoute, private readonly workspace: CustomerPortalWorkspaceService) {}

    ngOnInit(): void {
        if (this.route.snapshot.queryParamMap.get('attachments') === 'retry') {
            this.attachmentNotice = 'The ticket was created, but one or more selected files could not be uploaded. Please add them below.';
        }
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

    get selectedAttachmentRequirement(): CustomerPortalSupportAttachmentRequirement | undefined {
        return this.attachmentRequirements.find(requirement => requirement.Id === this.selectedAttachmentRequirementId);
    }

    onAttachmentSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.selectedAttachmentFile = input.files?.[0];
        if (this.selectedAttachmentFile && !this.attachmentTitle) {
            this.attachmentTitle = this.selectedAttachmentFile.name.replace(/\.[^/.]+$/, '');
        }
    }

    uploadAttachment(): void {
        if (!this.ticket || !this.selectedAttachmentFile || !this.selectedAttachmentRequirementId) return;

        this.uploadingAttachment = true;
        this.attachmentError = '';
        this.attachmentNotice = '';
        this.workspace.uploadSupportTicketAttachment(
            this.ticket.Id,
            this.selectedAttachmentRequirementId,
            this.selectedAttachmentFile,
            this.attachmentTitle
        ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.selectedAttachmentFile = undefined;
                this.attachmentTitle = '';
                this.loadAttachments(this.ticket!.Id);
            },
            error: () => {
                this.attachmentError = 'The attachment could not be uploaded. Please check the file and try again.';
                this.uploadingAttachment = false;
            },
            complete: () => this.uploadingAttachment = false
        });
    }

    downloadAttachment(attachment: CustomerPortalSupportAttachment): void {
        if (!this.ticket) return;

        this.attachmentError = '';
        this.workspace.downloadSupportTicketAttachment(this.ticket.Id, attachment.DocumentId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: content => {
                    const url = URL.createObjectURL(content);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = attachment.OriginalFileName || attachment.Title || 'attachment';
                    link.click();
                    URL.revokeObjectURL(url);
                },
                error: () => this.attachmentError = 'The attachment could not be downloaded. Please try again.'
            });
    }

    formatFileSize(bytes: number): string {
        if (!bytes || bytes < 1024) return `${bytes || 0} bytes`;
        if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    private loadTicket(id: number): void {
        this.loading = true;
        this.workspace.supportTicket(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ticket => {
                this.ticket = ticket;
                this.loadAttachments(ticket.Id);
            },
            error: () => {
                this.error = 'The support ticket could not be loaded.';
                this.loading = false;
            },
            complete: () => this.loading = false
        });
    }

    private loadAttachments(id: number): void {
        this.attachmentsLoading = true;
        this.attachmentError = '';
        this.workspace.supportTicketAttachments(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => {
                this.attachmentRequirements = result?.Requirements || [];
                this.attachments = result?.Documents || [];
                if (!this.attachmentRequirements.some(requirement => requirement.Id === this.selectedAttachmentRequirementId)) {
                    this.selectedAttachmentRequirementId = this.attachmentRequirements[0]?.Id ?? null;
                }
            },
            error: () => this.attachmentError = 'Attachments could not be loaded.',
            complete: () => this.attachmentsLoading = false
        });
    }
}
