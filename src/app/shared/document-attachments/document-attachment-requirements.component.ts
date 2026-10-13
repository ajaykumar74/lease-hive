import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
    DocumentAttachmentService,
    IDocumentAttachmentRequirement
} from './document-attachment.service';

@Component({
    selector: 'app-document-attachment-requirements',
    standalone: false,
    templateUrl: './document-attachment-requirements.component.html',
    styleUrls: ['./document-attachment-requirements.component.scss']
})
export class DocumentAttachmentRequirementsComponent implements OnChanges {
    @Input() ownerType = '';
    @Input() ownerId = 0;
    @Input() allowUpload = true;
    @Input() allowRemove = true;
    @Input() usePrimeRemoveConfirmation = true;

    requirements: IDocumentAttachmentRequirement[] = [];
    isLoading = false;
    errorMessage = '';

    constructor(private documentAttachmentService: DocumentAttachmentService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes['ownerId'] || changes['ownerType']) && this.ownerId > 0 && !!this.ownerType) {
            this.loadRequirements();
        }
    }

    private loadRequirements(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.documentAttachmentService.getRequirements(this.ownerType, this.ownerId).subscribe({
            next: (response) => (this.requirements = response.data ?? []),
            error: (error) => (this.errorMessage = typeof error === 'string' ? error : 'Document requirements could not be loaded.'),
            complete: () => (this.isLoading = false)
        });
    }
}
