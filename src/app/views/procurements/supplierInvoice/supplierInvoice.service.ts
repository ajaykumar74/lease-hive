import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { ISupplierInvoice, ISupplierInvoicePurchaseOrderContext } from './supplierInvoice';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';

@Injectable({
  providedIn: 'root'
})
export class SupplierInvoiceService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/SupplierInvoices';
    this.CacheData = {} as ICacheData;
    this.baseService.isTokenUpdated().subscribe(token => {
      this.CacheData = {} as ICacheData;
    });
  }

  setCache(result: any, permission: any, objsearch: any, curPage: number): void {
    this.CacheData.Data = result.Records;
    this.CacheData.TotalRecords = result.TotalRecords;
    this.CacheData.permission = permission;
    this.CacheData.IsLoaded = (result.TotalRecords > 0);
    this.CacheData.CurrentPage = curPage;
    this.CacheData.objSearch = objsearch;
  } 
 
 search(  searchParam: any): Observable<any> {
    const url = `${this.baseUrl}/search`;
    return this.http.post<any>(url, searchParam, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  getPurchaseOrderContext(purchaseOrderId: number, excludeSupplierInvoiceId = 0): Observable<{ data: ISupplierInvoicePurchaseOrderContext }> {
    return this.http.get<{ data: ISupplierInvoicePurchaseOrderContext }>(
      `${this.baseUrl}/purchase-orders/${purchaseOrderId}/eligible-lines`,
      { headers: this.headers, params: { excludeSupplierInvoiceId } }
    ).pipe(
      tap(data => this.baseService.onTapData(data)),
      catchError(this.baseService.handleError)
    );
  }

  getReview(supplierInvoiceId: number): Observable<{ data: SupplierInvoiceReview }> {
    return this.http.get<{ data: SupplierInvoiceReview }>(
      `${this.baseService.C_APP_URL}/supplier-invoice-review/${supplierInvoiceId}`,
      { headers: this.headers }
    ).pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  review(supplierInvoiceId: number, action: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION', remarks: string): Observable<{ success: boolean; status: string }> {
    return this.http.post<{ success: boolean; status: string }>(
      `${this.baseService.C_APP_URL}/supplier-invoice-review/${supplierInvoiceId}/actions`,
      { action, remarks },
      { headers: this.headers }
    ).pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  GetAll(IsDeleted: Boolean): Observable<any> {
    return this.getAll();
  }
}

export interface SupplierInvoiceReview {
  SupplierInvoiceId: number;
  SupplierInvoiceNo: string;
  Status: string;
  RevisionNo: number;
  HasInvoicePdf: boolean;
  Exceptions: SupplierInvoiceValidationException[];
  History: SupplierInvoiceReviewHistory[];
}

export interface SupplierInvoiceValidationException {
  ExceptionTypeCode: string;
  SeverityCode: string;
  Description: string;
  StatusCode: string;
  IsBlocking: boolean;
}

export interface SupplierInvoiceReviewHistory {
  FromStatusCode: string;
  ToStatusCode: string;
  ActionCode: string;
  Remarks: string;
  CreatedByCode: string;
  CreatedDateTime: string;
}







