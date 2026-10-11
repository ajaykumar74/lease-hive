import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MenuPermissionService } from './menu-permission.service';
import { PermissionService } from './permission.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate, CanActivateChild {
    constructor(
        private readonly menuPermissionService: MenuPermissionService,
        private readonly permissionService: PermissionService
    ) {
    }

    canActivate(
        _route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.authorize(state.url);
    }

    canActivateChild(
        _childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.authorize(state.url);
    }

    private authorize(url: string): Observable<boolean> {
        const requiredPermission = this.menuPermissionService.getRequiredPermission(url);

        if (!requiredPermission) {
            return of(true);
        }

        return this.permissionService.ensurePermissionsLoaded().pipe(
            map(() => {
                if (this.permissionService.hasPermission(requiredPermission)) {
                    return true;
                }

                this.showInsufficientPermissionAlert();
                return false;
            }),
            catchError(() => {
                this.showInsufficientPermissionAlert();
                return of(false);
            })
        );
    }

    private showInsufficientPermissionAlert(): void {
        window.alert('Insufficient permission access for this feature');
    }
}
