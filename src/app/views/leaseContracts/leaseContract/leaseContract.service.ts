import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { ILeaseContract } from './leaseContract';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';

@Injectable({
  providedIn: 'root'
})
export class LeaseContractService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/LeaseContracts';
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

  GetAll(IsDeleted: Boolean): Observable<any> {
    return this.getAll();
  }

  previewAgreement(id: number, templateId?: number): Observable<Blob> {
    const query = templateId ? `?templateId=${templateId}` : '';
    return this.http.get(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/preview${query}`, {
      headers: this.headers,
      responseType: 'blob'
    }).pipe(catchError(this.baseService.handleError));
  }

  generateAgreement(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/generate-agreement`, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  getAgreement(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/agreement`, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  downloadAgreement(id: number): Observable<Blob> {
    return this.http.get(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/agreement/download`, {
      headers: this.headers,
      responseType: 'blob'
    }).pipe(catchError(this.baseService.handleError));
  }

  sendForSignature(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/send-for-signature`, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }
}







