import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';

interface AssetProfileMenuItem {
    label: string;
    path: string;
    icon: string;
}

@Component({
    selector: 'app-asset-profile-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <aside class="layout-sidebar asset-profile-sidebar">
            <div class="asset-profile-sidebar__brand">
                <a routerLink="/business/assets" class="app-logo">
                    <img src="demo/images/fleetpro-icon.png" alt="LeaseHive" class="asset-profile-sidebar__logo" />
                </a>
            </div>
            <div class="layout-menu-container asset-profile-sidebar__menu">
                <a class="asset-profile-sidebar__back" [routerLink]="['/business/assets']">
                    <i class="pi pi-arrow-left"></i><span>Back to Asset List</span>
                </a>
                <div class="asset-profile-sidebar__label">Asset workspace</div>
                <nav>
                    <a *ngFor="let item of items"
                        [routerLink]="profileLink(item.path)"
                        routerLinkActive="active"
                        class="asset-profile-sidebar__item">
                        <i [class]="item.icon"></i><span>{{ item.label }}</span>
                    </a>
                </nav>
            </div>
        </aside>
    `,
    styles: [`
        .asset-profile-sidebar { display: flex; flex-direction: column; }
        .asset-profile-sidebar__brand { padding: .85rem 1rem .65rem; border-bottom: 1px solid var(--surface-border); }
        .asset-profile-sidebar__logo { width: 7.25rem; height: 2.25rem; object-fit: contain; }
        .asset-profile-sidebar__menu { padding: .75rem; overflow-y: auto; }
        .asset-profile-sidebar__back, .asset-profile-sidebar__item { display: flex; align-items: center; gap: .7rem; border-radius: .5rem; color: var(--text-color); text-decoration: none; font-size: .86rem; }
        .asset-profile-sidebar__back { padding: .72rem; margin-bottom: 1rem; background: var(--surface-100); font-weight: 600; }
        .asset-profile-sidebar__item { padding: .64rem .72rem; margin: .1rem 0; }
        .asset-profile-sidebar__item:hover, .asset-profile-sidebar__item.active { background: color-mix(in srgb, var(--primary-color) 12%, transparent); color: var(--primary-color); }
        .asset-profile-sidebar__item i { width: 1rem; text-align: center; }
        .asset-profile-sidebar__label { color: var(--text-color-secondary); font-size: .69rem; font-weight: 700; letter-spacing: .08em; padding: 0 .72rem .45rem; text-transform: uppercase; }
    `]
})
export class AssetProfileSidebar implements OnInit, OnDestroy {
    assetId: number | null = null;
    private navigationSubscription?: Subscription;
    readonly items: AssetProfileMenuItem[] = [
        { label: 'Overview', path: 'overview', icon: 'pi pi-home' },
        { label: 'Details', path: 'details', icon: 'pi pi-info-circle' },
        { label: 'Acquisition & Purchase', path: 'acquisition', icon: 'pi pi-shopping-cart' },
        { label: 'Contracts', path: 'contracts', icon: 'pi pi-file-edit' },
        { label: 'Billing & Finance', path: 'finance', icon: 'pi pi-wallet' },
        { label: 'Customer & Assigned Users', path: 'users', icon: 'pi pi-users' },
        { label: 'Deliveries', path: 'deliveries', icon: 'pi pi-truck' },
        { label: 'Insurance', path: 'insurance', icon: 'pi pi-shield' },
        { label: 'Maintenance', path: 'maintenance', icon: 'pi pi-wrench' },
        { label: 'Location & Movements', path: 'locations', icon: 'pi pi-map-marker' },
        { label: 'Documents', path: 'documents', icon: 'pi pi-folder-open' },
        { label: 'Funding & Depreciation', path: 'funding', icon: 'pi pi-chart-line' },
        { label: 'Usage & Telemetry', path: 'usage', icon: 'pi pi-chart-bar' },
        { label: 'Relationships', path: 'relationships', icon: 'pi pi-share-alt' },
        { label: 'Activity History', path: 'activity', icon: 'pi pi-history' }
    ];

    constructor(private readonly router: Router) {}

    ngOnInit(): void {
        this.readAssetId();
        this.navigationSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.readAssetId());
    }

    ngOnDestroy(): void {
        this.navigationSubscription?.unsubscribe();
    }

    profileLink(path: string): any[] { return ['/business/assets/profile', this.assetId, path]; }

    private readAssetId(): void {
        const match = this.router.url.match(/^\/business\/assets\/profile\/(\d+)/);
        this.assetId = match ? Number(match[1]) : null;
    }
}
