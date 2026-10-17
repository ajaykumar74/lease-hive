import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    CustomerPortalDocument,
    CustomerPortalDocumentOwner,
    CustomerPortalDocumentRequirement,
    CustomerPortalWorkspaceService
} from './customer-portal-workspace.service';
import { workspaceStyles } from './customer-portal-contracts.component';

@Component({
    selector: 'app-customer-portal-documents',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe],
    template: `
    <section class="portal-workspace">
      <div class="heading"><div><p class="eyebrow">Customer Portal</p><h1>Documents</h1><p>Documents are shown only when their requirement is enabled for your party.</p></div><a routerLink="/customer-portal/dashboard">Dashboard</a></div>
      <p *ngIf="loading" class="state">Loading document workspace…</p><p *ngIf="error" class="error">{{ error }}</p>
      <ng-container *ngIf="!loading && !error">
        <div class="owner-picker" *ngIf="owners.length"><label for="document-owner">Document group</label><select id="document-owner" [value]="selectedOwnerKey" (change)="selectOwner($any($event.target).value)"><option *ngFor="let owner of owners" [value]="ownerKey(owner)">{{ owner.OwnerCategory }} · {{ owner.OwnerLabel }}</option></select></div>
        <p *ngIf="!owners.length" class="state">No document owners are available for your party.</p>
        <div class="document-layout" *ngIf="selectedOwner">
          <aside><h2>Requirements</h2><button *ngFor="let requirement of requirements" type="button" [class.selected]="selectedRequirement?.Id===requirement.Id" (click)="selectRequirement(requirement)"><strong>{{ requirement.DisplayName }}</strong><small>{{ requirement.DocumentCount ? requirement.DocumentCount + ' file(s)' : (requirement.MinCount > 0 ? 'Required' : 'Optional') }}</small></button><p *ngIf="requirementsLoading" class="state">Loading requirements…</p><p *ngIf="!requirementsLoading&&!requirements.length" class="state">No customer-visible requirements have been configured for this item.</p></aside>
          <main *ngIf="selectedRequirement"><div class="requirement-heading"><div><h2>{{ selectedRequirement.DisplayName }}</h2><p>{{ selectedRequirement.Description || 'No additional description.' }}</p></div><span class="status">{{ selectedRequirement.CustomerPortalAccess === 'Upload' ? 'Customer upload enabled' : 'View only' }}</span></div>
            <label class="upload" *ngIf="selectedRequirement.CanUpload"><input type="file" accept=".pdf,.jpg,.jpeg,.png" (change)="upload($event)" [disabled]="uploading"/><span>{{ uploading ? 'Uploading…' : 'Upload PDF, JPG, or PNG' }}</span></label>
            <p *ngIf="documentsLoading" class="state">Loading files…</p><div class="table-card" *ngIf="!documentsLoading"><table *ngIf="documents.length;else noFiles"><thead><tr><th>Document</th><th>Uploaded</th><th *ngIf="showsValidation">Validation</th><th></th></tr></thead><tbody><tr *ngFor="let document of documents"><td><strong>{{ document.Title }}</strong><br><small>{{ document.OriginalFileName }}</small></td><td>{{ document.UploadedAtUtc | date:'medium' }}</td><td *ngIf="showsValidation">{{ document.ValidationStatus || 'Pending' }}<br><small *ngIf="document.ValidationMessage">{{ document.ValidationMessage }}</small></td><td><button type="button" class="link-button" (click)="download(document)">Download</button></td></tr></tbody></table><ng-template #noFiles><p class="state">No documents have been uploaded for this requirement.</p></ng-template></div>
          </main>
          <main *ngIf="!selectedRequirement" class="state">Select a document requirement to see its files.</main>
        </div>
      </ng-container>
    </section>`,
    styles: [workspaceStyles, `.owner-picker{display:flex;flex-direction:column;max-width:680px;gap:.4rem;margin-bottom:1rem}.owner-picker select{padding:.7rem;border:1px solid var(--surface-border);border-radius:.45rem;background:var(--surface-card);color:var(--text-color)}.document-layout{display:grid;grid-template-columns:minmax(220px,320px) 1fr;gap:1rem}.document-layout aside,.document-layout main{border:1px solid var(--surface-border);border-radius:.75rem;background:var(--surface-card);padding:1rem}.document-layout h2{font-size:1.05rem;margin:0 0 .75rem}.document-layout aside button{width:100%;text-align:left;border:0;background:transparent;padding:.75rem;border-radius:.45rem;cursor:pointer;color:var(--text-color)}.document-layout aside button:hover,.document-layout aside button.selected{background:#eaf5fa}.document-layout aside button strong,.document-layout aside button small{display:block}.requirement-heading{display:flex;gap:1rem;justify-content:space-between;align-items:flex-start}.requirement-heading p{margin:0;color:var(--text-color-secondary)}.upload{display:inline-flex;align-items:center;gap:.5rem;margin:1rem 0;padding:.65rem .85rem;border-radius:.45rem;background:#1d6f8c;color:#fff;cursor:pointer;font-weight:700}.upload input{max-width:220px}.link-button{background:none;border:0;color:#1d6f8c;font-weight:700;cursor:pointer;padding:0}@media(max-width:760px){.document-layout{grid-template-columns:1fr}.requirement-heading{flex-direction:column}}`]
})
export class CustomerPortalDocumentsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    owners: CustomerPortalDocumentOwner[] = [];
    selectedOwner?: CustomerPortalDocumentOwner;
    requirements: CustomerPortalDocumentRequirement[] = [];
    selectedRequirement?: CustomerPortalDocumentRequirement;
    documents: CustomerPortalDocument[] = [];
    loading = true;
    requirementsLoading = false;
    documentsLoading = false;
    uploading = false;
    error = '';

    constructor(private readonly workspace: CustomerPortalWorkspaceService) {}

    get selectedOwnerKey(): string { return this.selectedOwner ? this.ownerKey(this.selectedOwner) : ''; }
    get showsValidation(): boolean {
        return this.selectedRequirement?.ValidationMode === 'Automatic'
            || this.selectedRequirement?.ValidationMode === 'ManualReview';
    }

    ngOnInit(): void {
        this.workspace.documentOwners().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: owners => { this.owners = owners || []; this.selectedOwner = this.owners[0]; if (this.selectedOwner) this.loadRequirements(); },
            error: () => { this.error = 'Documents could not be loaded.'; this.loading = false; },
            complete: () => this.loading = false
        });
    }

    ownerKey(owner: CustomerPortalDocumentOwner): string { return `${owner.OwnerType}:${owner.OwnerId}`; }

    selectOwner(key: string): void {
        this.selectedOwner = this.owners.find(owner => this.ownerKey(owner) === key);
        this.requirements = []; this.documents = []; this.selectedRequirement = undefined;
        this.loadRequirements();
    }

    selectRequirement(requirement: CustomerPortalDocumentRequirement): void {
        this.selectedRequirement = requirement;
        this.loadDocuments();
    }

    upload(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file || !this.selectedOwner || !this.selectedRequirement) return;
        this.uploading = true;
        this.workspace.upload(this.selectedOwner, this.selectedRequirement.Id, file).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: document => { this.documents = [document, ...this.documents]; this.selectedRequirement!.DocumentCount++; },
            error: () => this.error = 'The document could not be uploaded. Check the allowed file type and size.',
            complete: () => { this.uploading = false; (event.target as HTMLInputElement).value = ''; }
        });
    }

    download(document: CustomerPortalDocument): void {
        if (!this.selectedOwner) return;
        this.workspace.download(this.selectedOwner, document.DocumentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: content => { const url = URL.createObjectURL(content); const anchor = window.document.createElement('a'); anchor.href = url; anchor.download = document.OriginalFileName || document.Title; anchor.click(); URL.revokeObjectURL(url); },
            error: () => this.error = 'The document could not be downloaded.'
        });
    }

    private loadRequirements(): void {
        if (!this.selectedOwner) return;
        this.requirementsLoading = true;
        this.workspace.documentRequirements(this.selectedOwner).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: requirements => { this.requirements = requirements || []; if (this.requirements.length) this.selectRequirement(this.requirements[0]); },
            error: () => this.error = 'Document requirements could not be loaded.',
            complete: () => this.requirementsLoading = false
        });
    }

    private loadDocuments(): void {
        if (!this.selectedOwner || !this.selectedRequirement) return;
        this.documentsLoading = true; this.documents = [];
        this.workspace.documents(this.selectedOwner, this.selectedRequirement.Id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: documents => this.documents = documents || [],
            error: () => this.error = 'Document files could not be loaded.',
            complete: () => this.documentsLoading = false
        });
    }
}
