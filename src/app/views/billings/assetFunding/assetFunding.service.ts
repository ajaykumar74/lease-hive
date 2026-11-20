import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { IAssetFunding, IAssetFundingAssetSummary, IAssetFundingInstallmentBalance, IAssetFundingListResponse, IAssetFundingPaymentSummary, IAssetFundingScheduleLine, IAssetFundingSchedulePreview, IAssetFundingScheduleVersion, IAssetFundingTransaction, ISpreadsheetInspection } from './assetFunding';
@Injectable({ providedIn: 'root' })
export class AssetFundingService {
    private readonly url: string;
    constructor(private http: HttpClient, private base: BaseService) { this.url = `${base.C_APP_URL}/asset-fundings`; }
    search(searchTerm = '', skip = 0, take = 25, fundingStatus = '', sortBy = 'startDate', isDescending = true): Observable<IAssetFundingListResponse> { let params = new HttpParams().set('searchTerm', searchTerm).set('skip', skip).set('take', take).set('sortBy', sortBy).set('isDescending', String(isDescending)); if (fundingStatus) params = params.set('fundingStatus', fundingStatus); return this.http.get<{ data: IAssetFundingListResponse }>(this.url, { params, headers: this.base.getHeaders() }).pipe(tap(x => this.base.onTapData(x)), map(x => this.normalise<IAssetFundingListResponse>(x.data)), catchError(this.base.handleError)); }
    assetSummary(assetId: number): Observable<IAssetFundingAssetSummary[]> { return this.http.get<any>(`${this.url}/assets/${assetId}/summary`, { headers: this.base.getHeaders() }).pipe(map(x => this.normalise<IAssetFundingAssetSummary[]>(x.data)), catchError(this.base.handleError)); }
    get(id: number): Observable<IAssetFunding> { return this.http.get<any>(`${this.url}/${id}`, { headers: this.base.getHeaders() }).pipe(tap(x => this.base.onTapData(x)), map(x => this.normalise<IAssetFunding>(x.data)), catchError(this.base.handleError)); }
    create(request: Partial<IAssetFunding>): Observable<IAssetFunding> { return this.http.post<any>(this.url, request, { headers: this.base.getHeaders() }).pipe(map(x => this.normalise<IAssetFunding>(x.data)), catchError(error => this.handleFundingError(error))); }
    update(id: number, request: Partial<IAssetFunding>): Observable<IAssetFunding> { return this.http.put<any>(`${this.url}/${id}`, request, { headers: this.base.getHeaders() }).pipe(map(x => this.normalise<IAssetFunding>(x.data)), catchError(error => this.handleFundingError(error))); }
    schedules(id: number): Observable<IAssetFundingScheduleVersion[]> { return this.http.get<any>(`${this.url}/${id}/repayment-schedules`, { headers: this.base.getHeaders() }).pipe(tap(x => this.base.onTapData(x)), map(x => this.normalise<IAssetFundingScheduleVersion[]>(x.data)), catchError(this.base.handleError)); }
    saveSchedule(id: number, lines: IAssetFundingScheduleLine[], confirm: boolean): Observable<IAssetFundingScheduleVersion> { return this.http.post<any>(`${this.url}/${id}/repayment-schedules`, { lines, confirm }, { headers: this.base.getHeaders() }).pipe(map(x => this.normalise<IAssetFundingScheduleVersion>(x.data)), catchError(this.base.handleError)); }
    transactions(id: number): Observable<IAssetFundingTransaction[]> { return this.http.get<any>(`${this.url}/${id}/transactions`, { headers: this.base.getHeaders() }).pipe(map(x => this.normalise<IAssetFundingTransaction[]>(x.data)), catchError(this.base.handleError)); }
    paymentSummary(id: number): Observable<IAssetFundingPaymentSummary> { return this.http.get<any>(`${this.url}/${id}/payment-summary`, { headers: this.base.getHeaders() }).pipe(map(x => this.normalise<IAssetFundingPaymentSummary>(x.data)), catchError(this.base.handleError)); }
    installments(id: number): Observable<IAssetFundingInstallmentBalance[]> { return this.http.get<any>(`${this.url}/${id}/installments`, { headers: this.base.getHeaders() }).pipe(map(x => this.normalise<IAssetFundingInstallmentBalance[]>(x.data)), catchError(this.base.handleError)); }
    recordTransaction(id: number, request: any): Observable<IAssetFundingTransaction> {
        return this.http.post<any>(`${this.url}/${id}/transactions`, request, { headers: this.base.getHeaders() }).pipe(
            map(x => this.normalise<IAssetFundingTransaction>(x.data)),
            catchError(error => (error.status === 400 || error.status === 422) && typeof error.error?.message === 'string'
                ? this.handleFundingError(error)
                : this.base.handleError(error))
        );
    }
    inspectSchedule(file: File, worksheet?: string, headerRow?: number): Observable<ISpreadsheetInspection> { const body = new FormData(); body.append('file', file); if (worksheet) body.append('worksheet', worksheet); if (headerRow) body.append('headerRow', String(headerRow)); return this.http.post<any>(`${this.url}/repayment-schedules/inspect`, body, { headers: this.formHeaders() }).pipe(map(x => this.normalise<ISpreadsheetInspection>(x.data)), catchError(this.base.handleError)); }
    previewSchedule(file: File, worksheet: string, headerRow: number, mappings: Record<string, string>): Observable<IAssetFundingSchedulePreview> { const body = new FormData(); body.append('file', file); body.append('worksheet', worksheet); body.append('headerRow', String(headerRow)); body.append('mappings', JSON.stringify({ worksheet, headerRow, mappings })); return this.http.post<any>(`${this.url}/repayment-schedules/preview`, body, { headers: this.formHeaders() }).pipe(map(x => this.normalise<IAssetFundingSchedulePreview>(x.data)), catchError(this.base.handleError)); }
    private formHeaders() { return this.base.getHeaders().delete('Content-Type'); }
    private normalise<T>(value: unknown): T {
        if (Array.isArray(value)) return value.map(item => this.normalise(item)) as T;
        if (!value || typeof value !== 'object' || value instanceof Date) return value as T;

        return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key.charAt(0).toLowerCase() + key.slice(1), this.normalise(item)])) as T;
    }
    private handleFundingError(error: any): Observable<never> {
        const message = error?.error?.message
            ?? error?.error?.Message
            ?? error?.error?.errorMessage
            ?? error?.error?.ErrorMessage
            ?? error?.message
            ?? error?.Message
            ?? error?.errorMessage
            ?? error?.ErrorMessage
            ?? 'The asset funding request could not be completed.';
        return throwError(() => message);
    }
}
