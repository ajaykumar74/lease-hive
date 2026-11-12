import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';

export interface SupplierPortalDashboard {
    PartyIds: number[];
    IsAdministrator: boolean;
    PendingRfqCount: number;
    OpenPurchaseOrderCount: number;
    PendingDeliveryCount: number;
    SubmittedInvoiceCount: number;
    RecentPurchaseOrders: SupplierPortalPurchaseOrder[];
    PendingActions: SupplierPortalAction[];
}

export interface SupplierPortalPurchaseOrder {
    PurchaseOrderId: number;
    PurchaseOrderNo: string;
    Status: string;
    PurchaseOrderDate: string;
    CurrencyCode: string;
    TotalAmount: number;
}

export interface SupplierPortalAction {
    Title: string;
    Description: string;
    Count: number;
}

export interface SupplierPortalLookupItem {
    Id: number;
    DisplayText: string;
}

export interface SupplierPortalInvitation {
    PartyId: number;
    PartyContactId: number;
    PortalRole: 'SUPPLIER_PORTAL_ADMIN' | 'SUPPLIER_PORTAL_USER';
}

export interface SupplierPortalProfile {
    PartyId: number;
    PartyCode: string;
    LegalName: string;
    TradeName: string;
    WebsiteUrl: string;
    PreferredCurrencyCode: string;
    Description: string;
    ContactName: string;
    Designation: string;
    DepartmentName: string;
    Email: string;
    MobileCountryCode: string;
    MobileNumber: string;
    PhoneNumber: string;
    PreferredContactMethod: string;
    CanEditCompanyDetails: boolean;
    AvailableParties: SupplierPortalLookupItem[];
}

export interface SupplierPortalProfileUpdate {
    PartyId: number;
    TradeName?: string;
    WebsiteUrl?: string;
    PreferredCurrencyCode?: string;
    Description?: string;
    MobileCountryCode?: string;
    MobileNumber?: string;
    PhoneNumber?: string;
    PreferredContactMethod?: string;
}

export interface SupplierPortalUser {
    ApplicationUserId: number;
    PartyId: number;
    DisplayName: string;
    Email: string;
    Role: string;
    AccessLevel: string;
    Status: string;
    InvitationId?: number;
    InvitationStatus: string;
    InvitationExpiresAt?: string;
    CanResend: boolean;
}

export interface SupplierPortalRfqListItem { RfqId: number; RfqNo: string; Status: string; InvitationStatus: string; IssuedAt?: string; ResponseDueAt: string; CurrencyCode: string; LineCount: number; SupplierQuotationId?: number; QuotationStatus: string; CanRespond: boolean; }
export interface SupplierPortalQuotationLine { SupplierQuotationLineId?: number; RfqLineId: number; Quantity: number; UnitPrice: number; DiscountAmount: number; TaxAmount: number; LineTotal?: number; DeliveryDate?: string; ComplianceCode: string; DeviationNotes: string; }
export interface SupplierPortalQuotation { SupplierQuotationId?: number; SupplierQuoteNo: string; Status: string; QuoteDate: string; ValidUntil?: string; CurrencyCode: string; PaymentTermCode: string; DeliveryDays: number; Remarks: string; Subtotal: number; TaxAmount: number; TotalAmount: number; Lines: SupplierPortalQuotationLine[]; }
export interface SupplierPortalRfqLine { RfqLineId: number; LineNo: number; Description: string; Quantity: number; UomId: number; SpecificationsJson: string; RequiredByDate?: string; QuotationLine?: SupplierPortalQuotationLine; }
export interface SupplierPortalRfqDetail { RfqId: number; RfqNo: string; Status: string; InvitationStatus: string; IssuedAt?: string; ResponseDueAt: string; CurrencyCode: string; CommercialTerms: string; CanRespond: boolean; Quotation?: SupplierPortalQuotation; Lines: SupplierPortalRfqLine[]; }
export interface SupplierPortalQuotationSave { SupplierQuotationId?: number; ValidUntil?: string; CurrencyCode: string; PaymentTermCode: string; DeliveryDays: number; Remarks: string; Submit: boolean; Lines: SupplierPortalQuotationLine[]; }
export interface SupplierPortalPurchaseOrderListItem { PurchaseOrderId: number; PurchaseOrderNo: string; Status: string; PurchaseOrderDate: string; IssuedOn?: string; CurrencyCode: string; TotalAmount: number; AcknowledgementStatus: string; AcknowledgedAt?: string; }
export interface SupplierPortalDeliverySchedule { ScheduleNo: number; ScheduledQuantity: number; PromisedDate?: string; Instructions: string; }
export interface SupplierPortalPurchaseOrderLine { PurchaseOrderLineId: number; LineNo: number; Description: string; OrderedQuantity: number; UomId: number; UnitPrice: number; DiscountAmount: number; TaxAmount: number; LineTotal: number; RequiredByDate?: string; SpecificationsJson: string; DeliveredQuantity: number; ReceivedQuantity: number; AcceptedQuantity: number; RejectedQuantity: number; RemainingOriginalQuantity: number; ReplacementRequiredQuantity: number; ReplacementInTransitQuantity: number; Deliveries: SupplierPortalDeliverySchedule[]; }
export interface SupplierPortalPurchaseOrderDetail extends SupplierPortalPurchaseOrderListItem { Subtotal: number; TaxAmount: number; ChargeAmount: number; PaymentTermCode: string; AcknowledgementRemarks: string; CanAcknowledge: boolean; Lines: SupplierPortalPurchaseOrderLine[]; }
export interface SupplierPortalDocumentRequirement { Id: number; Code: string; DisplayName: string; Description: string; RequiredMode: number; }
export interface SupplierPortalDocument { DocumentId: number; LinkId: number; OriginalFileName: string; Title: string; UploadedAtUtc: string; }
export interface SupplierPortalDeliveryLine { PurchaseOrderId: number; SupplierDeliveryLineId: number; PurchaseOrderLineId: number; ReplacementForSupplierDeliveryLineId?: number | null; IsReplacement: boolean; LineNo: number; Description: string; OrderedQuantity: number; DeliveredQuantity: number; ReceivedQuantity: number; AcceptedQuantity: number; RejectedQuantity: number; PendingReceiptQuantity: number; OriginalDeliveredQuantity: number; ReplacementDeliveredQuantity: number; RemainingOriginalQuantity: number; ReplacementRequiredQuantity: number; ReplacementInTransitQuantity: number; ReplacementAcceptedQuantity: number; RemainingDeliveryQuantity: number; UomId: number; SubmittedQuantity: number; Remarks: string; }
export interface SupplierPortalDelivery { SupplierDeliveryId: number; PurchaseOrderId: number; PurchaseOrderNo: string; DeliveryDate: string; DispatchReference: string; Transporter: string; TrackingNumber: string; Remarks: string; Status: string; LineCount: number; Lines: SupplierPortalDeliveryLine[]; }
export interface SupplierPortalDeliveryCreate { PurchaseOrderId: number; DeliveryDate: string; DispatchReference: string; Transporter: string; TrackingNumber: string; Remarks: string; Lines: SupplierPortalDeliveryLine[]; }
export interface SupplierPortalInvoiceLine { PurchaseOrderLineId: number; GoodsReceiptLineId?: number | null; LineNo: number; Description: string; OrderedQuantity: number; DeliveredQuantity: number; AcceptedQuantity: number; PreviouslyInvoicedQuantity: number; RemainingInvoiceQuantity: number; InvoicedQuantity: number; UomId: number; PurchaseOrderUnitPrice: number; UnitPrice: number; TaxAmount: number; LineTotal: number; }
export interface SupplierPortalInvoice { SupplierInvoiceId: number; PurchaseOrderId: number; PurchaseOrderNo: string; SupplierInvoiceNo: string; InvoiceDate: string; CurrencyCode: string; Subtotal: number; TaxAmount: number; TotalAmount: number; MatchStatus: string; CapturedOn: string; Lines: SupplierPortalInvoiceLine[]; }
export interface SupplierPortalInvoiceCreate { PurchaseOrderId: number; SupplierInvoiceNo: string; InvoiceDate: string; CurrencyCode: string; Lines: SupplierPortalInvoiceLine[]; }
export interface SupplierInvoiceValidationException { ExceptionTypeCode: string; SeverityCode: string; Description: string; StatusCode: string; IsBlocking: boolean; }
export interface SupplierInvoiceReviewHistory { FromStatusCode: string; ToStatusCode: string; ActionCode: string; Remarks: string; CreatedByCode: string; CreatedDateTime: string; }
export interface SupplierInvoiceReview { SupplierInvoiceId: number; SupplierInvoiceNo: string; Status: string; RevisionNo: number; HasInvoicePdf: boolean; Exceptions: SupplierInvoiceValidationException[]; History: SupplierInvoiceReviewHistory[]; }
export interface SupplierPortalGoodsReceiptLine { PurchaseOrderLineId: number; LineNo: number; Description: string; OrderedQuantity: number; ReceivedQuantity: number; AcceptedQuantity: number; RejectedQuantity: number; InspectionStatus: string; DiscrepancyRemarks: string; }
export interface SupplierPortalGoodsReceipt { GoodsReceiptId: number; PurchaseOrderId: number; PurchaseOrderNo: string; GrnNo: string; ReceiptDateTime: string; Status: string; SupplierDeliveryNoteNo: string; Remarks: string; Lines: SupplierPortalGoodsReceiptLine[]; }

@Injectable({ providedIn: 'root' })
export class SupplierPortalService {
    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {}

    dashboard(): Observable<SupplierPortalDashboard> {
        return this.http.get<{ data: SupplierPortalDashboard }>(`${this.baseService.C_APP_URL}/supplier/dashboard`, {
            headers: this.baseService.getHeaders()
        }).pipe(
            map(response => response.data),
            tap(response => this.baseService.onTapData(response)),
            catchError(this.baseService.handleError)
        );
    }

    parties(): Observable<SupplierPortalLookupItem[]> {
        return this.getLookup('parties');
    }

    contacts(partyId: number): Observable<SupplierPortalLookupItem[]> {
        return this.http.get<{ data: SupplierPortalLookupItem[] }>(`${this.baseService.C_APP_URL}/supplier/users/invitations/contacts`, {
            headers: this.baseService.getHeaders(),
            params: { partyId }
        }).pipe(
            map(response => response.data || []),
            catchError(this.baseService.handleError)
        );
    }

    invite(invitation: SupplierPortalInvitation): Observable<any> {
        return this.http.post<any>(`${this.baseService.C_APP_URL}/supplier/users/invitations`, invitation, {
            headers: this.baseService.getHeaders()
        }).pipe(
            tap(response => this.baseService.onTapData(response)),
            catchError(this.baseService.handleError)
        );
    }

    profile(partyId?: number): Observable<SupplierPortalProfile> {
        return this.http.get<{ data: SupplierPortalProfile }>(`${this.baseService.C_APP_URL}/supplier/profile`, {
            headers: this.baseService.getHeaders(),
            params: partyId ? { partyId } : {}
        }).pipe(
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }

    updateProfile(profile: SupplierPortalProfileUpdate): Observable<any> {
        return this.http.put<any>(`${this.baseService.C_APP_URL}/supplier/profile`, profile, {
            headers: this.baseService.getHeaders()
        }).pipe(
            tap(response => this.baseService.onTapData(response)),
            catchError(this.baseService.handleError)
        );
    }

    users(partyId: number): Observable<SupplierPortalUser[]> {
        return this.http.get<{ data: SupplierPortalUser[] }>(`${this.baseService.C_APP_URL}/supplier/users`, {
            headers: this.baseService.getHeaders(),
            params: { partyId }
        }).pipe(
            map(response => response.data || []),
            catchError(this.baseService.handleError)
        );
    }

    resendInvitation(invitationId: number): Observable<any> {
        return this.http.post<any>(`${this.baseService.C_APP_URL}/supplier/users/invitations/${invitationId}/resend`, {}, {
            headers: this.baseService.getHeaders()
        }).pipe(
            tap(response => this.baseService.onTapData(response)),
            catchError(this.baseService.handleError)
        );
    }

    deactivateUser(partyId: number, applicationUserId: number): Observable<any> {
        return this.http.post<any>(`${this.baseService.C_APP_URL}/supplier/users/${applicationUserId}/deactivate`, {}, {
            headers: this.baseService.getHeaders(),
            params: { partyId }
        }).pipe(
            tap(response => this.baseService.onTapData(response)),
            catchError(this.baseService.handleError)
        );
    }

    rfqs(): Observable<SupplierPortalRfqListItem[]> { return this.getData<SupplierPortalRfqListItem[]>('rfqs', []); }
    rfq(rfqId: number): Observable<SupplierPortalRfqDetail> { return this.getData<SupplierPortalRfqDetail>(`rfqs/${rfqId}`); }
    saveQuotation(rfqId: number, quotation: SupplierPortalQuotationSave): Observable<any> {
        return this.http.put<any>(`${this.baseService.C_APP_URL}/supplier/rfqs/${rfqId}/quotation`, quotation, { headers: this.baseService.getHeaders() }).pipe(tap(x => this.baseService.onTapData(x)), catchError(this.baseService.handleError));
    }
    purchaseOrders(): Observable<SupplierPortalPurchaseOrderListItem[]> { return this.getData<SupplierPortalPurchaseOrderListItem[]>('purchase-orders', []); }
    purchaseOrder(id: number): Observable<SupplierPortalPurchaseOrderDetail> { return this.getData<SupplierPortalPurchaseOrderDetail>(`purchase-orders/${id}`); }
    acknowledgePurchaseOrder(id: number, status: 'ACCEPTED' | 'REJECTED', remarks: string): Observable<any> {
        return this.http.post<any>(`${this.baseService.C_APP_URL}/supplier/purchase-orders/${id}/acknowledgement`, { status, remarks }, { headers: this.baseService.getHeaders() }).pipe(tap(x => this.baseService.onTapData(x)), catchError(this.baseService.handleError));
    }
    documentRequirements(ownerType: string, ownerId: number): Observable<SupplierPortalDocumentRequirement[]> { return this.getData<SupplierPortalDocumentRequirement[]>(`documents/${ownerType}/${ownerId}/requirements`, []); }
    documents(ownerType: string, ownerId: number, requirementId: number): Observable<SupplierPortalDocument[]> { return this.getData<SupplierPortalDocument[]>(`documents/${ownerType}/${ownerId}/requirements/${requirementId}`, []); }
    downloadDocument(ownerType: string, ownerId: number, documentId: number): Observable<Blob> { return this.http.get(`${this.baseService.C_APP_URL}/supplier/documents/${ownerType}/${ownerId}/download/${documentId}`, { headers: this.baseService.getHeaders(), responseType: 'blob' }).pipe(catchError(this.baseService.handleError)); }
    uploadQuotationDocument(quotationId: number, requirementId: number, file: File): Observable<any> { const data=new FormData(); data.append('documentRequirementId', String(requirementId)); data.append('title', file.name); data.append('file', file); return this.http.post<any>(`${this.baseService.C_APP_URL}/supplier/documents/supplier-quotation/${quotationId}`,data,{headers:this.baseService.getHeaders()}).pipe(catchError(this.baseService.handleError)); }
    deliveries(): Observable<SupplierPortalDelivery[]> { return this.getData<SupplierPortalDelivery[]>('deliveries', []); }
    deliveryEligiblePurchaseOrders(): Observable<SupplierPortalPurchaseOrderListItem[]> { return this.getData<SupplierPortalPurchaseOrderListItem[]>('deliveries/eligible-purchase-orders', []); }
    delivery(id: number): Observable<SupplierPortalDelivery> { return this.getData<SupplierPortalDelivery>(`deliveries/${id}`); }
    deliveryEligibleLines(purchaseOrderId: number): Observable<SupplierPortalDeliveryLine[]> { return this.getData<SupplierPortalDeliveryLine[]>(`deliveries/purchase-orders/${purchaseOrderId}/eligible-lines`, []); }
    createDelivery(payload: SupplierPortalDeliveryCreate): Observable<any> { return this.http.post<any>(`${this.baseService.C_APP_URL}/supplier/deliveries`, payload, { headers: this.baseService.getHeaders() }).pipe(tap(x => this.baseService.onTapData(x)), catchError(this.baseService.handleError)); }
    invoices(): Observable<SupplierPortalInvoice[]> { return this.getData<SupplierPortalInvoice[]>('invoices', []); }
    invoice(id: number): Observable<SupplierPortalInvoice> { return this.getData<SupplierPortalInvoice>(`invoices/${id}`); }
    invoiceEligibleLines(purchaseOrderId: number): Observable<SupplierPortalInvoiceLine[]> { return this.getData<SupplierPortalInvoiceLine[]>(`invoices/purchase-orders/${purchaseOrderId}/eligible-lines`, []); }
    createInvoice(payload: SupplierPortalInvoiceCreate): Observable<any> { return this.http.post<any>(`${this.baseService.C_APP_URL}/supplier/invoices`, payload, { headers: this.baseService.getHeaders() }).pipe(tap(x => this.baseService.onTapData(x)), catchError(this.baseService.handleError)); }
    updateInvoice(id: number, payload: SupplierPortalInvoiceCreate): Observable<any> { return this.http.put<any>(`${this.baseService.C_APP_URL}/supplier/invoices/${id}`, payload, { headers: this.baseService.getHeaders() }).pipe(tap(x => this.baseService.onTapData(x)), catchError(this.baseService.handleError)); }
    invoiceReview(id: number): Observable<SupplierInvoiceReview> { return this.getData<SupplierInvoiceReview>(`invoices/${id}/review`); }
    submitInvoice(id: number): Observable<any> { return this.http.post<any>(`${this.baseService.C_APP_URL}/supplier/invoices/${id}/submit`, {}, { headers: this.baseService.getHeaders() }).pipe(catchError(this.baseService.handleError)); }
    goodsReceipts(): Observable<SupplierPortalGoodsReceipt[]> { return this.getData<SupplierPortalGoodsReceipt[]>('goods-receipts', []); }
    goodsReceipt(id: number): Observable<SupplierPortalGoodsReceipt> { return this.getData<SupplierPortalGoodsReceipt>(`goods-receipts/${id}`); }
    uploadFulfillmentDocument(ownerType: 'supplier-delivery' | 'supplier-invoice', ownerId: number, requirementId: number, file: File): Observable<any> { const data=new FormData(); data.append('documentRequirementId',String(requirementId));data.append('title',file.name);data.append('file',file);return this.http.post<any>(`${this.baseService.C_APP_URL}/supplier/documents/${ownerType}/${ownerId}`,data,{headers:this.baseService.getHeaders()}).pipe(catchError(this.baseService.handleError)); }

    private getData<T>(path: string, empty?: T): Observable<T> {
        return this.http.get<{ data: T }>(`${this.baseService.C_APP_URL}/supplier/${path}`, { headers: this.baseService.getHeaders() }).pipe(map(response => response.data ?? empty as T), catchError(this.baseService.handleError));
    }

    private getLookup(path: string): Observable<SupplierPortalLookupItem[]> {
        return this.http.get<{ data: SupplierPortalLookupItem[] }>(`${this.baseService.C_APP_URL}/supplier/users/invitations/${path}`, {
            headers: this.baseService.getHeaders()
        }).pipe(
            map(response => response.data || []),
            catchError(this.baseService.handleError)
        );
    }
}
