import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';

export interface IDocumentAttachmentType {
    Id: number;
    Code: string;
    Name: string;
}

export interface IDocumentAttachment {
    LinkId: number;
    DocumentId: number;
    DocumentVersionId: number;
    DocumentTypeId: number;
    DocumentTypeCode: string;
    DocumentTypeName: string;
    Title: string;
    OriginalFileName: string;
    ContentType: string;
    StoredSizeBytes: number;
    UploadedAtUtc: string;
    IsPrimary: boolean;
}

@Injectable({ providedIn: 'root' })
export class DocumentAttachmentService {
    constructor(
        private http: HttpClient,
        private baseService: BaseService
    ) {}

    list(ownerType: string, ownerId: number): Observable<{ data: IDocumentAttachment[] }> {
        return this.http
            .get<{ data: IDocumentAttachment[] }>(this.ownerUrl(ownerType, ownerId), { headers: this.baseService.getHeaders() })
            .pipe(catchError(this.baseService.handleError));
    }

    getDocumentTypes(ownerType: string, ownerId: number): Observable<{ data: IDocumentAttachmentType[] }> {
        return this.http
            .get<{ data: IDocumentAttachmentType[] }>(`${this.ownerUrl(ownerType, ownerId)}/document-types`, { headers: this.baseService.getHeaders() })
            .pipe(catchError(this.baseService.handleError));
    }

    upload(
        ownerType: string,
        ownerId: number,
        file: File,
        documentTypeId: number,
        title: string
    ): Observable<HttpEvent<{ data: IDocumentAttachment }>> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('documentTypeId', String(documentTypeId));
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
            .delete<{ success: boolean }>(`${this.ownerUrl(ownerType, ownerId)}/${linkId}`, { headers: this.baseService.getHeaders() })
            .pipe(catchError(this.baseService.handleError));
    }

    private ownerUrl(ownerType: string, ownerId: number): string {
        if (ownerType !== 'PartyGSTRegistration') {
            throw new Error(`Document attachments are not configured for owner type '${ownerType}'.`);
        }

        return `${this.baseService.C_APP_URL}/party-gst-registrations/${ownerId}/documents`;
    }

    private multipartHeaders(): HttpHeaders {
        const token = localStorage.getItem('jwt');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'X-Timezone': this.baseService.timeZoneId || 'UTC'
        });
    }
}
