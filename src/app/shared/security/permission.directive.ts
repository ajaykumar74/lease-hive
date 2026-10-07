import {
    Directive,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs'; 
import { PermissionService } from './permission.service';

@Directive({
    selector: '[appPermission]' ,
    standalone: false
})
export class AppPermissionDirective implements OnInit, OnDestroy {

    private requiredPermissions: string | string[] | null = null;

    private hasView = false;

    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly templateRef: TemplateRef<unknown>,
        private readonly viewContainer: ViewContainerRef,
        private readonly permissionService: PermissionService
    ) {
    }

    /**
     * Examples:
     *
     * *appPermission="'asset.asset.create'"
     *
     * *appPermission="[
     *     'asset.asset.create',
     *     'asset.asset.update'
     * ]"
     */
    @Input()
    set appPermission(value: string | string[]) {
        this.requiredPermissions = value;

        this.updateView();
    }

    ngOnInit(): void {

        /*
         * Re-evaluate whenever permissions change.
         *
         * This is important because the directive may be created
         * before /api/security/me has finished loading.
         */
        this.permissionService.permissions$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {

                this.updateView();

            });
    }

    private updateView(): void {

        const allowed = this.isAllowed();

        if (allowed) {

            this.createView();

        } else {

            this.removeView();

        }
    }

    private isAllowed(): boolean {

        if (!this.requiredPermissions) {
            return false;
        }

        // Single permission
        if (typeof this.requiredPermissions === 'string') {

            return this.permissionService.hasPermission(
                this.requiredPermissions
            );
        }

        // Empty array
        if (this.requiredPermissions.length === 0) {
            return false;
        }

        /*
         * Multiple permissions:
         * ANY permission is enough.
         */
        return this.permissionService.hasAnyPermission(
            this.requiredPermissions
        );
    }

    private createView(): void {

        if (this.hasView) {
            return;
        }

        this.viewContainer.createEmbeddedView(
            this.templateRef
        );

        this.hasView = true;
    }

    private removeView(): void {

        if (!this.hasView) {
            return;
        }

        this.viewContainer.clear();

        this.hasView = false;
    }

    ngOnDestroy(): void {

        this.destroy$.next();
        this.destroy$.complete();
    }
}
