import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { PermissionService } from '@/shared/security/permission.service';
import { AssetCatalogueService } from './assetCatalogue.service';

@Component({ templateUrl: './assetCatalogue-editor.component.html', standalone: false })
export class AssetCatalogueEditorComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly fb = inject(FormBuilder);
    id = 0; readonly = false; loading = false; error = ''; item: any;
    categories: ISelectItem[] = []; types: ISelectItem[] = []; makes: ISelectItem[] = []; models: ISelectItem[] = [];
    form = this.fb.group({
        CatalogueCode: ['', [Validators.required, Validators.maxLength(30)]], CatalogueName: ['', [Validators.required, Validators.maxLength(150)]],
        AssetCategoryId: [0, [Validators.required, Validators.min(1)]], AssetTypeId: [0, [Validators.required, Validators.min(1)]], AssetMakeId: [0, [Validators.required, Validators.min(1)]], AssetModelId: [0, [Validators.required, Validators.min(1)]],
        VariantName: ['', Validators.maxLength(100)], Description: [''], IndicativeAcquisitionPrice: [null as number | null], CurrencyCode: ['INR', [Validators.required, Validators.pattern(/^[A-Za-z]{3}$/)]],
        FulfilmentMode: ['ON_REQUEST', Validators.required], LeadTimeDays: [null as number | null], EffectiveFrom: [new Date(), Validators.required], EffectiveTo: [null as Date | null],
        PricesJson: ['[{"PriceTypeCode":"LEASE_PRICE","PriceAmount":0,"CurrencyCode":"INR","EffectiveFrom":"2026-01-01T00:00:00Z","RecordStatus":"Active"}]'],
        LeaseTypesJson: ['[]'], LeaseOptionsJson: ['[]'], SpecificationsJson: ['[]'], InventoryAssetIds: ['']
    });
    constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly location: Location, private readonly catalogue: AssetCatalogueService, private readonly lookups: LoggedInUserService, private readonly permissions: PermissionService) { }
    get canSave(): boolean { return !this.readonly && (this.id ? this.permissions.hasPermission('asset.assetcatalogueitem.update') : this.permissions.hasPermission('asset.assetcatalogueitem.create')); }
    ngOnInit(): void {
        this.id = Number(this.route.snapshot.params['id'] || 0); this.readonly = this.route.snapshot.routeConfig?.path?.startsWith('view') || false;
        this.lookups.bindEntityLookup(this.form, 'AssetCategoryId', 'asset-categories', options => this.categories = options, () => undefined, this.destroyRef);
        this.lookups.bindEntityLookup(this.form, 'AssetTypeId', 'asset-types', options => this.types = options, () => undefined, this.destroyRef, { AssetCategoryId: 'AssetCategoryId' });
        this.lookups.bindEntityLookup(this.form, 'AssetMakeId', 'asset-makes', options => this.makes = options, () => undefined, this.destroyRef, { AssetCategoryId: 'AssetCategoryId' });
        this.lookups.bindEntityLookup(this.form, 'AssetModelId', 'asset-models', options => this.models = options, () => undefined, this.destroyRef, { AssetTypeId: 'AssetTypeId', AssetMakeId: 'AssetMakeId' });
        if (this.id) this.load();
    }
    load(): void { this.loading = true; this.catalogue.get(this.id).subscribe({ next: (response: any) => { this.item = response.data; this.form.patchValue({ ...this.item, PricesJson: JSON.stringify(this.item.Prices || [], null, 2), LeaseTypesJson: JSON.stringify(this.item.EligibleLeaseTypes || [], null, 2), LeaseOptionsJson: JSON.stringify(this.item.LeaseOptions || [], null, 2), SpecificationsJson: JSON.stringify(this.item.Specifications || [], null, 2), InventoryAssetIds: (this.item.EligibleInventoryAssetIds || []).join(', ') }); }, error: err => this.error = err, complete: () => this.loading = false }); }
    save(): void {
        this.error = ''; if (this.form.invalid) { this.form.markAllAsTouched(); this.error = 'Complete the required offering details.'; return; }
        try {
            const raw = this.form.getRawValue(); const payload = { ...this.item, ...raw, CurrencyCode: raw.CurrencyCode!.toUpperCase(), Prices: this.json(raw.PricesJson), EligibleLeaseTypes: this.json(raw.LeaseTypesJson), LeaseOptions: this.json(raw.LeaseOptionsJson), Specifications: this.json(raw.SpecificationsJson), EligibleInventoryAssetIds: (raw.InventoryAssetIds || '').split(',').map(value => Number(value.trim())).filter(value => value > 0) };
            const request = this.id ? this.catalogue.update(this.id, payload) : this.catalogue.create(payload);
            request.subscribe({ next: () => this.router.navigate(['/business/assets/catalogue']), error: err => this.error = err });
        } catch { this.error = 'The pricing, lease type, option, or specification JSON is invalid.'; }
    }
    private json(value: string | null): any[] { const parsed = JSON.parse(value || '[]'); if (!Array.isArray(parsed)) throw new Error(); return parsed; }
    back(): void { this.location.back(); }
}
