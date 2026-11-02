import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { IMaintenanceRequest } from './maintenanceRequest';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';
import { ListPageState } from '@/shared/list-page.models';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceRequestService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/MaintenanceRequests';
    this.CacheData = {} as ICacheData;
    this.baseService.isTokenUpdated().subscribe(token => {
      this.CacheData = {} as ICacheData;
    });
  }

  setCache<TFilters>(result: any, permission: any, state: ListPageState<TFilters>): void {
    this.CacheData.Data = result.Records;
    this.CacheData.TotalRecords = result.TotalRecords;
    this.CacheData.permission = permission;
    // An empty result is still a completed request and needs its state restored on return.
    this.CacheData.IsLoaded = true;
    this.CacheData.CurrentPage = state.pagination.page;
    this.CacheData.pgEvent = state.pagination;
    this.CacheData.stateData = state;
  } 
 
 search(  searchParam: any): Observable<any> {
    const url = `${this.baseUrl}/search`;
    return this.http.post<any>(url, searchParam, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  getAssetDefaults(assetId: number): Observable<any> {
    const url = `${this.baseUrl}/asset/${assetId}/defaults`;
    return this.http.get<any>(url, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  GetAll(IsDeleted: Boolean): Observable<any> {
    return this.getAll();
  }
}







