import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { TenantPlanSubscriptionSnapshot } from './tenant-plan-subscription.models';

@Injectable({ providedIn: 'root' })
export class TenantPlanSubscriptionService {
    private readonly url: string;

    constructor(
        private readonly http: HttpClient,
        private readonly baseService: BaseService
    ) {
        this.url = `${this.baseService.C_APP_URL}/tenant-plan-subscription`;
    }

    getCurrent(): Observable<TenantPlanSubscriptionSnapshot> {
        return this.http.get<{ data: TenantPlanSubscriptionSnapshot }>(this.url, { headers: this.baseService.getHeaders() }).pipe(
            map(response => response.data),
            tap(response => this.baseService.onTapData(response)),
            catchError(this.baseService.handleError)
        );
    }
}
