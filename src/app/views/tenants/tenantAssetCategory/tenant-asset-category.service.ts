import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';

@Injectable({ providedIn: 'root' })
export class TenantAssetCategoryService {
  constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {}

  getCategories(tenantId: number): Observable<any> {
    return this.http
      .get<any>(`${this.baseService.C_APP_URL}/Tenants/${tenantId}/asset-categories`, {
        headers: this.baseService.getHeaders()
      })
      .pipe(tap(response => this.baseService.onTapData(response)), catchError(this.baseService.handleError));
  }

  saveSelections(tenantId: number, selectedCategoryCodes: string[]): Observable<any> {
    return this.http
      .put<any>(`${this.baseService.C_APP_URL}/Tenants/${tenantId}/asset-categories`,
        { TenantId: tenantId, SelectedCategoryCodes: selectedCategoryCodes },
        { headers: this.baseService.getHeaders() })
      .pipe(tap(response => this.baseService.onTapData(response)), catchError(this.baseService.handleError));
  }
}
