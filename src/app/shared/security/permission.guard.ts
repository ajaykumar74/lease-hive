import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MenuPermissionService } from './menu-permission.service';
import { PermissionService } from './permission.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate, CanActivateChild {
    constructor(
        private readonly router: Router,
        private readonly menuPermissionService: MenuPermissionService,
        private readonly permissionService: PermissionService
    ) {
    }

    canActivate(
        _route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> {
        return this.authorize(state.url);
    }

    canActivateChild(
        _childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> {
        return this.authorize(state.url);
    }

    private authorize(url: string): Observable<boolean | UrlTree> {
        const requiredPermission = this.menuPermissionService.getRequiredPermission(url);

        if (!requiredPermission) {
            return of(true);
        }

        return this.permissionService.ensurePermissionsLoaded().pipe(
            map(() => this.permissionService.hasPermission(requiredPermission)
                ? true
                : this.router.createUrlTree(['/auth/access'])),
            catchError(() => of(this.router.createUrlTree(['/auth/access'])))
        );
    }
}
