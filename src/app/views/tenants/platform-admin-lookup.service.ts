import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { ISelectItem } from '@/shared/ISelectItem';

/**
 * Lookups used by the platform administration screens.  A PlatformAdmin is
 * intentionally not tied to one tenant, so these cannot use the normal
 * tenant-scoped lookup helper.
 */
@Injectable({ providedIn: 'root' })
export class PlatformAdminLookupService {
  constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {}

  getTenants(selectedId?: number): Observable<ISelectItem[]> {
    return this.getOptions('/Tenants', selectedId, item =>
      `${item.TenantCode || item.TenantId || item.Id} - ${item.TenantName || item.LegalName || 'Tenant'}`);
  }

  getFeatureDefinitions(selectedId?: number): Observable<ISelectItem[]> {
    // The API intentionally retains /api/features as its stable public route.
    return this.getOptions('/Features', selectedId, item =>
      `${item.FeatureCode || item.FeatureId || item.Id} - ${item.FeatureName || 'Feature definition'}`);
  }

  getSubscriptionPlans(selectedId?: number): Observable<ISelectItem[]> {
    return this.getOptions('/SubscriptionPlans', selectedId, item =>
      `${item.PlanCode || item.SubscriptionPlanId || item.Id} - ${item.PlanName || 'Subscription plan'}`);
  }

  getPicklistOptions(tenantId: number, category: string): Observable<ISelectItem[]> {
    return this.http
      .get<any>(`${this.baseService.C_APP_URL}/PicklistItems/GetByCategory/${encodeURIComponent(category)}?tenantId=${tenantId}`, {
        headers: this.baseService.getHeaders()
      })
      .pipe(map(response => this.toOptions(response?.data || [], item => item.Description || item.ItemName)));
  }

  private getOptions(path: string, selectedId: number | undefined, label: (item: any) => string): Observable<ISelectItem[]> {
    return this.http
      .get<any>(`${this.baseService.C_APP_URL}${path}`, { headers: this.baseService.getHeaders() })
      .pipe(map(response => {
        const options = this.toOptions(response?.data || [], label);
        return selectedId && !options.some(option => option.Id === selectedId)
          ? [...options, { Id: selectedId, Value: String(selectedId), Text: String(selectedId) }]
          : options;
      }));
  }

  private toOptions(items: any[], label: (item: any) => string): ISelectItem[] {
    return [...items]
      .map(item => ({ Id: Number(item.Id), Value: String(item.Id), Text: label(item) }))
      .sort((left, right) => left.Text.localeCompare(right.Text, 'en', { numeric: true, sensitivity: 'base' }));
  }
}
