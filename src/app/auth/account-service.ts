import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';
import { BaseService } from '../shared/IBaseService';
import { ICacheData } from '../shared/ICacheData';
import { ExternalAuthProvider } from './ExternalAuthProvider';

@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnInit {
  private baseUrl: string;
  public CacheData: ICacheData;
  private externalAuthProviders: ExternalAuthProvider[] = [];

  get headers(): HttpHeaders {
    return this.baseService.getHeaders();
  }

  constructor(private http: HttpClient, private baseService: BaseService) {
    this.baseUrl = this.baseService.C_APP_URL + '/Account';
    this.CacheData = {} as ICacheData;
    this.baseService.isTokenUpdated().subscribe(token => {
      this.CacheData = {} as ICacheData;
    });
  }

  ngOnInit(): void {
   // this.pingWorker();
  }

  private pingWorker(): void {
    fetch("https://taskworker.vloot.in/jobs", {
      method: "GET",
      mode: "no-cors",
      keepalive: true
    }).catch(() => { });
  }

  login(obj: any): Observable<any> {
    const url = `${this.baseUrl}/login`;
    const myheaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, obj, { headers: myheaders })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  loadExternalAuthProviders(): Observable<any> {

    if (this.externalAuthProviders.length > 0) { // return cached value if exists
      return of(this.externalAuthProviders);
    }

    const url = `${this.baseUrl}/getExternalAuthProviders`;
    const myheaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(url, { headers: myheaders })
      .pipe(
        tap(data => {
          this.externalAuthProviders = data;   // cache it
          this.baseService.onTapData(data);
        }),
        catchError(this.baseService.handleError)
      );
  }

  loginWithThirdParty(obj: any): Observable<any> {
    const url = `${this.baseUrl}/loginWithThirdParty`;
    const myheaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, obj, { headers: myheaders })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  changePassword(obj: any): Observable<any> {
    const url = `${this.baseUrl}/change-password`;
    return this.http.post<any>(url, obj, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }


  forgotPassword(obj: any): Observable<any> {
    const url = `${this.baseUrl}/forgot-password`;
    return this.http.post<any>(url, obj, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  resetPassword(obj: any): Observable<any> {
    const url = `${this.baseUrl}/reset-password`;
    return this.http.post<any>(url, obj, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

}







