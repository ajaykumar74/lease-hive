import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { LoggedInUserService } from '@/shared/LoggedInUserService';

/** Blocks customer and internal sessions from supplier-only pages. */
@Injectable({ providedIn: 'root' })
export class SupplierPortalGuard implements CanActivate, CanActivateChild {
    constructor(private readonly loggedInUserService: LoggedInUserService, private readonly router: Router) {}

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        if (this.loggedInUserService.isSupplierPortalUser) return true;
        this.router.navigate(['/dashboard/mydashboard']);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }
}

/** Keeps the user-management UI aligned with the supplier-admin API boundary. */
@Injectable({ providedIn: 'root' })
export class SupplierPortalAdministratorGuard implements CanActivate {
    constructor(private readonly loggedInUserService: LoggedInUserService, private readonly router: Router) {}

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        if (this.loggedInUserService.isSupplierPortalAdmin) return true;
        this.router.navigate(['/supplier/dashboard']);
        return false;
    }
}
