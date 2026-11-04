import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { IOpenReceivablesSummary, IReceivable } from './receivable';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';
import { ListPageState } from '@/shared/list-page.models';

@Injectable({
  providedIn: 'root'
})
export class ReceivableService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;
  readonly openReceivablesSummary$ = new BehaviorSubject<IOpenReceivablesSummary | null>(null);

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/Receivables';
    this.CacheData = {} as ICacheData;
    this.baseService.isTokenUpdated().subscribe(token => {
      this.CacheData = {} as ICacheData;
    });
  }

  setCache<TFilters>(result: any, permission: any, state: ListPageState<TFilters>, requestSignature: string): void {
    this.CacheData.Data = result.Records;
    this.CacheData.TotalRecords = result.TotalRecords;
    this.CacheData.permission = permission;
    this.CacheData.IsLoaded = true;
    this.CacheData.CurrentPage = state.pagination.page;
    this.CacheData.pgEvent = state.pagination;
    this.CacheData.stateData = state;
    this.CacheData.SearchParams = requestSignature;
  }

  invalidateListCache(): void {
    this.CacheData = { stateData: this.CacheData.stateData } as ICacheData;
  }
 
 search(searchParam: any): Observable<any> {
    const isOpenReceivablesRequest = searchParam?.OpenReceivables === true;
    const url = `${this.baseUrl}/${isOpenReceivablesRequest ? 'open' : 'search'}`;
    return this.http.post<any>(url, searchParam, { headers: this.headers })
      .pipe(
        tap(data => {
          this.baseService.onTapData(data);
          if (isOpenReceivablesRequest) this.openReceivablesSummary$.next(data?.data?.Summary || null);
        }),
        catchError(this.baseService.handleError)
      );
  }

  exportOpenReceivables(searchParam: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/open`, { ...searchParam, ExportAll: true, Skip: 0, Take: 1 }, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  getReceivablesAgeing(searchParam: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ageing`, searchParam, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  exportReceivablesAgeing(searchParam: any): Observable<any> {
    return this.getReceivablesAgeing({ ...searchParam, ExportAll: true, Skip: 0, Take: 1 });
  }

  reconcileMissingReceivables(): Observable<any> {
    return this.http.post<any>(`${this.baseService.C_APP_URL}/customer-invoice-documents/reconcile-receivables`, {}, { headers: this.headers })
      .pipe(catchError(this.baseService.handleError));
  }

  GetAll(IsDeleted: Boolean): Observable<any> {
    return this.getAll();
  }
}







