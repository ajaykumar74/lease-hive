import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { AiUsageDashboard, AiUsageMetadataPage } from './ai-usage-dashboard.models';

@Injectable({ providedIn: 'root' })
export class AiUsageDashboardService {
    private readonly endpoint: string;

    constructor(
        private readonly http: HttpClient,
        private readonly baseService: BaseService
    ) {
        this.endpoint = `${this.baseService.C_APP_URL}/ai/usage`;
    }

    getDashboard(fromUtc: string, toExclusiveUtc: string): Observable<AiUsageDashboard> {
        return this.http.get<AiUsageDashboard>(`${this.endpoint}/dashboard`, {
            headers: this.baseService.getHeaders(),
            params: new HttpParams()
                .set('fromUtc', fromUtc)
                .set('toExclusiveUtc', toExclusiveUtc)
        });
    }

    getActivity(
        fromUtc: string,
        toExclusiveUtc: string,
        pageNumber: number,
        featureCode?: string,
        statusCode?: string
    ): Observable<AiUsageMetadataPage> {
        let params = new HttpParams()
            .set('fromUtc', fromUtc)
            .set('toExclusiveUtc', toExclusiveUtc)
            .set('pageNumber', pageNumber)
            .set('pageSize', 25);
        if (featureCode) {
            params = params.set('featureCode', featureCode);
        }
        if (statusCode) {
            params = params.set('statusCode', statusCode);
        }

        return this.http.get<AiUsageMetadataPage>(`${this.endpoint}/entries`, {
            headers: this.baseService.getHeaders(),
            params
        });
    }
}
