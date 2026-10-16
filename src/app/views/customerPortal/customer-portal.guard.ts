import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { LoggedInUserService } from '@/shared/LoggedInUserService';

/** Prevents a signed-in internal user from entering customer-only pages by URL. */
@Injectable({ providedIn: 'root' })
export class CustomerPortalGuard implements CanActivate, CanActivateChild {
    constructor(
        private readonly loggedInUserService: LoggedInUserService,
        private readonly router: Router
    ) {}

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        if (this.loggedInUserService.isCustomerPortalUser) {
            return true;
        }

        this.router.navigate(['/dashboard/mydashboard']);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }
}
