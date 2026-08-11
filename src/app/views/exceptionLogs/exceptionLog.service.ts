import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';
import { ISelectItem } from '@/shared/ISelectItem';

@Injectable({
  providedIn: 'root'
})
export class ExceptionLogService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData
  private _selectExceptionLogList: ISelectItem[];

  get selectExceptionLogList(): ISelectItem[] {
    return this._selectExceptionLogList;
  }

  set selectExceptionLogList(lst: ISelectItem[]) {
    this._selectExceptionLogList = lst;
  }


  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/ExceptionLogs';
    this.CacheData = {} as ICacheData;
    this.baseService.isTokenUpdated().subscribe(token => {
      this.CacheData = {} as ICacheData;
    });
  }

  setCache(result: any, permission: any, objsearch: any, pgEvent: any): void {
    this.CacheData.Data = result.Records;
    this.CacheData.TotalRecords = result.TotalRecords;
    this.CacheData.permission = permission;
    this.CacheData.pgEvent = pgEvent;
    this.CacheData.objSearch = objsearch;
    this.CacheData.IsLoaded = result.Records.length > 0;
  }

  search(searchParam: any): Observable<any> {
    const url = `${this.baseUrl}/search`;
    return this.http.post<any>(url, searchParam, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  deleteOld(daysToKeep: any): Observable<any> {
    const url = `${this.baseUrl}/` + daysToKeep;
    return this.http.delete<any>(url, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }



}







