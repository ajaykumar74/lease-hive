import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { AiAskRequest, AiAskResponse } from './ai-assistant.models';

@Injectable({ providedIn: 'root' })
export class AiAssistantService {
    private readonly url: string;

    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {
        this.url = `${this.baseService.C_APP_URL}/ai/ask`;
    }

    ask(request: AiAskRequest): Observable<AiAskResponse> {
        return this.http.post<{ data: AiAskResponse }>(this.url, request, { headers: this.baseService.getHeaders() }).pipe(
            tap(response => this.baseService.onTapData(response)),
            map(response => response.data),
            catchError(this.baseService.handleError)
        );
    }
}
