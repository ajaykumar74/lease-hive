import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { TaxRule, TaxRuleInput, TaxRuleListResponse, TaxRuleSearchRequest } from './tax-rule.models';
import { TaxClassification, TaxClassificationInput, TaxClassificationListResponse, TaxClassificationMapping, TaxClassificationMappingInput, TaxClassificationMappingListResponse, TaxClassificationMappingSearchRequest, TaxClassificationSearchRequest } from './tax-classification.models';

@Injectable({ providedIn: 'root' })
export class TaxConfigurationService {
    private readonly url: string;

    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {
        this.url = `${this.baseService.C_APP_URL}/tax-rules`;
    }

    search(request: TaxRuleSearchRequest): Observable<TaxRuleListResponse> {
        return this.http.get<{ data: TaxRuleListResponse }>(this.url, {
            headers: this.baseService.getHeaders(),
            params: toParams(request)
        }).pipe(tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    get(id: number): Observable<TaxRule> {
        return this.http.get<{ data: TaxRule }>(`${this.url}/${id}`, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    create(rule: TaxRuleInput): Observable<TaxRule> {
        return this.http.post<{ data: TaxRule }>(this.url, rule, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    update(id: number, rule: TaxRuleInput): Observable<TaxRule> {
        return this.http.put<{ data: TaxRule }>(`${this.url}/${id}`, rule, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    delete(id: number, rowVersionStr: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`, {
            headers: this.baseService.getHeaders(),
            params: toParams({ rowVersionStr })
        }).pipe(catchError(this.baseService.handleError));
    }

    searchClassifications(request: TaxClassificationSearchRequest): Observable<TaxClassificationListResponse> {
        return this.http.get<{ data: TaxClassificationListResponse }>(`${this.baseService.C_APP_URL}/tax-classifications`, { headers: this.baseService.getHeaders(), params: toParams(request) })
            .pipe(tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    getClassification(id: number): Observable<TaxClassification> {
        return this.http.get<{ data: TaxClassification }>(`${this.baseService.C_APP_URL}/tax-classifications/${id}`, { headers: this.baseService.getHeaders() })
            .pipe(tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    createClassification(value: TaxClassificationInput): Observable<TaxClassification> {
        return this.http.post<{ data: TaxClassification }>(`${this.baseService.C_APP_URL}/tax-classifications`, value, { headers: this.baseService.getHeaders() })
            .pipe(tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    updateClassification(id: number, value: TaxClassificationInput): Observable<TaxClassification> {
        return this.http.put<{ data: TaxClassification }>(`${this.baseService.C_APP_URL}/tax-classifications/${id}`, value, { headers: this.baseService.getHeaders() })
            .pipe(tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    deleteClassification(id: number, rowVersionStr: string): Observable<void> {
        return this.http.delete<void>(`${this.baseService.C_APP_URL}/tax-classifications/${id}`, { headers: this.baseService.getHeaders(), params: toParams({ rowVersionStr }) }).pipe(catchError(this.baseService.handleError));
    }

    searchMappings(request: TaxClassificationMappingSearchRequest): Observable<TaxClassificationMappingListResponse> {
        return this.http.get<{ data: TaxClassificationMappingListResponse }>(`${this.baseService.C_APP_URL}/tax-classifications/mappings`, { headers: this.baseService.getHeaders(), params: toParams(request) })
            .pipe(tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    getMapping(id: number): Observable<TaxClassificationMapping> {
        return this.http.get<{ data: TaxClassificationMapping }>(`${this.baseService.C_APP_URL}/tax-classifications/mappings/${id}`, { headers: this.baseService.getHeaders() })
            .pipe(tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    createMapping(value: TaxClassificationMappingInput): Observable<TaxClassificationMapping> {
        return this.http.post<{ data: TaxClassificationMapping }>(`${this.baseService.C_APP_URL}/tax-classifications/mappings`, value, { headers: this.baseService.getHeaders() })
            .pipe(tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    updateMapping(id: number, value: TaxClassificationMappingInput): Observable<TaxClassificationMapping> {
        return this.http.put<{ data: TaxClassificationMapping }>(`${this.baseService.C_APP_URL}/tax-classifications/mappings/${id}`, value, { headers: this.baseService.getHeaders() })
            .pipe(tap(response => this.baseService.onTapData(response)), map(response => response.data), catchError(this.baseService.handleError));
    }

    deleteMapping(id: number, rowVersionStr: string): Observable<void> {
        return this.http.delete<void>(`${this.baseService.C_APP_URL}/tax-classifications/mappings/${id}`, { headers: this.baseService.getHeaders(), params: toParams({ rowVersionStr }) }).pipe(catchError(this.baseService.handleError));
    }
}

function toParams(values: object): HttpParams {
    return Object.entries(values).reduce((params, [key, value]) =>
        value === undefined || value === null || value === '' ? params : params.set(key, String(value)), new HttpParams());
}
