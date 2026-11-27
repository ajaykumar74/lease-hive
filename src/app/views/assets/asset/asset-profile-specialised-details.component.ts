import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from '@/shared/security/permission.service';
import { IAsset } from './asset';
import { AssetProfileContextService } from './asset-profile-context.service';
import { AssetService } from './asset.service';

interface SpecialisedAssetRoute {
    route: string;
    displayName: string;
    viewPermission: string;
    updatePermission: string;
}

@Component({
    templateUrl: './asset-profile-specialised-details.component.html',
    styleUrls: ['./asset-profile-specialised-details.component.scss'],
    standalone: false
})
export class AssetProfileSpecialisedDetailsComponent implements OnInit, OnDestroy {
    loading = true;
    message = '';
    private assetId = 0;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly context: AssetProfileContextService,
        private readonly permissions: PermissionService,
        private readonly assetService: AssetService
    ) {}

    ngOnInit(): void {
        this.assetId = Number(this.route.parent?.snapshot.paramMap.get('id'));
        this.context.context$.pipe(takeUntil(this.destroy$)).subscribe(profile => {
            if (profile?.assetId === this.assetId) this.openSpecialisedDetails(profile.asset);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private openSpecialisedDetails(asset: IAsset): void {
        if (!this.loading) return;

        this.assetService.profileSpecialisedDetails(asset.Id).pipe(takeUntil(this.destroy$)).subscribe({
            next: response => {
                const detail = response?.data;
                const specialised = detail && this.specialisedRoute(detail.AssetType);
                if (!specialised || !detail.SpecialisedAssetId) {
                    this.message = 'No specialised details have been recorded for this asset.';
                } else if (!this.permissions.hasPermission(specialised.viewPermission)) {
                    this.message = `You do not have permission to view ${specialised.displayName.toLowerCase()} details.`;
                } else {
                    const mode = this.permissions.hasPermission(specialised.updatePermission) ? 'edit' : 'view';
                    this.router.navigate(['/business/assets/specialised', specialised.route, mode, detail.SpecialisedAssetId]);
                    return;
                }
                this.loading = false;
            },
            error: () => {
                this.message = 'Unable to load the specialised asset details.';
                this.loading = false;
            }
        });
    }

    private specialisedRoute(assetType: string): SpecialisedAssetRoute | undefined {
        const category = (assetType || '').replace(/[^a-z]/gi, '').toLowerCase();
        const routes: Record<string, SpecialisedAssetRoute> = {
            vehicle: this.routeFor('vehicles', 'Vehicle', 'asset.vehicleasset'),
            property: this.routeFor('property', 'Property', 'asset.propertyasset'),
            it: this.routeFor('it', 'IT asset', 'asset.itasset'),
            equipment: this.routeFor('equipment', 'Equipment', 'asset.equipmentasset')
        };
        return routes[category];
    }

    private routeFor(
        route: string,
        displayName: string,
        permissionPrefix: string
    ): SpecialisedAssetRoute {
        return {
            route,
            displayName,
            viewPermission: `${permissionPrefix}.view`,
            updatePermission: `${permissionPrefix}.update`
        };
    }
}
