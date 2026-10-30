import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import {
    PlatformSettingDefinition,
    PlatformSettingDefinitionInput,
    UpdatePlatformSettingDefinition
} from './platform-settings.models';

@Injectable({ providedIn: 'root' })
export class PlatformSettingsService {
    private readonly url: string;

    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {
        this.url = `${this.baseService.C_APP_URL}/platform/settings`;
    }

    getDefinitions(): Observable<PlatformSettingDefinition[]> {
        return this.http.get<{ data: PlatformSettingDefinition[] }>(this.url, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }

    createDefinition(request: PlatformSettingDefinitionInput): Observable<PlatformSettingDefinition> {
        return this.http.post<{ data: PlatformSettingDefinition }>(this.url, request, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }

    updateDefinition(id: number, request: UpdatePlatformSettingDefinition): Observable<PlatformSettingDefinition> {
        return this.http.put<{ data: PlatformSettingDefinition }>(`${this.url}/${id}`, request, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }
}
