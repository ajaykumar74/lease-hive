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
import { TenantContextService } from './tenant-context.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate, CanActivateChild {
    constructor(
        private readonly menuPermissionService: MenuPermissionService,
        private readonly permissionService: PermissionService,
        private readonly tenantContextService: TenantContextService
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
        const requiredCategory = this.getRequiredAssetCategory(url);

        return this.permissionService.ensurePermissionsLoaded().pipe(
            map(() => {
                const tenantContext = this.tenantContextService.context;
                if (!this.permissionService.getSecurityContext()?.isPlatformAdministrator && tenantContext && tenantContext.TenantStatus?.toLowerCase() !== 'active') {
                    window.alert('Tenant access is unavailable because this tenant is not active.');
                    return false;
                }

                if (requiredCategory && !this.menuPermissionService.hasActiveAssetCategory(requiredCategory)) {
                    this.showInsufficientPermissionAlert();
                    return false;
                }

                if (!requiredPermission || this.permissionService.hasPermission(requiredPermission)) return true;

                this.showInsufficientPermissionAlert();
                return false;
            }),
            catchError(() => {
                this.showInsufficientPermissionAlert();
                return of(false);
            })
        );
    }

    private getRequiredAssetCategory(url: string): string | null {
        const path = url.toLowerCase().split(/[?#]/, 1)[0];
        if (path.startsWith('/business/assets/specialised/vehicles')) return 'VEHICLE';
        if (path.startsWith('/business/assets/specialised/it')) return 'IT';
        if (path.startsWith('/business/assets/specialised/equipment')) return 'EQUIPMENT';
        if (path.startsWith('/business/assets/specialised/property')) return 'PROPERTY';
        return null;
    }

    private showInsufficientPermissionAlert(): void {
        window.alert('Insufficient permission access for this feature');
    }
}
