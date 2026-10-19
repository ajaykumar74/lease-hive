import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { AiUsageDashboard, AiUsageQuery, AiUsageRequestPage, AiUsageRequestQuery } from './ai-usage.models';

@Injectable({ providedIn: 'root' })
export class AiUsageService {
    private readonly baseUrl: string;

    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {
        this.baseUrl = `${this.baseService.C_APP_URL}/ai/usage`;
    }

    getSummary(query: AiUsageQuery): Observable<AiUsageDashboard> {
        return this.http.get<{ data: AiUsageDashboard }>(`${this.baseUrl}/summary`, {
            headers: this.baseService.getHeaders(),
            params: this.dateParams(query)
        }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }

    getRequests(query: AiUsageRequestQuery): Observable<AiUsageRequestPage> {
        return this.http.get<{ data: AiUsageRequestPage }>(`${this.baseUrl}/requests`, {
            headers: this.baseService.getHeaders(),
            params: this.dateParams(query)
                .set('PageNumber', String(query.PageNumber))
                .set('PageSize', String(query.PageSize))
        }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }

    private dateParams(query: AiUsageQuery): HttpParams {
        return new HttpParams()
            .set('FromUtc', query.FromUtc)
            .set('ToUtc', query.ToUtc);
    }
}
