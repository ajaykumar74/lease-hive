import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {
    DocumentAttachmentService,
    IDocumentAttachment,
    IDocumentAttachmentType
} from './document-attachment.service';

@Component({
    selector: 'app-document-attachments',
    standalone: false,
    templateUrl: './document-attachments.component.html',
    styleUrls: ['./document-attachments.component.scss']
})
export class DocumentAttachmentsComponent implements OnChanges {
    @Input() ownerType = 'PartyGSTRegistration';
    @Input() ownerId = 0;
    @Input() allowUpload = true;
    @Input() allowRemove = true;

    @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

    documents: IDocumentAttachment[] = [];
    documentTypes: IDocumentAttachmentType[] = [];
    selectedDocumentTypeId: number | null = null;
    title = '';
    selectedFile: File | null = null;
    isLoading = false;
    isLoadingDocumentTypes = false;
    isUploading = false;
    uploadProgress = 0;
    errorMessage = '';

    constructor(private documentAttachmentService: DocumentAttachmentService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes['ownerId'] || changes['ownerType']) && this.ownerId > 0) {
            this.load();
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.selectedFile = input.files?.item(0) ?? null;
        this.errorMessage = '';
        if (this.selectedFile && !this.title) {
            this.title = this.selectedFile.name.replace(/\.[^/.]+$/, '');
        }
    }

    upload(): void {
        if (!this.selectedFile) {
            this.errorMessage = 'Select a PDF, JPG, JPEG, or PNG file.';
            return;
        }
        if (!this.selectedDocumentTypeId) {
            this.errorMessage = 'Select a document type.';
            return;
        }

        this.isUploading = true;
        this.uploadProgress = 0;
        this.errorMessage = '';
        this.documentAttachmentService
            .upload(this.ownerType, this.ownerId, this.selectedFile, this.selectedDocumentTypeId, this.title)
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
        if (!confirm(`Remove '${document.OriginalFileName}' from this GST registration?`)) {
            return;
        }

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

    private load(): void {
        this.loadDocuments();
        if (this.allowUpload) {
            this.loadDocumentTypes();
        }
    }

    private loadDocuments(): void {
        this.isLoading = true;
        this.documentAttachmentService.list(this.ownerType, this.ownerId).subscribe({
            next: (response) => (this.documents = response.data ?? []),
            error: (error) => (this.errorMessage = this.toErrorMessage(error)),
            complete: () => (this.isLoading = false)
        });
    }

    private loadDocumentTypes(): void {
        this.isLoadingDocumentTypes = true;
        this.documentAttachmentService.getDocumentTypes(this.ownerType, this.ownerId).subscribe({
            next: (response) => (this.documentTypes = response.data ?? []),
            error: (error) => (this.errorMessage = this.toErrorMessage(error)),
            complete: () => (this.isLoadingDocumentTypes = false)
        });
    }

    private resetUploadForm(): void {
        this.selectedFile = null;
        this.selectedDocumentTypeId = null;
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
