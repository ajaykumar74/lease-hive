import { CanActivateFn, Router } from "@angular/router";
import { PermissionService } from "./permission.service";
import { inject } from "@angular/core";


export const permissionGuard: CanActivateFn =
    (route) => {

        const permissions = inject(PermissionService);

        const permission = route.data['permission'];

        if (permissions.hasPermission(permission))
            return true;

        return inject(Router).createUrlTree(['/access-denied']);
    };