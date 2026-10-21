import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { AiTenantSettings, UpdateAiTenantSettings } from './ai-tenant-settings.models';

@Injectable({ providedIn: 'root' })
export class AiTenantSettingsService {
    private readonly url: string;

    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {
        this.url = `${this.baseService.C_APP_URL}/ai/tenant-settings`;
    }

    get(): Observable<AiTenantSettings> {
        return this.http.get<{ data: AiTenantSettings }>(this.url, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }

    update(settings: UpdateAiTenantSettings): Observable<AiTenantSettings> {
        return this.http.put<{ data: AiTenantSettings }>(this.url, settings, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }
}
