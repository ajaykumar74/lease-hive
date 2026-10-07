import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';

import {
    BehaviorSubject,
    Observable
} from 'rxjs';

import { map, tap } from 'rxjs/operators';

import {
    UserSecurityContext,
    UserSecurityContextResponse
} from './security.models';
import { BaseService } from '../IBaseService';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    private readonly permissionsSubject =
        new BehaviorSubject<Set<string>>(
            new Set<string>()
        );

    private readonly securityContextSubject =
        new BehaviorSubject<UserSecurityContext | null>(
            null
        );

    public readonly permissions$ =
        this.permissionsSubject.asObservable();

    public readonly securityContext$ =
        this.securityContextSubject.asObservable();


    constructor(
        private readonly http: HttpClient,
        private   baseService: BaseService
    ) {
    }


    loadPermissions(
        token: string,
        timeZoneId?: string
    ): Observable<UserSecurityContext> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Timezone': timeZoneId || 'UTC'
        });

        return this.http
            .get<UserSecurityContextResponse>(
                this.baseService.C_APP_URL +'/security/me',
                {
                    headers: headers
                }
            )
            .pipe(
                map(response => ({
                    userId: response.UserId,
                    tenantId: response.TenantId,
                    userCode: response.UserCode,
                    permissions: response.Permissions ?? []
                })),
                tap(context => {

                    this.securityContextSubject.next(
                        context
                    );

                    this.setPermissions(
                        context.permissions
                    );
                })
            );
    }


    setPermissions(
        permissions: string[]
    ): void {

        const normalizedPermissions =
            new Set<string>(
                (permissions ?? [])
                    .filter(x => !!x)
                    .map(x => x.toLowerCase())
            );

        this.permissionsSubject.next(
            normalizedPermissions
        );
    }


    hasPermission(
        permission: string
    ): boolean {

        if (!permission) {
            return false;
        }

        return this.permissionsSubject.value.has(
            permission.toLowerCase()
        );
    }


    hasAnyPermission(
        permissions: string[]
    ): boolean {

        if (!permissions?.length) {
            return false;
        }

        return permissions.some(
            permission =>
                this.hasPermission(permission)
        );
    }


    hasAllPermissions(
        permissions: string[]
    ): boolean {

        if (!permissions?.length) {
            return false;
        }

        return permissions.every(
            permission =>
                this.hasPermission(permission)
        );
    }


    getPermissions(): string[] {

        return Array.from(
            this.permissionsSubject.value
        );
    }


    getSecurityContext():
        UserSecurityContext | null {

        return this.securityContextSubject.value;
    }


    clear(): void {

        this.permissionsSubject.next(
            new Set<string>()
        );

        this.securityContextSubject.next(
            null
        );
    }
}
