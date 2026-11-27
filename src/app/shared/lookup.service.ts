import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, catchError, expand, map, reduce, shareReplay, throwError } from 'rxjs';
import { BaseService } from './IBaseService';
import { ISelectItem } from './ISelectItem';

/**
 * Caches stable, tenant-scoped reference data for the lifetime of the signed-in
 * session.  Volatile lookups intentionally continue to be fetched normally.
 */
@Injectable({ providedIn: 'root' })
export class LookupService {
  private readonly cachedLookupTypes = new Set([
    'asset-categories',
    'asset-types',
    'asset-statuses',
    'parties',
    'organisations',
    'organisation-units',
    'locations'
  ]);
  private readonly cache = new Map<string, Observable<ISelectItem[]>>();

  constructor(
    private readonly http: HttpClient,
    private readonly baseService: BaseService
  ) {
    this.baseService.isTokenUpdated().subscribe(() => this.clear());
  }

  getEntityLookupOptions(
    lookupType: string,
    tenantId: number | string,
    selectedId?: number | string,
    filters: Record<string, number> = {},
    valueMode: 'id' | 'reference' = 'id',
    preserveServerOrder = false
  ): Observable<ISelectItem[]> {
    const normalizedLookupType = lookupType.trim().toLowerCase();
    if (!this.cachedLookupTypes.has(normalizedLookupType)) {
      return this.load(normalizedLookupType, tenantId, selectedId, filters, valueMode, preserveServerOrder);
    }

    const key = this.cacheKey(normalizedLookupType, tenantId, selectedId, filters, valueMode, preserveServerOrder);
    const cached = this.cache.get(key);
    if (cached) return this.copyItems(cached);

    const request = this.load(normalizedLookupType, tenantId, selectedId, filters, valueMode, preserveServerOrder).pipe(
      // Do not retain failed requests; the next visit must be able to retry.
      catchError(error => {
        this.cache.delete(key);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    this.cache.set(key, request);
    return this.copyItems(request);
  }

  invalidate(lookupType: string): void {
    const prefix = `${lookupType.trim().toLowerCase()}|`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) this.cache.delete(key);
    }
  }

  invalidateAssetCategories(): void {
    this.invalidate('asset-categories');
    // Type options carry the category relationship and must be rebuilt too.
    this.invalidate('asset-types');
  }

  invalidateAssetTypes(): void {
    this.invalidate('asset-types');
  }

  invalidateAssetStatuses(): void {
    this.invalidate('asset-statuses');
  }

  invalidateParties(): void {
    this.invalidate('parties');
  }

  invalidateOrganisations(): void {
    this.invalidate('organisations');
    this.invalidate('organisation-units');
  }

  invalidateOrganisationUnits(): void {
    this.invalidate('organisation-units');
  }

  invalidateLocations(): void {
    this.invalidate('locations');
  }

  clear(): void {
    this.cache.clear();
  }

  private load(
    lookupType: string,
    tenantId: number | string,
    selectedId: number | string | undefined,
    filters: Record<string, number>,
    valueMode: 'id' | 'reference',
    preserveServerOrder: boolean
  ): Observable<ISelectItem[]> {
    const page = (skip: number) => {
      const params = new URLSearchParams({ tenantId: String(tenantId), pageSize: '100', skip: String(skip) });
      if (selectedId) params.set(valueMode === 'reference' ? 'selectedValue' : 'selectedId', String(selectedId));
      for (const [field, value] of Object.entries(filters)) {
        if (value > 0) params.set(`filters[${field}]`, String(value));
      }
      return this.http.get<any>(`${this.baseService.C_APP_URL}/Lookups/${lookupType}?${params}`, {
        headers: this.baseService.getHeaders()
      }).pipe(map(response => ({ skip, rows: response.data || [] as any[] })));
    };

    return page(0).pipe(
      expand(result => result.rows.length === 100 ? page(result.skip + 100) : EMPTY),
      reduce((items, result) => [...items, ...result.rows], [] as any[]),
      map(items => {
        const options = [...new Map(items.map(item => [item.Id, item])).values()].map(item => ({
          Id: item.Id,
          Value: valueMode === 'reference'
            ? (item.ReferenceValue || item.ProfileCode || item.Code || item.Value)
            : item.Id,
          Text: item.DisplayText,
          Category: item.Code,
          ParentId: item.ParentId,
          IsQualified: item.IsQualified === true
        }));
        return preserveServerOrder ? options : this.sortSelectItems(options);
      })
    );
  }

  private cacheKey(
    lookupType: string,
    tenantId: number | string,
    selectedId: number | string | undefined,
    filters: Record<string, number>,
    valueMode: 'id' | 'reference',
    preserveServerOrder: boolean
  ): string {
    const normalizedFilters = Object.entries(filters)
      .filter(([, value]) => value > 0)
      .sort(([left], [right]) => left.localeCompare(right));
    return [lookupType, tenantId, selectedId ?? '', valueMode, preserveServerOrder, JSON.stringify(normalizedFilters)].join('|');
  }

  private copyItems(source: Observable<ISelectItem[]>): Observable<ISelectItem[]> {
    return source.pipe(map(items => items.map(item => ({ ...item }))));
  }

  private sortSelectItems(items: ISelectItem[]): ISelectItem[] {
    return [...items].sort((left, right) =>
      String(left.Text ?? '').localeCompare(String(right.Text ?? ''), 'en', { numeric: true, sensitivity: 'base' })
    );
  }
}
