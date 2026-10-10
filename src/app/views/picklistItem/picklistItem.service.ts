import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { IPicklistItem } from './picklistItem';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';
import { ISelectItem } from '@/shared/ISelectItem';

@Injectable({
  providedIn: 'root'
})
export class PicklistItemService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/PicklistItems';
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

  getCategoryOptions(): Observable<ISelectItem[]> {
    return this.http.get<any>(`${this.baseUrl}/bootstrap`, { headers: this.headers })
      .pipe(
        map(response => {
          const items: IPicklistItem[] = response?.data ?? [];
          const categories = new Set<string>();

          for (const item of items) {
            const category = (item.Category ?? '').trim();
            if (category) {
              categories.add(category);
            }
          }

          return Array.from(categories)
            .sort()
            .map((category: string) => ({ Value: category, Text: category } as ISelectItem));
        }),
        catchError(this.baseService.handleError)
      );
  }
}







