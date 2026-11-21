import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AssetService } from './asset.service';
import { IAsset } from './asset';
import { IPermission } from '@/shared/IPermission';
import { AssetProfileContextService } from './asset-profile-context.service';

@Component({
    templateUrl: './asset-profile.component.html',
    styleUrls: ['./asset-profile.component.scss'],
    standalone: false
})
export class AssetProfileComponent implements OnInit, OnDestroy {
    asset?: IAsset;
    permission = {} as IPermission;
    loading = true;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly assetService: AssetService,
        private readonly context: AssetProfileContextService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const assetId = Number(params.get('id'));
            if (!Number.isInteger(assetId) || assetId <= 0) {
                this.router.navigate(['/business/assets']);
                return;
            }
            this.load(assetId);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    backToAssets(): void { this.router.navigate(['/business/assets']); }

    edit(): void {
        if (this.asset?.Id) this.router.navigate(['/business/assets/edit', this.asset.Id], { state: { asset: this.asset } });
    }

    statusClass(status?: string): string {
        const value = (status || '').toLowerCase();
        if (value.includes('active') || value.includes('available') || value.includes('service')) return 'asset-profile__status--success';
        if (value.includes('inactive') || value.includes('retired') || value.includes('disposed') || value.includes('expired')) return 'asset-profile__status--danger';
        return 'asset-profile__status--warning';
    }

    private load(assetId: number): void {
        this.loading = true;
        this.assetService.getById(assetId).subscribe({
            next: response => {
                this.asset = response.data;
                this.permission = response.permission || {} as IPermission;
                this.context.set({ assetId, asset: this.asset, permission: this.permission });
            },
            error: () => this.router.navigate(['/business/assets']),
            complete: () => this.loading = false
        });
    }
}
