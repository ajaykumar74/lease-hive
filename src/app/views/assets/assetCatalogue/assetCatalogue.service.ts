import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';

@Injectable({ providedIn: 'root' })
export class AssetCatalogueService {
    private readonly endpoint: string;
    constructor(private readonly http: HttpClient, private readonly base: BaseService) { this.endpoint = `${this.base.C_APP_URL}/asset-catalogue-items`; }
    search(input: any): Observable<any> { return this.http.post(`${this.endpoint}/search`, input, { headers: this.base.getHeaders() }).pipe(catchError(this.base.handleError)); }
    get(id: number): Observable<any> { return this.http.get(`${this.endpoint}/${id}`, { headers: this.base.getHeaders() }).pipe(catchError(this.base.handleError)); }
    create(item: any): Observable<any> { return this.http.post(this.endpoint, item, { headers: this.base.getHeaders() }).pipe(catchError(this.base.handleError)); }
    update(id: number, item: any): Observable<any> { return this.http.put(`${this.endpoint}/${id}`, item, { headers: this.base.getHeaders() }).pipe(catchError(this.base.handleError)); }
    status(id: number, action: 'publish'|'unpublish'|'archive'): Observable<any> { return this.http.post(`${this.endpoint}/${id}/${action}`, {}, { headers: this.base.getHeaders() }).pipe(catchError(this.base.handleError)); }
}
