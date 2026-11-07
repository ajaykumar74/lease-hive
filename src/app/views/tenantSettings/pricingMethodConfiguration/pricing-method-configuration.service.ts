import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import {
    TenantPricingMethodConfiguration,
    UpdateTenantPricingMethodConfiguration
} from './pricing-method-configuration.models';

@Injectable({ providedIn: 'root' })
export class PricingMethodConfigurationService {
    private readonly url: string;

    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {
        this.url = `${this.baseService.C_APP_URL}/tenant-pricing-methods`;
    }

    get(): Observable<TenantPricingMethodConfiguration> {
        return this.http.get<{ data: TenantPricingMethodConfiguration }>(this.url, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }

    update(request: UpdateTenantPricingMethodConfiguration): Observable<TenantPricingMethodConfiguration> {
        return this.http.put<{ data: TenantPricingMethodConfiguration }>(this.url, request, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }
}
