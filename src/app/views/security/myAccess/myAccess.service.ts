import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '@/shared/IBaseService';
import { IMyAccessSnapshot } from './myAccess';

@Injectable({
    providedIn: 'root'
})
export class MyAccessService {

    constructor(
        private readonly http: HttpClient,
        private readonly baseService: BaseService
    ) {
    }

    getMyAccess(): Observable<IMyAccessSnapshot> {
        return this.http.get<IMyAccessSnapshot>(
            `${this.baseService.C_APP_URL}/security/my-access`,
            { headers: this.baseService.getHeaders() }
        );
    }
}
