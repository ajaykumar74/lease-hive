import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';

export interface InternalSupplierDeliveryLine {
    SupplierDeliveryLineId: number;
    PurchaseOrderLineId: number;
    LineNo: number;
    Description: string;
    OrderedQuantity: number;
    DeliveredQuantity: number;
    ReceivedQuantity: number;
    AcceptedQuantity: number;
    RejectedQuantity: number;
    PendingReceiptQuantity: number;
    UomId: number;
}

export interface InternalSupplierDelivery {
    SupplierDeliveryId: number;
    DeliveryNo: string;
    DispatchReference: string;
    SupplierName: string;
    PurchaseOrderNo: string;
    DeliveryDate: string;
    Status: string;
    DeliveredQuantity: number;
    ReceivedQuantity: number;
    PurchaseOrderId?: number;
    SupplierPartyId?: number;
    Transporter?: string;
    TrackingNumber?: string;
    Remarks?: string;
    CanCreateGoodsReceipt?: boolean;
    Lines?: InternalSupplierDeliveryLine[];
}

@Injectable({ providedIn: 'root' })
export class InternalSupplierDeliveryService {
    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {}

    list(search = '', status = ''): Observable<InternalSupplierDelivery[]> {
        let params = new HttpParams();
        if (search.trim()) params = params.set('search', search.trim());
        if (status.trim()) params = params.set('status', status.trim());
        return this.http.get<{ data: InternalSupplierDelivery[] }>(`${this.baseService.C_APP_URL}/supplier-deliveries`, { headers: this.baseService.getHeaders(), params })
            .pipe(map(response => response.data || []), catchError(this.baseService.handleError));
    }

    get(id: number): Observable<InternalSupplierDelivery> {
        return this.http.get<{ data: InternalSupplierDelivery }>(`${this.baseService.C_APP_URL}/supplier-deliveries/${id}`, { headers: this.baseService.getHeaders() })
            .pipe(map(response => response.data), catchError(this.baseService.handleError));
    }

    createGoodsReceipt(id: number): Observable<number> {
        return this.http.post<{ data: { goodsReceiptId: number } }>(`${this.baseService.C_APP_URL}/supplier-deliveries/${id}/goods-receipts`, {}, { headers: this.baseService.getHeaders() })
            .pipe(map(response => Number(response.data?.goodsReceiptId || 0)), catchError(this.baseService.handleError));
    }
}
