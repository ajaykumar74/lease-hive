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
  private readonly tenantIdsByRecordId = new Map<number, string | number>();

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
        tap(data => {
          this.baseService.onTapData(data);
          this.rememberRecordTenantId(id, data);
        }),
        catchError(this.baseService.handleError)
      );
  }

  create(obj: T): Observable<T> {
    // Tenant ownership is never selected by a create form.  It always comes from the signed-in user.
    const payload = this.isTenantResource()
      ? obj
      : this.withTenantId(obj, this.getLoggedInTenantIdForPayload(obj));
    return this.http.post<T>(this.baseUrl, payload, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }



  update(id: number, obj: T): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    // Preserve the tenant from the loaded record (the edit component's objMaster), not from form input.
    const tenantId = this.tenantIdsByRecordId.get(id)
      ?? this.getPayloadTenantId(obj)
      ?? this.baseService.getLoggedInTenantId();
    const payload = this.withTenantId(obj, tenantId);
    return this.http.put<T>(url, payload, { headers: this.headers })
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

  private rememberRecordTenantId(id: number, response: unknown): void {
    const record = this.isPayload(response) && this.isPayload(response['data']) ? response['data'] : response;
    const tenantId = this.getPayloadTenantId(record);
    if (tenantId) this.tenantIdsByRecordId.set(id, tenantId);
  }

  private getPayloadTenantId(payload: unknown): string | number | undefined {
    if (!this.isPayload(payload)) return undefined;
    const tenantId = payload['TenantId'];
    if (typeof tenantId === 'string') return tenantId.trim() ? tenantId : undefined;
    return typeof tenantId === 'number' && Number.isInteger(tenantId) && tenantId > 0 ? tenantId : undefined;
  }

  private getLoggedInTenantIdForPayload(payload: T): string | number | undefined {
    const tenantId = this.baseService.getLoggedInTenantId();
    if (!tenantId) return undefined;
    return typeof this.getPayloadTenantId(payload) === 'string' ? String(tenantId) : tenantId;
  }

  private withTenantId(payload: T, tenantId: string | number | undefined): T {
    if (tenantId === undefined || !this.isPayload(payload)) return payload;
    return { ...payload, TenantId: tenantId } as T;
  }

  private isTenantResource(): boolean {
    return /\/Tenants$/i.test(this.baseUrl);
  }

  private isPayload(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
