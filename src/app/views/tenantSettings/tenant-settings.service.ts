import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import {
    RecurringBillingSystemUser,
    TenantSettingsResponse,
    UpdateTenantSettingsRequest
} from './tenant-settings.models';

@Injectable({ providedIn: 'root' })
export class TenantSettingsService {
    private readonly url: string;

    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {
        this.url = `${this.baseService.C_APP_URL}/tenant-settings`;
    }

    getAll(): Observable<TenantSettingsResponse> {
        return this.http.get<{ data: TenantSettingsResponse }>(this.url, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }

    update(request: UpdateTenantSettingsRequest): Observable<TenantSettingsResponse> {
        return this.http.put<{ data: TenantSettingsResponse }>(this.url, request, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }

    reset(categoryCode: string): Observable<TenantSettingsResponse> {
        return this.http.post<{ data: TenantSettingsResponse }>(`${this.url}/reset/${encodeURIComponent(categoryCode)}`, {}, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }

    getEligibleRecurringBillingSystemUsers(): Observable<RecurringBillingSystemUser[]> {
        return this.http.get<{ data: RecurringBillingSystemUser[] }>(`${this.url}/recurring-billing-system-users`, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }
}
