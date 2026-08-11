import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '../../shared/IBaseService';
import { BaseCrudService } from '../../shared/baseCrudService';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseCrudService<any> {

  protected baseUrl: string;
  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/CustomerOnboarding';
    //this.onboardingData = new ClsOnboarding().init();
    this.baseService.isTokenUpdated().subscribe(token => {
    });
  }

  setCache(result: any, permission: any, objsearch: any, curPage: number): void {
    // this.CacheData.Data = result.Records;
    // this.CacheData.TotalRecords = result.TotalRecords;
    // this.CacheData.permission = permission;
    // this.CacheData.pgEvent = pgEvent;
    // this.CacheData.objSearch = objsearch;
    // this.CacheData.IsLoaded = result.Records.length > 0;
  }

  search(searchParam: any): Observable<any> {
    const url = `${this.baseUrl}/search`;
    return this.http.post<any>(url, searchParam, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }


  register(registerObj: any): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post<any>(url, registerObj, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  getByEmailId(registerObj: any): Observable<any> {
    const url = `${this.baseUrl}/GetByEmailId/?emailId=` + registerObj.EmailId;
    return this.http.get<any>(url, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  validateEmailId(registerObj: any): Observable<any> {
    const url = `${this.baseUrl}/ValidateEmailId/` + registerObj.Id;
    return this.http.post<any>(url, registerObj, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  validateMobileNumber(registerObj: any): Observable<any> {
    const url = `${this.baseUrl}/ValidateMobile/` + registerObj.Id;
    return this.http.post<any>(url, registerObj, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  getCompnayProfile(registerObj: any): Observable<any> {
    const url = `${this.baseUrl}/GetCompnayProfile/?number=` + registerObj.Crn;
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







