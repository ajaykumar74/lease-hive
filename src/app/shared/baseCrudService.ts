import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from './IBaseService';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService<T> {

  protected abstract baseUrl: string;

  constructor(protected http: HttpClient, protected baseService: BaseService) { }

  get headers(): HttpHeaders {
    return this.baseService.getHeaders();
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }



  getById(id: number, piiMasking: boolean = true): Observable<T> {
    const url = `${this.baseUrl}/${id}?piiMasking=${piiMasking}`;
    return this.http.get<T>(url, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  create(obj: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, obj, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }



  update(id: number, obj: T): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<T>(url, obj, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  delete(id: number): Observable<{}> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<{}>(url, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }
}
