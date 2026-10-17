import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';

export interface IDocumentAttachmentRequirement {
    Id: number;
    Code: string;
    DisplayName: string;
    Description: string;
    DocumentTypeId: number;
    DocumentTypeCode: string;
    DocumentTypeName: string;
    RequiredMode: number;
    MinCount: number;
    MaxCount: number;
    AllowedContentTypesJson: string;
    AllowedExtensionsJson: string;
    MaxFileSizeBytes: number;
    RequiresIssueDate: boolean;
    RequiresExpiryDate: boolean;
    ExpiryWarningDays: number;
    ValidationMode: 'None' | 'Automatic' | 'ManualReview';
}

export interface IDocumentAttachment {
    LinkId: number;
    DocumentId: number;
    DocumentVersionId: number;
    DocumentRequirementId: number;
    DocumentTypeId: number;
    DocumentTypeCode: string;
    DocumentTypeName: string;
    Title: string;
    OriginalFileName: string;
    ContentType: string;
    StoredSizeBytes: number;
    UploadedAtUtc: string;
    IsPrimary: boolean;
    ValidationStatus: string | null;
    ValidationConfidenceScore: number | null;
    ValidationMessage: string | null;
    ValidatedAtUtc: string | null;
}

@Injectable({ providedIn: 'root' })
export class DocumentAttachmentService {
    constructor(
        private http: HttpClient,
        private baseService: BaseService
    ) {}

    getRequirements(ownerType: string, ownerId: number): Observable<{ data: IDocumentAttachmentRequirement[] }> {
        return this.http
            .get<{ data: IDocumentAttachmentRequirement[] }>(`${this.ownerUrl(ownerType, ownerId)}/requirements`, {
                headers: this.baseService.getHeaders()
            })
            .pipe(catchError(this.baseService.handleError));
    }

    list(
        ownerType: string,
        ownerId: number,
        documentRequirementId: number
    ): Observable<{ data: IDocumentAttachment[] }> {
        const params = new HttpParams().set('documentRequirementId', String(documentRequirementId));
        return this.http
            .get<{ data: IDocumentAttachment[] }>(this.ownerUrl(ownerType, ownerId), {
                headers: this.baseService.getHeaders(),
                params
            })
            .pipe(catchError(this.baseService.handleError));
    }

    upload(
        ownerType: string,
        ownerId: number,
        file: File,
        documentRequirementId: number,
        title: string
    ): Observable<HttpEvent<{ data: IDocumentAttachment }>> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('documentRequirementId', String(documentRequirementId));
        formData.append('title', title?.trim() ?? '');

        return this.http
            .post<{ data: IDocumentAttachment }>(this.ownerUrl(ownerType, ownerId), formData, {
                headers: this.multipartHeaders(),
                observe: 'events',
                reportProgress: true
            })
            .pipe(catchError(this.baseService.handleError));
    }

    download(ownerType: string, ownerId: number, documentId: number): Observable<Blob> {
        return this.http
            .get(`${this.ownerUrl(ownerType, ownerId)}/${documentId}/download`, {
                headers: this.baseService.getHeaders(),
                responseType: 'blob'
            })
            .pipe(catchError(this.baseService.handleError));
    }

    remove(ownerType: string, ownerId: number, linkId: number): Observable<{ success: boolean }> {
        return this.http
            .delete<{ success: boolean }>(`${this.ownerUrl(ownerType, ownerId)}/${linkId}`, {
                headers: this.baseService.getHeaders()
            })
            .pipe(catchError(this.baseService.handleError));
    }

    private ownerUrl(ownerType: string, ownerId: number): string {
        if (!ownerType?.trim() || ownerId <= 0) {
            throw new Error('A valid document owner is required.');
        }

        return `${this.baseService.C_APP_URL}/document-attachments/${encodeURIComponent(ownerType)}/${ownerId}`;
    }

    private multipartHeaders(): HttpHeaders {
        const token = localStorage.getItem('jwt');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'X-Timezone': this.baseService.timeZoneId || 'UTC'
        });
    }
}
