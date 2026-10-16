import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';

export interface CustomerPortalInvitation {
    PartyId: number;
    PartyContactId: number;
    PortalRole: 'CUSTOMER_PORTAL_ADMIN' | 'CUSTOMER_PORTAL_USER';
    PartyLocationId?: number;
    CustomerDepartmentId?: number;
}

@Injectable({ providedIn: 'root' })
export class CustomerPortalInvitationService {
    constructor(private readonly http: HttpClient, private readonly baseService: BaseService) {}

    send(invitation: CustomerPortalInvitation): Observable<any> {
        return this.http.post<any>(`${this.baseService.C_APP_URL}/customer-portal/invitations`, invitation, {
            headers: this.baseService.getHeaders()
        }).pipe(
            tap(response => this.baseService.onTapData(response)),
            catchError(this.baseService.handleError)
        );
    }
}
