import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import {
    CustomerPortalSupportAttachmentRequirement,
    CustomerPortalSupportLookupItem,
    CustomerPortalSupportParty,
    CustomerPortalSupportPicklistItem,
    CustomerPortalWorkspaceService
} from './customer-portal-workspace.service';
import { workspaceStyles } from './customer-portal-contracts.component';

@Component({
    selector: 'app-customer-portal-support-create',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <section class="portal-workspace">
      <div class="heading">
        <div><p class="eyebrow">Customer Portal</p><h1>Create Support Ticket</h1><p>Give our support team the information needed to help you.</p></div>
        <a routerLink="/customer-portal/support">Back to tickets</a>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>
      <p *ngIf="loading" class="state">Loading ticket options…</p>

      <form *ngIf="!loading" class="form-card" (ngSubmit)="create()">
        <div class="form-grid">
          <div class="field required"><label for="party">Party</label><select id="party" [(ngModel)]="draft.PartyId" name="PartyId" (ngModelChange)="onPartyChanged()"><option [ngValue]="null">Select party</option><option *ngFor="let party of parties" [ngValue]="party.Id">{{ party.Name }}</option></select></div>
          <div class="field"><label for="location">Party Location</label><select id="location" [(ngModel)]="draft.PartyLocationId" name="PartyLocationId" [disabled]="!draft.PartyId"><option [ngValue]="null">Select location</option><option *ngFor="let item of partyLocations" [ngValue]="item.Id">{{ item.DisplayText }}</option></select></div>
          <div class="field"><label for="profile">Customer Profile</label><select id="profile" [(ngModel)]="draft.CustomerProfileId" name="CustomerProfileId" [disabled]="!draft.PartyId"><option [ngValue]="null">Select customer profile</option><option *ngFor="let item of customerProfiles" [ngValue]="item.Id">{{ item.DisplayText }}</option></select></div>
          <div class="field"><label for="contract">Lease Contract</label><select id="contract" [(ngModel)]="draft.LeaseContractId" name="LeaseContractId" [disabled]="!draft.PartyId"><option [ngValue]="null">Select lease contract</option><option *ngFor="let item of leaseContracts" [ngValue]="item.Id">{{ item.DisplayText }}</option></select></div>
          <div class="field"><label for="asset">Asset</label><select id="asset" [(ngModel)]="draft.AssetId" name="AssetId" [disabled]="!draft.PartyId" (ngModelChange)="onAssetChanged()"><option [ngValue]="null">Select asset</option><option *ngFor="let item of assets" [ngValue]="item.Id">{{ item.DisplayText }}</option></select></div>
          <div class="field"><label for="assetUser">Asset User</label><select id="assetUser" [(ngModel)]="draft.AssetUserId" name="AssetUserId" [disabled]="!draft.AssetId"><option [ngValue]="null">Select asset user</option><option *ngFor="let item of assetUsers" [ngValue]="item.Id">{{ item.DisplayText }}</option></select></div>
          <div class="field"><label for="contact">Party Contact</label><select id="contact" [(ngModel)]="draft.RequesterPartyContactId" name="RequesterPartyContactId" [disabled]="!draft.PartyId"><option [ngValue]="null">Select party contact</option><option *ngFor="let item of partyContacts" [ngValue]="item.Id">{{ item.DisplayText }}</option></select></div>
          <div class="field required"><label for="ticketType">Ticket Type</label><select id="ticketType" [(ngModel)]="draft.TicketTypeCode" name="TicketTypeCode"><option [ngValue]="''">Select ticket type</option><option *ngFor="let item of ticketTypes" [value]="item.Value">{{ item.Text }}</option></select></div>
          <div class="field required"><label for="category">Category</label><select id="category" [(ngModel)]="draft.CategoryCode" name="CategoryCode"><option [ngValue]="''">Select category</option><option *ngFor="let item of categories" [value]="item.Value">{{ item.Text }}</option></select></div>
          <div class="field required"><label for="priority">Priority</label><select id="priority" [(ngModel)]="draft.PriorityCode" name="PriorityCode"><option [ngValue]="''">Select priority</option><option *ngFor="let item of priorities" [value]="item.Value">{{ item.Text }}</option></select></div>
          <div class="field full required"><label for="subject">Subject</label><input id="subject" type="text" [(ngModel)]="draft.Subject" name="Subject" maxlength="250" /></div>
          <div class="field full required"><label for="description">Description</label><textarea id="description" [(ngModel)]="draft.Description" name="Description" rows="5" maxlength="4000"></textarea></div>
          <div class="field full attachment-field">
            <label>Supporting Attachments <span>(optional)</span></label>
            <p *ngIf="attachmentsLoading" class="hint">Loading attachment types…</p>
            <p *ngIf="attachmentConfigurationError" class="hint error">{{ attachmentConfigurationError }}</p>
            <p *ngIf="!attachmentsLoading && !attachmentConfigurationError && !attachmentRequirements.length" class="hint">No attachment type has been configured for this portal tenant.</p>
            <div *ngIf="attachmentRequirements.length" class="attachment-picker">
              <select [(ngModel)]="selectedAttachmentRequirementId" name="AttachmentRequirement"><option *ngFor="let requirement of attachmentRequirements" [ngValue]="requirement.Id">{{ requirement.DisplayName }}</option></select>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" (change)="onAttachmentSelected($event)">
              <input type="text" maxlength="250" [(ngModel)]="selectedAttachmentTitle" name="AttachmentTitle" placeholder="Attachment title (optional)">
              <button type="button" class="secondary" (click)="addAttachment()" [disabled]="!selectedAttachmentFile || !selectedAttachmentRequirementId">Add attachment</button>
            </div>
            <ul *ngIf="pendingAttachments.length" class="pending-attachments">
              <li *ngFor="let attachment of pendingAttachments; let index = index"><span>{{ attachment.file.name }} — {{ attachment.requirementName }}</span><button type="button" (click)="removeAttachment(index)">Remove</button></li>
            </ul>
          </div>
        </div>
        <div class="actions"><a routerLink="/customer-portal/support" class="secondary">Cancel</a><button type="submit" class="primary-action" [disabled]="saving">{{ saving ? 'Creating…' : 'Create Ticket' }}</button></div>
      </form>
    </section>
    `,
    styles: [workspaceStyles, `
      .form-card{padding:1.25rem;border:1px solid var(--surface-border);border-radius:.75rem;background:var(--surface-card)}
      .form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
      .field{display:flex;flex-direction:column;gap:.35rem}.field.full{grid-column:1 / -1}.field label{font-weight:700}.field.required label:after{content:' *';color:#b42318}
      .field input,.field select,.field textarea{width:100%;box-sizing:border-box;padding:.65rem;border:1px solid var(--surface-border);border-radius:.4rem;background:var(--surface-card);color:var(--text-color)}
      .field select:disabled{opacity:.6;background:var(--surface-ground)}.field label span,.hint{color:var(--text-color-secondary);font-weight:400}.hint{margin:0}.attachment-picker{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:.65rem;align-items:center}.attachment-picker input[type=file]{padding:.45rem}.pending-attachments{margin:0;padding-left:1.1rem}.pending-attachments li{display:flex;justify-content:space-between;gap:.75rem;padding:.2rem 0}.pending-attachments button{border:0;background:none;color:#1d6f8c;cursor:pointer}.actions{display:flex;justify-content:flex-end;gap:.75rem;margin-top:1.25rem}.secondary{display:inline-flex;align-items:center;padding:.65rem .95rem;border:1px solid var(--surface-border);border-radius:.4rem;background:var(--surface-card);text-decoration:none;color:var(--text-color);cursor:pointer}.primary-action{padding:.65rem .95rem;border:0;border-radius:.4rem;background:#1d6f8c;color:#fff;font-weight:700;cursor:pointer}.primary-action:disabled{opacity:.6;cursor:wait}
      @media(max-width:760px){.attachment-picker{grid-template-columns:1fr 1fr}}@media(max-width:640px){.form-grid,.attachment-picker{grid-template-columns:1fr}.actions{flex-direction:column-reverse}.actions>*{justify-content:center;text-align:center}}
    `]
})
export class CustomerPortalSupportCreateComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    parties: CustomerPortalSupportParty[] = [];
    partyLocations: CustomerPortalSupportLookupItem[] = [];
    customerProfiles: CustomerPortalSupportLookupItem[] = [];
    leaseContracts: CustomerPortalSupportLookupItem[] = [];
    assets: CustomerPortalSupportLookupItem[] = [];
    assetUsers: CustomerPortalSupportLookupItem[] = [];
    partyContacts: CustomerPortalSupportLookupItem[] = [];
    ticketTypes: CustomerPortalSupportPicklistItem[] = [];
    categories: CustomerPortalSupportPicklistItem[] = [];
    priorities: CustomerPortalSupportPicklistItem[] = [];
    attachmentRequirements: CustomerPortalSupportAttachmentRequirement[] = [];
    pendingAttachments: Array<{ documentRequirementId: number; requirementName: string; file: File; title: string }> = [];
    selectedAttachmentRequirementId: number | null = null;
    selectedAttachmentFile?: File;
    selectedAttachmentTitle = '';
    private attachmentInput?: HTMLInputElement;
    attachmentsLoading = false;
    attachmentConfigurationError = '';
    loading = true;
    saving = false;
    error = '';
    draft = this.emptyDraft();

    constructor(private readonly workspace: CustomerPortalWorkspaceService, private readonly router: Router) {}

    ngOnInit(): void {
        this.workspace.supportTicketPicklists().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: picklists => {
                this.ticketTypes = picklists?.TicketTypes || [];
                this.categories = picklists?.Categories || [];
                this.priorities = picklists?.Priorities || [];
                this.draft.TicketTypeCode = this.defaultValue(this.ticketTypes, 'ISSUE');
                this.draft.CategoryCode = this.defaultValue(this.categories, 'GENERAL');
                this.draft.PriorityCode = this.defaultValue(this.priorities, 'NORMAL');
            },
            error: () => this.error = 'Ticket picklist options could not be loaded.'
        });

        this.workspace.supportParties().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: parties => {
                this.parties = parties || [];
                if (this.parties.length === 1) {
                    this.draft.PartyId = this.parties[0].Id;
                    this.loadRelatedLookups();
                }
            },
            error: () => this.error = 'Your available parties could not be loaded.',
            complete: () => this.loading = false
        });

        this.attachmentsLoading = true;
        this.workspace.supportTicketAttachmentRequirements().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: requirements => {
                this.attachmentRequirements = requirements || [];
                this.selectedAttachmentRequirementId = this.attachmentRequirements[0]?.Id ?? null;
            },
            error: () => this.attachmentConfigurationError = 'Attachment types could not be loaded.',
            complete: () => this.attachmentsLoading = false
        });
    }

    onPartyChanged(): void {
        this.draft.PartyLocationId = null;
        this.draft.CustomerProfileId = null;
        this.draft.LeaseContractId = null;
        this.draft.AssetId = null;
        this.draft.AssetUserId = null;
        this.draft.RequesterPartyContactId = null;
        this.clearRelatedLookups();
        this.loadRelatedLookups();
    }

    onAssetChanged(): void {
        this.draft.AssetUserId = null;
        this.assetUsers = [];
        this.loadRelatedLookups();
    }

    create(): void {
        if (!this.isValid()) {
            this.error = 'Complete all required fields before creating the ticket.';
            return;
        }

        this.saving = true;
        this.error = '';
        const attachments = [...this.pendingAttachments];
        this.workspace.createSupportTicket(this.draft).pipe(
            switchMap(ticket => {
                if (!attachments.length) return of({ ticket, attachmentUploadFailed: false });
                return forkJoin(attachments.map(attachment => this.workspace.uploadSupportTicketAttachment(
                    ticket.Id,
                    attachment.documentRequirementId,
                    attachment.file,
                    attachment.title
                ).pipe(map(() => true), catchError(() => of(false))))).pipe(
                    map(results => ({ ticket, attachmentUploadFailed: results.some(result => !result) }))
                );
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: result => this.router.navigate(['/customer-portal/support', result.ticket.Id], {
                queryParams: result.attachmentUploadFailed ? { attachments: 'retry' } : undefined
            }),
            error: () => {
                this.error = 'The ticket could not be created. Please check the selected information and try again.';
                this.saving = false;
            },
            complete: () => this.saving = false
        });
    }

    onAttachmentSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.attachmentInput = input;
        this.selectedAttachmentFile = input.files?.[0];
        if (this.selectedAttachmentFile && !this.selectedAttachmentTitle) {
            this.selectedAttachmentTitle = this.selectedAttachmentFile.name.replace(/\.[^/.]+$/, '');
        }
    }

    addAttachment(): void {
        if (!this.selectedAttachmentFile || !this.selectedAttachmentRequirementId) return;
        const requirement = this.attachmentRequirements.find(item => item.Id === this.selectedAttachmentRequirementId);
        if (!requirement) return;

        this.pendingAttachments.push({
            documentRequirementId: requirement.Id,
            requirementName: requirement.DisplayName,
            file: this.selectedAttachmentFile,
            title: this.selectedAttachmentTitle || this.selectedAttachmentFile.name.replace(/\.[^/.]+$/, '')
        });
        this.selectedAttachmentFile = undefined;
        this.selectedAttachmentTitle = '';
        if (this.attachmentInput) this.attachmentInput.value = '';
    }

    removeAttachment(index: number): void {
        this.pendingAttachments.splice(index, 1);
    }

    private loadRelatedLookups(): void {
        if (!this.draft.PartyId) return;

        this.workspace.supportTicketLookups(this.draft.PartyId, this.draft.AssetId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: lookups => {
                this.partyLocations = lookups?.PartyLocations || [];
                this.customerProfiles = lookups?.CustomerProfiles || [];
                this.leaseContracts = lookups?.LeaseContracts || [];
                this.assets = lookups?.Assets || [];
                this.assetUsers = lookups?.AssetUsers || [];
                this.partyContacts = lookups?.PartyContacts || [];
            },
            error: () => this.error = 'Ticket lookup options could not be loaded for the selected party.'
        });
    }

    private clearRelatedLookups(): void {
        this.partyLocations = [];
        this.customerProfiles = [];
        this.leaseContracts = [];
        this.assets = [];
        this.assetUsers = [];
        this.partyContacts = [];
    }

    private isValid(): boolean {
        return !!(this.draft.PartyId && this.draft.TicketTypeCode && this.draft.CategoryCode && this.draft.PriorityCode && this.draft.Subject.trim() && this.draft.Description.trim());
    }

    private defaultValue(options: CustomerPortalSupportPicklistItem[], preferred: string): string {
        return options.find(option => option.Value === preferred)?.Value || options[0]?.Value || '';
    }

    private emptyDraft() {
        return {
            PartyId: null as number | null,
            PartyLocationId: null as number | null,
            CustomerProfileId: null as number | null,
            LeaseContractId: null as number | null,
            AssetId: null as number | null,
            AssetUserId: null as number | null,
            RequesterPartyContactId: null as number | null,
            TicketTypeCode: '',
            CategoryCode: '',
            PriorityCode: '',
            Subject: '',
            Description: ''
        };
    }
}
