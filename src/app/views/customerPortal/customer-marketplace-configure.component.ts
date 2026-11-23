import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, filter, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerMarketplaceService, MarketplaceOfferDetail } from './customer-marketplace.service';
import { workspaceStyles } from './customer-portal-contracts.component';

@Component({
    selector: 'app-customer-marketplace-configure',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    styles: [workspaceStyles, `
        .asset-configure { max-width: 1240px; padding-top: 2rem; padding-bottom: 3rem; }
        .back-link { display: inline-flex; align-items: center; gap: .45rem; margin-bottom: 1.5rem; color: #16708d; font-size: .9rem; font-weight: 700; text-decoration: none; }
        .back-link:hover { color: #0c5269; text-decoration: underline; }
        .asset-hero { display: flex; justify-content: space-between; gap: 2rem; align-items: flex-end; padding: 1.85rem 2rem; margin-bottom: 1.5rem; border: 1px solid #d9e5ed; border-radius: 1rem; background: linear-gradient(115deg, #f8fcff 0%, #eef7fb 100%); }
        .asset-hero .eyebrow { margin: 0 0 .55rem; }
        .asset-hero h1 { margin: 0; color: #13354d; font-size: clamp(1.65rem, 3vw, 2.15rem); line-height: 1.2; }
        .asset-subtitle { margin: .55rem 0 0; color: #5e7281; font-size: 1rem; }
        .fulfilment-chip { display: inline-flex; align-items: center; gap: .4rem; flex: 0 0 auto; padding: .55rem .85rem; border-radius: 999px; background: #fff; box-shadow: 0 2px 8px rgb(25 79 105 / 8%); color: #245c73; font-size: .8rem; font-weight: 700; white-space: nowrap; }
        .configuration-layout { display: grid; grid-template-columns: minmax(0, .95fr) minmax(420px, 1.15fr); gap: 1.5rem; align-items: start; }
        .details-card, .configuration-card { overflow: hidden; border: 1px solid #dbe5eb; border-radius: 1rem; background: var(--surface-card); box-shadow: 0 8px 24px rgb(26 75 97 / 5%); }
        .card-heading { padding: 1.35rem 1.5rem 1.1rem; border-bottom: 1px solid #e8eff3; }
        .card-heading h2 { margin: 0; color: #18384d; font-size: 1.08rem; }
        .card-heading p { margin: .3rem 0 0; color: #71818c; font-size: .88rem; }
        .specifications { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0; }
        .specification { min-height: 5.6rem; padding: 1.05rem 1.5rem; border-bottom: 1px solid #edf2f5; }
        .specification:nth-child(odd) { border-right: 1px solid #edf2f5; }
        .specification:nth-last-child(-n+2) { border-bottom: 0; }
        .specification dt { margin-bottom: .35rem; color: #72808a; font-size: .76rem; font-weight: 700; letter-spacing: .03em; text-transform: uppercase; }
        .specification dd { margin: 0; color: #193e55; font-size: .98rem; font-weight: 600; word-break: break-word; }
        .no-specifications { margin: 0; padding: 1.5rem; color: #71818c; }
        .configuration-card { padding-bottom: 1.35rem; }
        .configuration-card .card-heading { margin-bottom: 1.25rem; }
        .form-section { padding: 0 1.5rem; }
        .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
        .field { display: flex; min-width: 0; flex-direction: column; gap: .42rem; }
        .field label { color: #304d5f; font-size: .84rem; font-weight: 700; }
        .field .p-inputtext { width: 100%; min-height: 2.85rem; border-color: #c7d6df; border-radius: .55rem; color: #173b52; font-family: inherit; }
        .field .p-inputtext:focus { border-color: #2a91b5; box-shadow: 0 0 0 3px rgb(42 145 181 / 12%); }
        .options-section { margin-top: 1.4rem; padding-top: 1.15rem; border-top: 1px solid #e8eff3; }
        .options-heading { margin: 0 0 .8rem; color: #304d5f; font-size: .84rem; font-weight: 700; }
        .option-list { display: grid; gap: .65rem; }
        .option-row { display: flex; align-items: center; gap: .7rem; padding: .75rem .8rem; border: 1px solid #e1ebf0; border-radius: .65rem; background: #fbfdfe; color: #345163; cursor: pointer; font-size: .9rem; }
        .option-row:has(input:checked) { border-color: #8bc5d8; background: #f0fbfe; }
        .option-row input { width: 1rem; height: 1rem; margin: 0; accent-color: #177d9e; }
        .required-tag { margin-left: auto; color: #287188; font-size: .72rem; font-weight: 700; }
        .quote-summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin: 1.35rem 1.5rem 0; padding: 1rem 1.1rem; border: 1px solid #cae6ef; border-radius: .75rem; background: #f1fafd; }
        .quote-summary__label { margin: 0 0 .2rem; color: #527080; font-size: .77rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
        .quote-summary__price { color: #123e56; font-size: 1.23rem; font-weight: 700; }
        .quote-summary__tax { margin: .24rem 0 0; color: #69808d; font-size: .78rem; }
        .quote-summary .pi { color: #2484a4; font-size: 1.25rem; }
        .pricing-pending { margin: 1.35rem 1.5rem 0; padding: .9rem 1rem; border-radius: .7rem; background: #f6f9fa; color: #71818c; font-size: .88rem; }
        .form-error { margin: 1.15rem 1.5rem 0; }
        .quote-action { display: inline-flex; align-items: center; justify-content: center; gap: .55rem; width: calc(100% - 3rem); min-height: 3rem; margin: 1.15rem 1.5rem 0; border: 0; border-radius: .6rem; background: #147b9d; color: #fff; font: inherit; font-size: .95rem; font-weight: 700; cursor: pointer; transition: background .15s ease, transform .15s ease; }
        .quote-action:hover:not(:disabled) { background: #0f6683; transform: translateY(-1px); }
        .quote-action:disabled { cursor: not-allowed; opacity: .55; }
        @media (max-width: 900px) { .configuration-layout { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .asset-configure { padding-top: 1rem; } .asset-hero { display: block; padding: 1.35rem; } .fulfilment-chip { margin-top: 1rem; } .form-grid, .specifications { grid-template-columns: 1fr; } .specification, .specification:nth-child(odd) { border-right: 0; border-bottom: 1px solid #edf2f5; } .specification:last-child { border-bottom: 0; } .card-heading, .form-section { padding-left: 1.15rem; padding-right: 1.15rem; } .quote-summary, .pricing-pending, .form-error { margin-left: 1.15rem; margin-right: 1.15rem; } .quote-action { width: calc(100% - 2.3rem); margin-left: 1.15rem; margin-right: 1.15rem; } }
    `],
    template: `
        <section class="portal-workspace asset-configure" *ngIf="offer">
            <a class="back-link" routerLink="/customer-portal/assets/explore"><i class="pi pi-arrow-left"></i> Back to explore</a>
            <header class="asset-hero">
                <div>
                    <p class="eyebrow">{{ offer.AssetCategoryName }} · {{ offer.AssetMakeName }}</p>
                    <h1>{{ offer.CatalogueName }}</h1>
                    <p class="asset-subtitle">{{ offer.AssetModelName }}<ng-container *ngIf="offer.VariantName"> · {{ offer.VariantName }}</ng-container></p>
                </div>
                <span class="fulfilment-chip"><i class="pi pi-check-circle"></i> {{ offer.FulfilmentMode }}</span>
            </header>
            <p class="error" *ngIf="error">{{ error }}</p>
            <div class="configuration-layout">
                <article class="details-card">
                    <div class="card-heading"><h2>Asset specifications</h2><p>Key details for this selected asset.</p></div>
                    <dl class="specifications" *ngIf="offer.Specifications?.length; else noSpecifications">
                        <div class="specification" *ngFor="let spec of offer.Specifications"><dt>{{ spec.Name }}</dt><dd>{{ spec.Value }}</dd></div>
                    </dl>
                    <ng-template #noSpecifications><p class="no-specifications">No additional specifications are available for this asset.</p></ng-template>
                </article>
                <form class="configuration-card" [formGroup]="form" (ngSubmit)="submit()">
                    <div class="card-heading"><h2>Configure your lease</h2><p>Adjust the terms to receive an indicative monthly rental.</p></div>
                    <div class="form-section">
                        <div class="form-grid">
                            <div class="field"><label for="lease-type">Lease type</label><select id="lease-type" class="p-inputtext" formControlName="LeaseTypeCode"><option *ngFor="let type of offer.LeaseTypes" [value]="type.LeaseTypeCode">{{ type.LeaseTypeCode }}</option></select></div>
                            <div class="field"><label for="tenure">Tenure (months)</label><input id="tenure" class="p-inputtext" type="number" min="1" formControlName="TenureMonths"></div>
                            <div class="field"><label for="quantity">Quantity</label><input id="quantity" class="p-inputtext" type="number" min="1" formControlName="Quantity"></div>
                            <div class="field"><label for="upfront-contribution">Upfront contribution</label><input id="upfront-contribution" class="p-inputtext" type="number" min="0" formControlName="UpfrontContribution"></div>
                            <div class="field"><label for="payment-timing">Payment timing</label><select id="payment-timing" class="p-inputtext" formControlName="PaymentTimingCode"><option value="ARREARS">Arrears</option><option value="ADVANCE">Advance</option></select></div>
                        </div>
                        <div class="options-section" *ngIf="offer.Options?.length">
                            <p class="options-heading">Included options</p>
                            <div class="option-list">
                                <label class="option-row" *ngFor="let option of offer.Options"><input type="checkbox" [checked]="option.IsRequired || selected(option.OptionCode)" [disabled]="option.IsRequired" (change)="toggle(option.OptionCode, $any($event.target).checked)"><span>{{ option.OptionName }}</span><span *ngIf="option.IsRequired" class="required-tag">Included</span></label>
                            </div>
                        </div>
                    </div>
                    <div class="quote-summary" *ngIf="calculation"><div><p class="quote-summary__label">Estimated monthly rental</p><div class="quote-summary__price">{{ calculation.Offer.CurrencyCode }} {{ calculation.Pricing?.PeriodicCustomerPayment | number:'1.0-0' }} <small>/ month</small></div><p class="quote-summary__tax">{{ calculation.TaxBasis }}; final tax is confirmed in the quotation.</p></div><i class="pi pi-wallet"></i></div>
                    <p class="pricing-pending" *ngIf="!calculation && !unavailable">Calculating your indicative rental…</p>
                    <p class="error form-error" *ngIf="unavailable">{{ unavailable }}</p>
                    <button class="quote-action" type="submit" [disabled]="form.invalid || !calculation?.CanRequestQuote"><i class="pi pi-file-edit"></i> Request quotation</button>
                </form>
            </div>
        </section>
        <p *ngIf="!offer && !error" class="state">Loading offering…</p>
    `
})
export class CustomerMarketplaceConfigureComponent implements OnInit {
    private readonly destroy = inject(DestroyRef);
    private readonly fb = inject(FormBuilder);
    offer?: MarketplaceOfferDetail;
    calculation: any;
    error = '';
    unavailable = '';
    readonly form = this.fb.group({
        LeaseTypeCode: ['', Validators.required],
        TenureMonths: [36, [Validators.required, Validators.min(1)]],
        Quantity: [1, [Validators.required, Validators.min(1)]],
        ExpectedUsage: [0],
        UpfrontContribution: [0],
        PaymentTimingCode: ['ARREARS'],
        BillingFrequency: ['MONTHLY'],
        SelectedOptionCodes: [[] as string[]]
    });

    constructor(private readonly route: ActivatedRoute, private readonly marketplace: CustomerMarketplaceService, private readonly router: Router) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.marketplace.offer(id).pipe(takeUntilDestroyed(this.destroy)).subscribe({
            next: offer => {
                this.offer = offer;
                const type = offer.LeaseTypes[0];
                this.form.patchValue({
                    LeaseTypeCode: type?.LeaseTypeCode || '',
                    TenureMonths: type?.MinTenureMonths || 36,
                    SelectedOptionCodes: offer.Options.filter(x => x.IsRequired).map(x => x.OptionCode)
                });
                this.watch();
            },
            error: () => this.error = 'This offering is unavailable.'
        });
    }

    watch(): void {
        this.form.valueChanges.pipe(
            startWith(this.form.getRawValue()),
            debounceTime(350),
            filter(() => this.form.valid),
            switchMap(value => this.marketplace.configure({ CatalogueItemId: this.offer!.CatalogueItemId, ...value as any })),
            takeUntilDestroyed(this.destroy)
        ).subscribe({
            next: value => { this.calculation = value; this.unavailable = value.UnavailableReason || ''; },
            error: () => { this.calculation = null; this.unavailable = 'Pricing is unavailable for this configuration.'; }
        });
    }

    selected(code: string): boolean { return (this.form.value.SelectedOptionCodes || []).includes(code); }

    toggle(code: string, checked: boolean): void {
        const selected = new Set(this.form.value.SelectedOptionCodes || []);
        checked ? selected.add(code) : selected.delete(code);
        this.form.patchValue({ SelectedOptionCodes: [...selected] });
    }

    submit(): void {
        if (!this.offer || !this.calculation?.CanRequestQuote) return;
        this.router.navigate(['/customer-portal/quote-requests/new'], { state: { offer: this.offer, configuration: { CatalogueItemId: this.offer.CatalogueItemId, ...this.form.value } } });
    }
}
