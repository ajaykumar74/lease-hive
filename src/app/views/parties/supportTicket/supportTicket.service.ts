import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { ISupportTicket, ISupportTicketInput, ISupportTicketMessage } from './supportTicket';

@Injectable({ providedIn: 'root' })
export class SupportTicketService {
    private readonly endpoint: string;
    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) { this.endpoint = `${this.baseService.C_APP_URL}/support-tickets`; }
    search(search: { TicketId?: string; PartyId?: number | null; CategoryCode?: string; Skip?: number; Take?: number }): Observable<{ Records: ISupportTicket[]; TotalRecords: number }> {
        return this.http.post<{ data: { Records: ISupportTicket[]; TotalRecords: number } }>(`${this.endpoint}/search`, search, { headers: this.baseService.getHeaders() }).pipe(map(response => response.data), catchError(this.baseService.handleError));
    }
    getById(id: number): Observable<ISupportTicket> { return this.http.get<{ data: ISupportTicket }>(`${this.endpoint}/${id}`, { headers: this.baseService.getHeaders() }).pipe(map(response => response.data), catchError(this.baseService.handleError)); }
    create(input: ISupportTicketInput): Observable<ISupportTicket> { return this.http.post<{ data: ISupportTicket }>(this.endpoint, input, { headers: this.baseService.getHeaders() }).pipe(map(response => response.data), catchError(this.baseService.handleError)); }
    update(id: number, input: ISupportTicketInput): Observable<ISupportTicket> { return this.http.put<{ data: ISupportTicket }>(`${this.endpoint}/${id}`, input, { headers: this.baseService.getHeaders() }).pipe(map(response => response.data), catchError(this.baseService.handleError)); }
    postMessage(id: number, input: { Message: string; IsInternalNote: boolean }): Observable<ISupportTicketMessage> { return this.http.post<{ data: ISupportTicketMessage }>(`${this.endpoint}/${id}/messages`, input, { headers: this.baseService.getHeaders() }).pipe(map(response => response.data), catchError(this.baseService.handleError)); }
}
