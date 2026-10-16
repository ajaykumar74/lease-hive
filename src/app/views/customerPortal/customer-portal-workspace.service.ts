import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';

export interface CustomerPortalDashboard {
    ActiveContractCount: number;
    LeasedAssetCount: number;
    OpenInvoiceCount: number;
    OutstandingBalance: number;
    OutstandingDocumentRequirementCount: number;
    CurrencyCode: string;
}

export interface CustomerPortalContract {
    ContractId: number;
    ContractNo: string;
    ContractTitle: string;
    Status: string;
    ContractDate?: string;
    CommencementDate?: string;
    MaturityDate?: string;
    CurrencyCode: string;
    AssetCount: number;
    ExternalReference?: string;
    Assets?: CustomerPortalAsset[];
}

export interface CustomerPortalAsset {
    AssetId: number;
    ContractId: number;
    ContractNo: string;
    AssetNo: string;
    AssetCategory: string;
    AssetType: string;
    Make: string;
    Model: string;
    AssetReference: string;
    AllocationStatus: string;
    EffectiveFrom?: string;
    EffectiveTo?: string;
}

export interface CustomerPortalInvoice {
    InvoiceId: number;
    ContractId: number;
    ContractNo: string;
    InvoiceNo: string;
    Status: string;
    InvoiceDate: string;
    DueDate: string;
    CurrencyCode: string;
    GrossAmount: number;
    OutstandingAmount: number;
}

export interface CustomerPortalDocumentOwner {
    OwnerType: string;
    OwnerId: number;
    PartyId: number;
    OwnerLabel: string;
    OwnerCategory: string;
}

export interface CustomerPortalDocumentRequirement {
    Id: number;
    Code: string;
    DisplayName: string;
    Description: string;
    CustomerPortalAccess: 'Internal' | 'View' | 'Upload';
    RequiredMode: number;
    MinCount: number;
    MaxCount: number;
    DocumentCount: number;
    CanUpload: boolean;
}

export interface CustomerPortalDocument {
    DocumentId: number;
    LinkId: number;
    DocumentRequirementId: number;
    Title: string;
    OriginalFileName: string;
    ContentType: string;
    StoredSizeBytes: number;
    UploadedAtUtc: string;
    ValidationStatus: string;
    ValidationMessage: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerPortalWorkspaceService {
    private readonly endpoint: string;

    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {
        this.endpoint = `${this.baseService.C_APP_URL}/customer-portal`;
    }

    dashboard(): Observable<CustomerPortalDashboard> { return this.get<CustomerPortalDashboard>('dashboard'); }
    contracts(): Observable<CustomerPortalContract[]> { return this.get<CustomerPortalContract[]>('contracts'); }
    contract(id: number): Observable<CustomerPortalContract> { return this.get<CustomerPortalContract>(`contracts/${id}`); }
    assets(): Observable<CustomerPortalAsset[]> { return this.get<CustomerPortalAsset[]>('assets'); }
    invoices(): Observable<CustomerPortalInvoice[]> { return this.get<CustomerPortalInvoice[]>('invoices'); }
    documentOwners(): Observable<CustomerPortalDocumentOwner[]> { return this.get<CustomerPortalDocumentOwner[]>('documents/owners'); }
    documentRequirements(owner: CustomerPortalDocumentOwner): Observable<CustomerPortalDocumentRequirement[]> {
        return this.get<CustomerPortalDocumentRequirement[]>(`documents/${encodeURIComponent(owner.OwnerType)}/${owner.OwnerId}/requirements`);
    }
    documents(owner: CustomerPortalDocumentOwner, requirementId: number): Observable<CustomerPortalDocument[]> {
        return this.get<{ Documents: CustomerPortalDocument[] }>(`documents/${encodeURIComponent(owner.OwnerType)}/${owner.OwnerId}?documentRequirementId=${requirementId}`)
            .pipe(map(result => result?.Documents || []));
    }
    upload(owner: CustomerPortalDocumentOwner, requirementId: number, file: File, title?: string): Observable<CustomerPortalDocument> {
        const form = new FormData();
        form.append('file', file, file.name);
        form.append('documentRequirementId', String(requirementId));
        form.append('title', title || file.name.replace(/\.[^/.]+$/, ''));
        return this.http.post<any>(`${this.endpoint}/documents/${encodeURIComponent(owner.OwnerType)}/${owner.OwnerId}`, form, {
            headers: this.baseService.getHeaders().delete('Content-Type')
        }).pipe(map(response => response.data), catchError(this.baseService.handleError));
    }
    download(owner: CustomerPortalDocumentOwner, documentId: number): Observable<Blob> {
        return this.http.get(`${this.endpoint}/documents/${encodeURIComponent(owner.OwnerType)}/${owner.OwnerId}/${documentId}/download`, {
            headers: this.baseService.getHeaders(),
            responseType: 'blob'
        }).pipe(catchError(this.baseService.handleError));
    }

    private get<T>(path: string): Observable<T> {
        return this.http.get<{ data: T }>(`${this.endpoint}/${path}`, { headers: this.baseService.getHeaders() }).pipe(
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }
}
