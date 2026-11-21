import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { ISupplierQuotation } from './supplierQuotation';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';

@Injectable({
  providedIn: 'root'
})
export class SupplierQuotationService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/SupplierQuotations';
    this.CacheData = {} as ICacheData;
    this.baseService.isTokenUpdated().subscribe(token => {
      this.CacheData = {} as ICacheData;
    });
  }

  setCache(result: any, permission: any, stateData: any): void {
    this.CacheData.Data = result.Records;
    this.CacheData.TotalRecords = result.TotalRecords;
    this.CacheData.permission = permission;
    this.CacheData.IsLoaded = true;
    this.CacheData.stateData = stateData;
  } 
 
 search(  searchParam: any): Observable<any> {
    const url = `${this.baseUrl}/search`;
    return this.http.post<any>(url, searchParam, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  getLatestActiveForRfq(rfqId: number): Observable<{ data: number | null }> {
    const url = `${this.baseUrl}/for-rfq/${rfqId}`;
    return this.http.get<{ data: number | null }>(url, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  transitionStatus(id: number, statusCode: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED', rowVersionStr: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/status-transition`, {
      StatusCode: statusCode,
      RowVersionStr: rowVersionStr
    }, { headers: this.headers }).pipe(
      tap(data => this.baseService.onTapData(data)),
      catchError(this.baseService.handleError)
    );
  }

  downloadDocument(quotationId: number, documentId: number): Observable<Blob> {
    return this.http.get(
      `${this.baseService.C_APP_URL}/document-attachments/SupplierQuotation/${quotationId}/${documentId}/download`,
      { headers: this.headers, responseType: 'blob' }
    ).pipe(catchError(this.baseService.handleError));
  }

  GetAll(IsDeleted: Boolean): Observable<any> {
    return this.getAll();
  }
}







