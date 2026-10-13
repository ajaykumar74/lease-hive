import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {
    DocumentAttachmentService,
    IDocumentAttachment,
    IDocumentAttachmentRequirement
} from './document-attachment.service';

@Component({
    selector: 'app-document-attachments',
    standalone: false,
    templateUrl: './document-attachments.component.html',
    styleUrls: ['./document-attachments.component.scss']
})
export class DocumentAttachmentsComponent implements OnChanges {
    @Input() ownerType = '';
    @Input() ownerId = 0;
    @Input() documentRequirement: IDocumentAttachmentRequirement | null = null;
    @Input() allowUpload = true;
    @Input() allowRemove = true;

    @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

    documents: IDocumentAttachment[] = [];
    title = '';
    selectedFile: File | null = null;
    isLoading = false;
    isUploading = false;
    uploadProgress = 0;
    warningMessage = '';
    errorMessage = '';

    constructor(private documentAttachmentService: DocumentAttachmentService) {}

    get documentTypeLabel(): string {
        return this.documentRequirement?.DocumentTypeName || this.documentRequirement?.DocumentTypeCode || 'Not configured';
    }

    get maxFileSizeLabel(): string {
        const bytes = this.documentRequirement?.MaxFileSizeBytes;
        return bytes && bytes > 0 ? this.formatSize(bytes) : '25 MB';
    }

    get hasAvailableUploadSlot(): boolean {
        return !this.documentRequirement || this.documentRequirement.MaxCount <= 0 || this.documents.length < this.documentRequirement.MaxCount;
    }

    get uploadCapacityLabel(): string {
        if (!this.documentRequirement || this.documentRequirement.MaxCount <= 0) {
            return `${this.documents.length} attached`;
        }

        return `${this.documents.length} of ${this.documentRequirement.MaxCount} attached`;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes['ownerId'] || changes['ownerType'] || changes['documentRequirement']) && this.isReady()) {
            this.loadDocuments();
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.selectedFile = input.files?.item(0) ?? null;
        this.warningMessage = '';
        this.errorMessage = '';
        if (this.selectedFile && !this.title) {
            this.title = this.selectedFile.name.replace(/\.[^/.]+$/, '');
        }
    }

    upload(): void {
        if (!this.documentRequirement) {
            this.warningMessage = 'This upload slot does not have a document requirement.';
            return;
        }
        if (!this.selectedFile) {
            this.warningMessage = 'Select a PDF, JPG, JPEG, or PNG file.';
            return;
        }
        if (!this.hasAvailableUploadSlot) {
            this.warningMessage = `This document requirement already has its maximum of ${this.documentRequirement.MaxCount} attachment(s).`;
            return;
        }
        if (this.documentRequirement.MaxFileSizeBytes > 0 && this.selectedFile.size > this.documentRequirement.MaxFileSizeBytes) {
            this.warningMessage = `The file exceeds this requirement's ${this.maxFileSizeLabel} size limit.`;
            return;
        }

        this.isUploading = true;
        this.uploadProgress = 0;
        this.warningMessage = '';
        this.errorMessage = '';
        this.documentAttachmentService
            .upload(this.ownerType, this.ownerId, this.selectedFile, this.documentRequirement.Id, this.title)
            .subscribe({
                next: (event) => {
                    if (event.type === HttpEventType.UploadProgress && event.total) {
                        this.uploadProgress = Math.round((100 * event.loaded) / event.total);
                    }
                    if (event.type === HttpEventType.Response) {
                        this.resetUploadForm();
                        this.loadDocuments();
                    }
                },
                error: (error) => {
                    this.errorMessage = this.toErrorMessage(error);
                    this.isUploading = false;
                },
                complete: () => {
                    this.isUploading = false;
                }
            });
    }

    download(attachment: IDocumentAttachment): void {
        this.warningMessage = '';
        this.errorMessage = '';
        this.documentAttachmentService.download(this.ownerType, this.ownerId, attachment.DocumentId).subscribe({
            next: (file) => {
                const url = URL.createObjectURL(file);
                const link = window.document.createElement('a');
                link.href = url;
                link.download = attachment.OriginalFileName;
                link.click();
                URL.revokeObjectURL(url);
            },
            error: (error) => (this.errorMessage = this.toErrorMessage(error))
        });
    }

    remove(document: IDocumentAttachment): void {
        if (!confirm(`Remove '${document.OriginalFileName}' from this document requirement?`)) {
            return;
        }

        this.warningMessage = '';
        this.errorMessage = '';
        this.documentAttachmentService.remove(this.ownerType, this.ownerId, document.LinkId).subscribe({
            next: () => this.loadDocuments(),
            error: (error) => (this.errorMessage = this.toErrorMessage(error))
        });
    }

    formatSize(bytes: number): string {
        if (!bytes) {
            return '0 B';
        }
        const units = ['B', 'KB', 'MB'];
        const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        return `${(bytes / Math.pow(1024, unitIndex)).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
    }

    validationStatusLabel(document: IDocumentAttachment): string {
        switch (document.ValidationStatus) {
            case 'Pending':
            case 'Processing':
                return 'Validating';
            case 'DocumentMatched':
                return 'Document matched';
            case 'NeedsReview':
                return 'Needs review';
            case 'Rejected':
                return 'Rejected';
            default:
                return 'Not validated';
        }
    }

    validationStatusClass(document: IDocumentAttachment): string {
        return `document-attachments__validation--${(document.ValidationStatus || 'not-validated').toLowerCase()}`;
    }

    private isReady(): boolean {
        return this.ownerId > 0 && !!this.ownerType && !!this.documentRequirement?.Id;
    }

    private loadDocuments(): void {
        if (!this.isReady() || !this.documentRequirement) {
            this.documents = [];
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.documentAttachmentService.list(this.ownerType, this.ownerId, this.documentRequirement.Id).subscribe({
            next: (response) => (this.documents = response.data ?? []),
            error: (error) => (this.errorMessage = this.toErrorMessage(error)),
            complete: () => (this.isLoading = false)
        });
    }

    private resetUploadForm(): void {
        this.selectedFile = null;
        this.title = '';
        this.uploadProgress = 0;
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }

    private toErrorMessage(error: unknown): string {
        return typeof error === 'string' ? error : 'The document action could not be completed.';
    }
}
