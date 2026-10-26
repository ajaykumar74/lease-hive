import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { IQuote } from './quote';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';

@Injectable({
  providedIn: 'root'
})
export class QuoteService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/Quotes';
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

  createRevision(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/revision`;
    return this.http.post<any>(url, {}, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  previewDocument(id: number, templateId?: number): Observable<Blob> {
    const query = templateId ? `?templateId=${templateId}` : '';
    return this.http.get(`${this.baseService.C_APP_URL}/quotation-documents/${id}/preview${query}`, {
      headers: this.headers,
      responseType: 'blob'
    }).pipe(catchError(this.baseService.handleError));
  }

  getIssuedDocument(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseService.C_APP_URL}/quotation-documents/${id}/issued`, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  downloadIssuedDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseService.C_APP_URL}/quotation-documents/${id}/issued/download`, {
      headers: this.headers,
      responseType: 'blob'
    }).pipe(catchError(this.baseService.handleError));
  }

  sendIssuedDocument(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseService.C_APP_URL}/quotation-documents/${id}/send-to-customer`, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }
}







