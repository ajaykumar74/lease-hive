import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { IDeliveryChecklistContext, IDeliveryChecklistSnapshot, IDeliveryChecklistTemplate } from './delivery-checklist.models';

/**
 * The delivery endpoints create an immutable template snapshot on first read.
 * This keeps a tenant's later template edits from changing an in-flight or
 * completed handover and lets LC-04 validate the same persisted evidence.
 */
@Injectable({ providedIn: 'root' })
export class DeliveryChecklistService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {
    this.baseUrl = `${this.baseService.C_APP_URL}/DeliveryChecklistTemplates`;
  }

  getOrCreate(context: IDeliveryChecklistContext): Observable<{ data: IDeliveryChecklistSnapshot }> {
    const url = `${this.baseService.C_APP_URL}/LeaseContracts/${context.LeaseContractId}/delivery-checklist`;
    return this.http.post<{ data: IDeliveryChecklistSnapshot }>(url, context, { headers: this.baseService.getHeaders() })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  save(context: IDeliveryChecklistContext, snapshot: IDeliveryChecklistSnapshot): Observable<{ data: IDeliveryChecklistSnapshot }> {
    const url = `${this.baseService.C_APP_URL}/LeaseContracts/${context.LeaseContractId}/delivery-checklist`;
    return this.http.put<{ data: IDeliveryChecklistSnapshot }>(url, { ...context, ...snapshot }, { headers: this.baseService.getHeaders() })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  getTemplate(assetCategoryId: number): Observable<{ data: IDeliveryChecklistTemplate }> {
    return this.http.get<{ data: IDeliveryChecklistTemplate }>(`${this.baseUrl}/for-category/${assetCategoryId}`, { headers: this.baseService.getHeaders() })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  saveTemplate(template: IDeliveryChecklistTemplate): Observable<{ data: IDeliveryChecklistTemplate }> {
    const request = template.Id
      ? this.http.put<{ data: IDeliveryChecklistTemplate }>(`${this.baseUrl}/${template.Id}`, template, { headers: this.baseService.getHeaders() })
      : this.http.post<{ data: IDeliveryChecklistTemplate }>(this.baseUrl, template, { headers: this.baseService.getHeaders() });
    return request.pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  getForAsset(assetId: number): Observable<{ data: { Records: IDeliveryChecklistSnapshot[] } }> {
    const url = `${this.baseService.C_APP_URL}/DeliveryChecklists/asset/${assetId}`;
    return this.http.get<{ data: { Records: IDeliveryChecklistSnapshot[] } }>(url, { headers: this.baseService.getHeaders() })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }
}
