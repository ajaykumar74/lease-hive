import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerMarketplaceService, MarketplaceQuoteRequest } from './customer-marketplace.service';
import { workspaceStyles } from './customer-portal-contracts.component';
import { CustomerPortalSupportParty, CustomerPortalWorkspaceService } from './customer-portal-workspace.service';

@Component({
    selector: 'app-customer-marketplace-requests',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    styles: [workspaceStyles, `
        .quote-requests { max-width: 1200px; padding-top: 2rem; padding-bottom: 3rem; }
        .request-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 2rem; margin-bottom: 1.5rem; }
        .request-header .eyebrow { margin: 0 0 .45rem; }
        .request-header h1 { margin: 0; color: #14384e; font-size: clamp(1.65rem, 3vw, 2.15rem); line-height: 1.2; }
        .request-header p:not(.eyebrow) { margin: .55rem 0 0; color: #617683; font-size: .96rem; }
        .explore-link { display: inline-flex; align-items: center; gap: .5rem; flex: 0 0 auto; margin-top: .25rem; padding: .67rem .9rem; border: 1px solid #b8d7e3; border-radius: .55rem; color: #156e8b; font-size: .88rem; font-weight: 700; text-decoration: none; }
        .explore-link:hover { border-color: #6daec3; background: #f0fafc; }
        .request-flow { display: grid; grid-template-columns: minmax(280px, .8fr) minmax(0, 1.2fr); gap: 1.5rem; align-items: start; }
        .asset-summary, .request-form { overflow: hidden; border: 1px solid #d9e5eb; border-radius: 1rem; background: var(--surface-card); box-shadow: 0 8px 24px rgb(26 75 97 / 5%); }
        .asset-summary__banner { padding: 1.45rem 1.5rem; background: linear-gradient(135deg, #eef9fc, #f8fcfd); border-bottom: 1px solid #dcecf1; }
        .asset-summary__banner .pi { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; margin-bottom: .9rem; border-radius: .65rem; background: #d8f0f7; color: #1c7999; font-size: 1rem; }
        .asset-summary__banner p { margin: 0 0 .4rem; color: #22728d; font-size: .73rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
        .asset-summary__banner h2 { margin: 0; color: #173c52; font-size: 1.15rem; line-height: 1.3; }
        .asset-summary__body { padding: 1.2rem 1.5rem 1.45rem; }
        .asset-summary__body > p { margin: 0 0 1rem; color: #687d89; font-size: .86rem; }
        .terms-list { display: grid; gap: .8rem; margin: 0; }
        .terms-list div { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: .75rem; border-bottom: 1px solid #edf2f4; }
        .terms-list div:last-child { padding-bottom: 0; border-bottom: 0; }
        .terms-list dt { color: #71818a; font-size: .78rem; }
        .terms-list dd { margin: 0; color: #234659; font-size: .82rem; font-weight: 700; text-align: right; }
        .request-form__heading { padding: 1.35rem 1.5rem 1.1rem; border-bottom: 1px solid #e7eef2; }
        .request-form__heading h2 { margin: 0; color: #173c52; font-size: 1.12rem; }
        .request-form__heading p { margin: .35rem 0 0; color: #6c7f8a; font-size: .87rem; }
        .request-form__body { padding: 1.35rem 1.5rem 1.5rem; }
        .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
        .field { display: flex; min-width: 0; flex-direction: column; gap: .42rem; }
        .field--full { grid-column: 1 / -1; }
        .field label { color: #304f60; font-size: .83rem; font-weight: 700; }
        .field .p-inputtext { width: 100%; min-height: 2.8rem; border-color: #c7d7df; border-radius: .55rem; color: #173d53; font-family: inherit; }
        textarea.p-inputtext { min-height: 6.7rem !important; padding-top: .72rem; resize: vertical; }
        .field .p-inputtext:focus { border-color: #2b91b4; box-shadow: 0 0 0 3px rgb(43 145 180 / 12%); }
        .customer-account { display: flex; align-items: center; gap: .65rem; min-height: 2.8rem; padding: 0 .85rem; border: 1px solid #c7dfe8; border-radius: .55rem; background: #f2fafc; color: #245268; font-size: .9rem; font-weight: 600; }
        .customer-account .pi { color: #207e9f; }.customer-account--loading { color: #72818b; font-weight: 500; }
        .submission-note { display: flex; gap: .65rem; margin: 1.3rem 0 1rem; padding: .85rem .95rem; border-radius: .65rem; background: #f2fafc; color: #54707e; font-size: .8rem; line-height: 1.45; }
        .submission-note .pi { margin-top: .15rem; color: #2585a5; }
        .submit-action { display: inline-flex; align-items: center; justify-content: center; gap: .55rem; width: 100%; min-height: 3rem; border: 0; border-radius: .6rem; background: #157d9e; color: #fff; font: inherit; font-size: .94rem; font-weight: 700; cursor: pointer; transition: background .15s ease, transform .15s ease; }
        .submit-action:hover:not(:disabled) { background: #0e6683; transform: translateY(-1px); }
        .submit-action:disabled { cursor: not-allowed; opacity: .56; }
        .requests-card { overflow: hidden; border: 1px solid #d9e5eb; border-radius: 1rem; background: var(--surface-card); box-shadow: 0 8px 24px rgb(26 75 97 / 5%); }
        .requests-card table { width: 100%; border-collapse: collapse; }
        .requests-card th, .requests-card td { padding: 1rem 1.15rem; }
        .requests-card th { background: #f7fafb; }
        .request-details-link { color: #156e8b; font-size: .84rem; font-weight: 700; text-decoration: none; white-space: nowrap; }
        .request-details-link:hover { text-decoration: underline; }
        @media (max-width: 850px) { .request-flow { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .quote-requests { padding-top: 1rem; } .request-header { display: block; } .explore-link { margin-top: 1rem; } .form-grid { grid-template-columns: 1fr; } .field--full { grid-column: auto; } .request-form__heading, .request-form__body, .asset-summary__banner, .asset-summary__body { padding-left: 1.15rem; padding-right: 1.15rem; } }
    `],
    template: `
        <section class="portal-workspace quote-requests">
            <header class="request-header">
                <div>
                    <p class="eyebrow">Customer portal</p>
                    <h1>{{ isNew ? 'Request a quotation' : 'My quote requests' }}</h1>
                    <p>{{ isNew ? 'Review your selected lease terms and send a tailored quotation request.' : 'Track submitted requirements while our sales team prepares a quotation.' }}</p>
                </div>
                <a class="explore-link" routerLink="/customer-portal/assets/explore"><i class="pi pi-search"></i> Explore assets</a>
            </header>

            <form *ngIf="isNew" class="request-flow" [formGroup]="form" (ngSubmit)="submit()">
                <aside class="asset-summary">
                    <div class="asset-summary__banner"><i class="pi pi-car"></i><p>Selected lease option</p><h2>{{ selectedOffer?.CatalogueName || 'Selected asset' }}</h2></div>
                    <div class="asset-summary__body">
                        <p>{{ selectedOffer?.AssetMakeName }} {{ selectedOffer?.AssetModelName }}<ng-container *ngIf="selectedOffer?.VariantName"> · {{ selectedOffer.VariantName }}</ng-container></p>
                        <dl class="terms-list">
                            <div><dt>Lease type</dt><dd>{{ configuration?.LeaseTypeCode || 'To be confirmed' }}</dd></div>
                            <div><dt>Lease tenure</dt><dd>{{ configuration?.TenureMonths || '—' }} months</dd></div>
                            <div><dt>Quantity</dt><dd>{{ configuration?.Quantity || 1 }} asset{{ configuration?.Quantity === 1 ? '' : 's' }}</dd></div>
                            <div><dt>Payment timing</dt><dd>{{ configuration?.PaymentTimingCode || 'ARREARS' }}</dd></div>
                        </dl>
                    </div>
                </aside>

                <section class="request-form">
                    <div class="request-form__heading"><h2>Request details</h2><p>Tell us who this lease is for and anything our team should consider.</p></div>
                    <div class="request-form__body">
                        <div class="form-grid">
                            <div class="field field--full"><label>Customer account</label><div class="customer-account" *ngIf="selectedParty; else loadingParty"><i class="pi pi-building"></i><span>{{ selectedParty.Name }}</span></div><ng-template #loadingParty><div class="customer-account customer-account--loading"><i class="pi pi-spin pi-spinner"></i><span>{{ partiesLoading ? 'Loading your customer account…' : 'Customer account unavailable' }}</span></div></ng-template></div>
                            <div class="field"><label for="requested-for">Requested for</label><select id="requested-for" class="p-inputtext" formControlName="RequestedFor"><option value="MYSELF">Myself</option><option value="EXISTING_ASSET_USER">Existing asset user</option><option value="NEW_INTENDED_USER">New intended user</option><option value="COMPANY_POOL">Company pool / unassigned</option></select></div>
                            <div class="field field--full" *ngIf="form.value.RequestedFor === 'EXISTING_ASSET_USER'"><label for="asset-user-id">Existing asset user ID</label><input id="asset-user-id" class="p-inputtext" type="number" min="1" formControlName="ExistingAssetUserId" placeholder="Enter the existing asset user ID"></div>
                            <div class="field field--full" *ngIf="form.value.RequestedFor === 'NEW_INTENDED_USER'"><label for="intended-user-name">Intended user name</label><input id="intended-user-name" class="p-inputtext" formControlName="NewIntendedUserName" placeholder="Enter the intended user's name"></div>
                            <div class="field field--full"><label for="remarks">Remarks for our leasing team <small>(optional)</small></label><textarea id="remarks" class="p-inputtext" formControlName="Remarks" placeholder="Add delivery, usage, or other requirements that will help us prepare your quotation."></textarea></div>
                        </div>
                        <div class="submission-note"><i class="pi pi-info-circle"></i><span>Your request is not a contract. We will review the selected terms and send a final quotation for your approval.</span></div>
                        <button class="submit-action" type="submit" [disabled]="form.invalid || saving"><i class="pi pi-send"></i> {{ saving ? 'Submitting request…' : 'Submit quote request' }}</button>
                    </div>
                </section>
            </form>

            <p class="error" *ngIf="error">{{ error }}</p>
            <div class="requests-card" *ngIf="!isNew">
                <table *ngIf="requests.length; else empty"><thead><tr><th>Request</th><th>Asset</th><th>Requested for</th><th>Estimate</th><th>Status</th><th>Submitted</th><th></th></tr></thead><tbody><tr *ngFor="let request of requests"><td><strong>{{ request.RequestNumber }}</strong></td><td>{{ request.AssetName }}<br><small>Qty {{ request.Quantity }}</small></td><td>{{ request.RequestedFor }}</td><td>{{ request.CurrencyCode }} {{ request.SubmittedMonthlyRental | number:'1.0-0' }} / month</td><td><span class="status">{{ request.Status }}</span></td><td>{{ request.SubmittedAt | date:'mediumDate' }}</td><td><a class="request-details-link" [routerLink]="['/customer-portal/quote-requests', request.Id]">View details</a></td></tr></tbody></table>
                <ng-template #empty><p class="state">You have not submitted a quote request yet.</p></ng-template>
            </div>
        </section>
    `
})
export class CustomerMarketplaceRequestsComponent implements OnInit {
    requests: MarketplaceQuoteRequest[] = [];
    isNew = false;
    saving = false;
    error = '';
    configuration: any;
    selectedOffer: any;
    selectedParty?: CustomerPortalSupportParty;
    partiesLoading = false;
    readonly form = new FormBuilder().group({
        PartyId: new FormControl<number | null>(null, Validators.required),
        RequestedFor: ['MYSELF'],
        ExistingAssetUserId: [null],
        NewIntendedUserName: [''],
        Remarks: ['']
    });

    constructor(
        private readonly marketplace: CustomerMarketplaceService,
        private readonly workspace: CustomerPortalWorkspaceService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.configuration = history.state?.configuration;
        this.selectedOffer = history.state?.offer;
        this.isNew = this.router.url.startsWith('/customer-portal/quote-requests/new');
        if (!this.isNew) this.load();
        if (this.isNew && !this.configuration) this.error = 'Choose an offering before submitting a request.';
        if (this.isNew) this.loadAvailableParties();
    }

    loadAvailableParties(): void {
        this.partiesLoading = true;
        this.workspace.supportParties().subscribe({
            next: parties => {
                const availableParties = parties || [];
                if (availableParties.length === 1) {
                    this.selectedParty = availableParties[0];
                    this.form.controls.PartyId.setValue(this.selectedParty.Id);
                    return;
                }

                this.form.controls.PartyId.reset();
                this.error = availableParties.length
                    ? 'Your portal account has multiple customer parties. A current-party selector is required before a quotation can be requested.'
                    : 'No customer account is available for this portal user.';
            },
            error: () => { this.error = 'Your available customer accounts could not be loaded.'; this.partiesLoading = false; },
            complete: () => this.partiesLoading = false
        });
    }

    load(): void {
        this.marketplace.requests({ Skip: 0, Take: 50, SortBy: 'SubmittedAt', IsDescending: true }).subscribe({
            next: page => this.requests = page.Records || [],
            error: () => this.error = 'Quote requests could not be loaded.'
        });
    }

    submit(): void {
        if (!this.configuration || this.form.invalid) return;
        this.saving = true;
        const value = this.form.value;
        this.marketplace.submit({
            IdempotencyKey: crypto.randomUUID(),
            PartyId: value.PartyId,
            Configuration: this.configuration,
            Remarks: value.Remarks,
            IntendedUsers: [{
                RequestedFor: value.RequestedFor,
                ExistingAssetUserId: value.ExistingAssetUserId,
                NewIntendedUserName: value.NewIntendedUserName,
                Quantity: this.configuration.Quantity
            }]
        }).subscribe({
            next: () => this.router.navigate(['/customer-portal/quote-requests']),
            error: () => { this.error = 'The quote request could not be submitted.'; this.saving = false; }
        });
    }
}
