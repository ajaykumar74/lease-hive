import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MarketplaceQuoteRequest, CustomerMarketplaceService } from './customer-marketplace.service';
import { workspaceStyles } from './customer-portal-contracts.component';

@Component({
    selector: 'app-customer-marketplace-request-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    styles: [workspaceStyles, `
        .request-detail { max-width: 900px; padding-top: 2rem; padding-bottom: 3rem; }
        .back-link { display: inline-flex; gap: .45rem; align-items: center; margin-bottom: 1.25rem; color: #156e8b; font-size: .88rem; font-weight: 700; text-decoration: none; }
        .detail-card { border: 1px solid #d9e5eb; border-radius: 1rem; background: var(--surface-card); box-shadow: 0 8px 24px rgb(26 75 97 / 5%); overflow: hidden; }
        .detail-card__header { display: flex; justify-content: space-between; gap: 1rem; padding: 1.35rem 1.5rem; border-bottom: 1px solid #e7eef2; }
        .detail-card__header h1 { margin: 0; color: #14384e; font-size: 1.5rem; }
        .detail-card__header p { margin: .35rem 0 0; color: #617683; }
        .detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.1rem; padding: 1.5rem; }
        .detail-grid div { display: grid; gap: .3rem; }.detail-grid dt { color: #71818a; font-size: .78rem; }.detail-grid dd { margin: 0; color: #234659; font-weight: 700; }
        .detail-grid .full { grid-column: 1 / -1; }.error { margin-top: 1rem; }
        @media (max-width: 640px) { .request-detail { padding-top: 1rem; }.detail-card__header { display: block; }.detail-grid { grid-template-columns: 1fr; }.detail-grid .full { grid-column: auto; } }
    `],
    template: `
        <section class="portal-workspace request-detail">
            <a class="back-link" routerLink="/customer-portal/quote-requests"><i class="pi pi-arrow-left"></i> My quote requests</a>
            <p class="state" *ngIf="loading">Loading request details…</p>
            <p class="error" *ngIf="error">{{ error }}</p>
            <article class="detail-card" *ngIf="request">
                <header class="detail-card__header"><div><p class="eyebrow">Quote request</p><h1>{{ request.RequestNumber }}</h1><p>Submitted {{ request.SubmittedAt | date:'mediumDate' }}</p></div><span class="status">{{ request.Status }}</span></header>
                <dl class="detail-grid">
                    <div><dt>Asset</dt><dd>{{ request.AssetName }}</dd></div><div><dt>Quantity</dt><dd>{{ request.Quantity }}</dd></div>
                    <div><dt>Requested for</dt><dd>{{ request.RequestedFor }}</dd></div><div><dt>Estimated monthly payment</dt><dd>{{ request.CurrencyCode }} {{ request.SubmittedMonthlyRental | number:'1.0-0' }} / month</dd></div>
                    <div *ngIf="request.QuoteNumber"><dt>Quotation</dt><dd>{{ request.QuoteNumber }}</dd></div>
                    <div class="full" *ngIf="request.Remarks"><dt>Remarks</dt><dd>{{ request.Remarks }}</dd></div>
                </dl>
            </article>
        </section>
    `
})
export class CustomerMarketplaceRequestDetailComponent implements OnInit {
    request?: MarketplaceQuoteRequest;
    loading = true;
    error = '';

    constructor(private readonly route: ActivatedRoute, private readonly marketplace: CustomerMarketplaceService) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isInteger(id) || id <= 0) { this.error = 'The quote request could not be found.'; this.loading = false; return; }
        this.marketplace.request(id).subscribe({
            next: request => { this.request = request; this.loading = false; },
            error: () => { this.error = 'The quote request could not be loaded.'; this.loading = false; }
        });
    }
}
