import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ISettings } from './settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;
  public Settings: ISettings;

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.CacheData = {} as ICacheData;
    this.Settings = { RecordsPerPage: 10, GridSize: 'small' } as ISettings;
    this.baseUrl = this.baseService.C_APP_URL + '/Settings';
    this.baseService.isTokenUpdated().subscribe(token => {
      this.CacheData = {} as ICacheData;

    });
  }

  setCache(result: any, permission: any, objsearch: any, curPage: number): void {
    this.CacheData.Data = result.Records;
    this.CacheData.TotalRecords = result.TotalRecords;
    this.CacheData.permission = permission;
    //this.CacheData.pgEvent = pgEvent;
    this.CacheData.objSearch = objsearch;
    this.CacheData.IsLoaded = result.Records.length > 0;
  }

  GetAll(IsDeleted: Boolean): Observable<any> {
    return this.getAll();
  }


  SendTestEmail(params: string): Observable<any> {
    const url = `${this.baseService.C_APP_URL + '/Notifications/TestEmail'}`;
    return this.http.post<any>(url, params, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  TestTaskworker(): Observable<any> {
    const url = `${this.baseService.C_APP_URL + '/Customers/TestTaskworker'}`;
    return this.http.get<any>(url, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

}
