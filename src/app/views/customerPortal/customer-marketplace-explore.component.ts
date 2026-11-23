import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerMarketplaceService, MarketplaceOffer } from './customer-marketplace.service';
import { workspaceStyles } from './customer-portal-contracts.component';

@Component({
    selector: 'app-customer-marketplace-explore',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    styles: [workspaceStyles, `
        .asset-explorer { max-width: 1240px; padding-top: 2rem; padding-bottom: 3rem; }
        .explorer-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 2rem; margin-bottom: 1.5rem; }
        .explorer-header .eyebrow { margin: 0 0 .45rem; }
        .explorer-header h1 { margin: 0; color: #13354d; font-size: clamp(1.7rem, 3vw, 2.2rem); line-height: 1.2; }
        .explorer-header p:not(.eyebrow) { margin: .55rem 0 0; color: #647784; font-size: .96rem; }
        .requests-link { display: inline-flex; align-items: center; gap: .5rem; flex: 0 0 auto; margin-top: .35rem; padding: .65rem .9rem; border: 1px solid #b9d8e4; border-radius: .55rem; color: #166f8d; font-size: .88rem; font-weight: 700; text-decoration: none; }
        .requests-link:hover { border-color: #6eafc4; background: #f1fafd; }
        .search-panel { margin-bottom: 1.75rem; padding: 1.25rem 1.4rem 1.35rem; border: 1px solid #d9e6eb; border-radius: 1rem; background: linear-gradient(115deg, #fbfdfe, #f3fafc); box-shadow: 0 7px 20px rgb(26 75 97 / 4%); }
        .search-heading { display: flex; align-items: center; gap: .65rem; margin-bottom: 1rem; color: #1d4258; font-size: .94rem; font-weight: 700; }
        .search-heading .pi { color: #217d9d; }
        .filter-grid { display: grid; grid-template-columns: .8fr 1fr 1fr 1fr; gap: 1rem; }
        .filter-field { display: flex; min-width: 0; flex-direction: column; gap: .38rem; }
        .filter-field label { color: #5b7180; font-size: .77rem; font-weight: 700; }
        .filter-field .p-inputtext { width: 100%; min-height: 2.75rem; border-color: #c8d8e1; border-radius: .55rem; color: #163c53; font-family: inherit; }
        .filter-field .p-inputtext:focus { border-color: #298bad; box-shadow: 0 0 0 3px rgb(41 139 173 / 12%); }
        .results-bar { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
        .results-bar h2 { margin: 0; color: #25475a; font-size: 1.05rem; }
        .results-bar p { margin: 0; color: #75858e; font-size: .84rem; }
        .offer-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; }
        .offer-card { display: flex; min-width: 0; flex-direction: column; overflow: hidden; border: 1px solid #dce7ec; border-radius: 1rem; background: var(--surface-card); box-shadow: 0 8px 22px rgb(26 75 97 / 5%); transition: transform .18s ease, box-shadow .18s ease; }
        .offer-card:hover { transform: translateY(-3px); box-shadow: 0 13px 28px rgb(26 75 97 / 10%); }
        .offer-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: .75rem; min-height: 7.7rem; padding: 1.25rem 1.3rem 1rem; border-bottom: 1px solid #ebf0f3; }
        .offer-card .eyebrow { margin: 0 0 .55rem; color: #22728d; font-size: .7rem; }
        .offer-card h3 { margin: 0; color: #183c52; font-size: 1.1rem; line-height: 1.3; }
        .offer-model { margin: .35rem 0 0; color: #657985; font-size: .87rem; }
        .availability { display: inline-flex; align-items: center; gap: .3rem; flex: 0 0 auto; padding: .34rem .52rem; border-radius: 999px; background: #eaf8f1; color: #19704b; font-size: .68rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
        .availability--unavailable { background: #fff3e8; color: #a65318; }
        .offer-card__body { display: flex; flex: 1; flex-direction: column; padding: 1.15rem 1.3rem 1.25rem; }
        .rental-label { margin: 0 0 .25rem; color: #71818c; font-size: .73rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
        .rental-value { color: #123d55; font-size: 1.35rem; font-weight: 700; line-height: 1.25; }
        .rental-value span { color: #617580; font-size: .79rem; font-weight: 500; }
        .offer-meta { display: flex; flex-wrap: wrap; gap: .45rem .85rem; margin: .8rem 0 1.2rem; color: #607583; font-size: .8rem; }
        .offer-meta span { display: inline-flex; align-items: center; gap: .3rem; }
        .offer-meta .pi { color: #2b88a7; font-size: .75rem; }
        .configure-action { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; width: 100%; min-height: 2.7rem; margin-top: auto; border-radius: .55rem; background: #157d9e; color: #fff; font-size: .9rem; font-weight: 700; text-decoration: none; transition: background .15s ease; }
        .configure-action:hover { background: #0f6683; color: #fff; }
        .empty-state { grid-column: 1 / -1; padding: 3rem 1.5rem; border: 1px dashed #c8d9e1; border-radius: 1rem; background: #fbfdfe; text-align: center; color: #617682; }
        .empty-state .pi { display: block; margin-bottom: .65rem; color: #60a1b8; font-size: 1.7rem; }
        .empty-state h3 { margin: 0 0 .4rem; color: #284b5d; font-size: 1rem; }
        .empty-state p { margin: 0; font-size: .88rem; }
        .loading-state { display: flex; align-items: center; justify-content: center; gap: .65rem; min-height: 12rem; color: #627783; }
        @media (max-width: 1050px) { .offer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 760px) { .filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 640px) { .asset-explorer { padding-top: 1rem; } .explorer-header { display: block; } .requests-link { margin-top: 1rem; } .search-panel { padding: 1.1rem; } .filter-grid, .offer-grid { grid-template-columns: 1fr; } .results-bar { align-items: flex-start; flex-direction: column; gap: .3rem; } }
    `],
    template: `
        <section class="portal-workspace asset-explorer">
            <header class="explorer-header">
                <div>
                    <p class="eyebrow">Customer portal</p>
                    <h1>Explore lease options</h1>
                    <p>Compare indicative monthly rentals and configure the asset that best fits your needs.</p>
                </div>
                <a class="requests-link" routerLink="/customer-portal/quote-requests"><i class="pi pi-file-edit"></i> My quote requests</a>
            </header>

            <form class="search-panel" [formGroup]="filters">
                <div class="search-heading"><i class="pi pi-sliders-h"></i> Refine your options</div>
                <div class="filter-grid">
                    <div class="filter-field"><label for="tenure">Lease tenure</label><input id="tenure" class="p-inputtext" type="number" min="1" formControlName="TenureMonths" placeholder="Months"></div>
                    <div class="filter-field"><label for="minimum-rental">Minimum monthly rental</label><input id="minimum-rental" class="p-inputtext" type="number" min="0" formControlName="MonthlyRentalMinimum" placeholder="No minimum"></div>
                    <div class="filter-field"><label for="maximum-rental">Maximum monthly rental</label><input id="maximum-rental" class="p-inputtext" type="number" min="0" formControlName="MonthlyRentalMaximum" placeholder="No maximum"></div>
                    <div class="filter-field"><label for="availability">Availability</label><select id="availability" class="p-inputtext" formControlName="FulfilmentMode"><option value="">Any availability</option><option value="INVENTORY">In inventory</option><option value="ON_REQUEST">On request</option><option value="BOTH">Both</option></select></div>
                </div>
            </form>

            <div class="results-bar" *ngIf="!loading && !error">
                <h2>Available lease options</h2>
                <p *ngIf="offers.length">{{ offers.length }} option{{ offers.length === 1 ? '' : 's' }} shown · rentals exclude tax</p>
            </div>
            <div class="loading-state" *ngIf="loading"><i class="pi pi-spin pi-spinner"></i> Loading matching lease options…</div>
            <p class="error" *ngIf="error">{{ error }}</p>

            <div class="offer-grid" *ngIf="!loading && !error">
                <article class="offer-card" *ngFor="let offer of offers">
                    <div class="offer-card__top">
                        <div>
                            <p class="eyebrow">{{ offer.AssetCategoryName }} · {{ offer.AssetMakeName }}</p>
                            <h3>{{ offer.CatalogueName }}</h3>
                            <p class="offer-model">{{ offer.AssetModelName }}<ng-container *ngIf="offer.VariantName"> · {{ offer.VariantName }}</ng-container></p>
                        </div>
                        <span class="availability" [class.availability--unavailable]="!offer.IsAvailable"><i class="pi" [class.pi-check-circle]="offer.IsAvailable" [class.pi-clock]="!offer.IsAvailable"></i> {{ offer.IsAvailable ? 'Available' : 'On request' }}</span>
                    </div>
                    <div class="offer-card__body">
                        <p class="rental-label">Indicative monthly rental</p>
                        <div class="rental-value">{{ offer.CurrencyCode }} {{ offer.IndicativeMonthlyRental | number:'1.0-0' }} <span>/ month</span></div>
                        <div class="offer-meta"><span><i class="pi pi-calendar"></i> {{ offer.TenureMonths }} months</span><span><i class="pi pi-info-circle"></i> {{ offer.TaxBasis }}</span></div>
                        <a class="configure-action" [routerLink]="['/customer-portal/assets/explore', offer.CatalogueItemId]">Configure lease <i class="pi pi-arrow-right"></i></a>
                    </div>
                </article>
                <article class="empty-state" *ngIf="!offers.length"><i class="pi pi-search"></i><h3>No matching lease options</h3><p>Try changing the tenure, rental range, or availability filter.</p></article>
            </div>
        </section>
    `
})
export class CustomerMarketplaceExploreComponent implements OnInit {
    private readonly destroy = inject(DestroyRef);
    readonly filters = inject(FormBuilder).group({
        TenureMonths: [36],
        MonthlyRentalMinimum: [null],
        MonthlyRentalMaximum: [null],
        FulfilmentMode: ['']
    });
    offers: MarketplaceOffer[] = [];
    loading = false;
    error = '';

    constructor(private readonly marketplace: CustomerMarketplaceService) {}

    ngOnInit(): void {
        this.filters.valueChanges.pipe(
            startWith(this.filters.value),
            debounceTime(250),
            switchMap(value => {
                this.loading = true;
                this.error = '';
                return this.marketplace.search({ ...value, Skip: 0, Take: 30, SortBy: 'Rental' });
            }),
            takeUntilDestroyed(this.destroy)
        ).subscribe({
            next: page => { this.offers = page?.Records || []; this.loading = false; },
            error: () => { this.error = 'Lease options could not be loaded. Please try again.'; this.loading = false; }
        });
    }
}
