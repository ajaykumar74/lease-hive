import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import {
    DocumentTemplate,
    DocumentTemplateOptions,
    DocumentTemplateSaveRequest,
    DocumentTemplateValidationResult
} from './document-template.models';

@Injectable({ providedIn: 'root' })
export class DocumentTemplateService {
    private readonly url: string;

    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {
        this.url = `${this.baseService.C_APP_URL}/document-templates`;
    }

    list(): Observable<DocumentTemplate[]> {
        return this.data<DocumentTemplate[]>(this.http.get<{ data: DocumentTemplate[] }>(this.url, { headers: this.headers }));
    }

    get(templateId: number): Observable<DocumentTemplate> {
        return this.data<DocumentTemplate>(this.http.get<{ data: DocumentTemplate }>(`${this.url}/${templateId}`, { headers: this.headers }));
    }

    options(): Observable<DocumentTemplateOptions> {
        return this.data<DocumentTemplateOptions>(this.http.get<{ data: DocumentTemplateOptions }>(`${this.url}/options`, { headers: this.headers }));
    }

    create(request: DocumentTemplateSaveRequest, file: File): Observable<DocumentTemplate> {
        return this.data<DocumentTemplate>(this.http.post<{ data: DocumentTemplate }>(this.url, this.formData(request, file), { headers: this.formHeaders }));
    }

    update(templateId: number, request: DocumentTemplateSaveRequest): Observable<DocumentTemplate> {
        return this.data<DocumentTemplate>(this.http.put<{ data: DocumentTemplate }>(`${this.url}/${templateId}`, request, { headers: this.headers }));
    }

    replaceFile(templateId: number, file: File): Observable<DocumentTemplate> {
        const data = new FormData();
        data.append('file', file, file.name);
        return this.data<DocumentTemplate>(this.http.post<{ data: DocumentTemplate }>(`${this.url}/${templateId}/document`, data, { headers: this.formHeaders }));
    }

    setDefault(templateId: number): Observable<DocumentTemplate> {
        return this.data<DocumentTemplate>(this.http.post<{ data: DocumentTemplate }>(`${this.url}/${templateId}/default`, {}, { headers: this.headers }));
    }

    setStatus(templateId: number, recordStatus: 'Active' | 'Inactive'): Observable<DocumentTemplate> {
        return this.data<DocumentTemplate>(this.http.post<{ data: DocumentTemplate }>(`${this.url}/${templateId}/status`, { RecordStatus: recordStatus }, { headers: this.headers }));
    }

    validate(templateId: number): Observable<DocumentTemplateValidationResult> {
        return this.data<DocumentTemplateValidationResult>(this.http.post<{ data: DocumentTemplateValidationResult }>(`${this.url}/${templateId}/validate`, {}, { headers: this.headers }));
    }

    download(templateId: number): Observable<Blob> {
        return this.http.get(`${this.url}/${templateId}/download`, { headers: this.headers, responseType: 'blob' }).pipe(catchError(error => this.handleError(error)));
    }

    preview(templateId: number): Observable<Blob> {
        return this.http.post(`${this.url}/${templateId}/preview`, {}, { headers: this.headers, responseType: 'blob' }).pipe(catchError(error => this.handleError(error)));
    }

    private get headers(): HttpHeaders {
        return this.baseService.getHeaders();
    }

    private get formHeaders(): HttpHeaders {
        return this.headers.delete('Content-Type');
    }

    private formData(request: DocumentTemplateSaveRequest, file: File): FormData {
        const data = new FormData();
        Object.entries(request).forEach(([key, value]) => {
            if (value !== null && value !== undefined) data.append(key, String(value));
        });
        data.append('file', file, file.name);
        return data;
    }

    private data<T>(request: Observable<{ data: T }>): Observable<T> {
        return request.pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(error => this.handleError(error))
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        const body = error.error as { Message?: string; ErrorMessage?: string; message?: string } | null;
        const message = body?.Message || body?.ErrorMessage || body?.message || 'Document template action could not be completed.';
        return throwError(() => message);
    }
}
