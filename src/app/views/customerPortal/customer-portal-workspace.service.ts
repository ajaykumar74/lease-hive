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

export interface CustomerPortalSupportParty { Id: number; Name: string; }
export interface CustomerPortalSupportContact { Name: string; Email: string; Role: string; ReceivesEscalations: boolean; }
export interface CustomerPortalSupportLookupItem { Id: number; DisplayText: string; }
export interface CustomerPortalSupportPicklistItem { Value: string; Text: string; }
export interface CustomerPortalSupportTicketLookups {
    PartyLocations: CustomerPortalSupportLookupItem[];
    CustomerProfiles: CustomerPortalSupportLookupItem[];
    LeaseContracts: CustomerPortalSupportLookupItem[];
    Assets: CustomerPortalSupportLookupItem[];
    AssetUsers: CustomerPortalSupportLookupItem[];
    PartyContacts: CustomerPortalSupportLookupItem[];
}
export interface CustomerPortalSupportTicketPicklists {
    TicketTypes: CustomerPortalSupportPicklistItem[];
    Categories: CustomerPortalSupportPicklistItem[];
    Priorities: CustomerPortalSupportPicklistItem[];
}
export interface CustomerPortalSupportMessage { Id: number; SenderName: string; SenderTypeCode: string; Message: string; IsInternalNote: boolean; CreatedDateTime: string; }
export interface CustomerPortalSupportTicket {
    Id: number; TicketId: string; PartyId: number; PartyName: string; CategoryCode: string; TicketTypeCode: string; PriorityCode: string; StatusCode: string;
    Subject: string; RequesterName: string; AssignedToName: string; RaisedAtUtc: string; LastActivityAtUtc: string;
    PartyLocationName?: string; CustomerProfileName?: string; ContractNo?: string; AssetNo?: string; ResolutionSummary?: string;
    Description?: string; Messages?: CustomerPortalSupportMessage[];
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
    supportParties(): Observable<CustomerPortalSupportParty[]> { return this.get<CustomerPortalSupportParty[]>('support/parties'); }
    supportContacts(): Observable<CustomerPortalSupportContact[]> { return this.get<CustomerPortalSupportContact[]>('support/contacts'); }
    supportTicketLookups(partyId: number, assetId?: number | null): Observable<CustomerPortalSupportTicketLookups> {
        const params = new URLSearchParams({ partyId: String(partyId) });
        if (assetId && assetId > 0) params.set('assetId', String(assetId));
        return this.get<CustomerPortalSupportTicketLookups>(`support/ticket-lookups?${params}`);
    }
    supportTicketPicklists(): Observable<CustomerPortalSupportTicketPicklists> { return this.get<CustomerPortalSupportTicketPicklists>('support/ticket-picklists'); }
    supportTickets(): Observable<CustomerPortalSupportTicket[]> { return this.get<{ Records: CustomerPortalSupportTicket[] }>('support/tickets').pipe(map(result => result?.Records || [])); }
    supportTicket(id: number): Observable<CustomerPortalSupportTicket> { return this.get<CustomerPortalSupportTicket>(`support/tickets/${id}`); }
    createSupportTicket(payload: any): Observable<CustomerPortalSupportTicket> { return this.post<CustomerPortalSupportTicket>('support/tickets', payload); }
    postSupportMessage(id: number, message: string): Observable<CustomerPortalSupportMessage> { return this.post<CustomerPortalSupportMessage>(`support/tickets/${id}/messages`, { Message: message, IsInternalNote: false }); }
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
    private post<T>(path: string, body: unknown): Observable<T> {
        return this.http.post<{ data: T }>(`${this.endpoint}/${path}`, body, { headers: this.baseService.getHeaders() }).pipe(map(response => response.data), catchError(this.baseService.handleError));
    }
}
