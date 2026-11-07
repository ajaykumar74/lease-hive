import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import {
    PricingMethodOption,
    TenantPricingMethodCategoryOverride,
    TenantPricingMethodConfiguration,
    TenantPricingSimulatorDefaults,
    TenantPricingSimulatorLimits
} from './pricing-method-configuration.models';
import { PricingMethodConfigurationService } from './pricing-method-configuration.service';

interface PricingMethodGuide {
    code: string;
    name: string;
    comparison: string;
    purpose: string;
    calculation: string;
    example: string;
    inputs: string;
    adjustments: string;
    guidance: string;
}

@Component({
    selector: 'app-pricing-method-configuration',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AccordionModule,
        ButtonModule,
        DialogModule,
        InputNumberModule,
        MultiSelectModule,
        SelectModule,
        ToastModule,
        ToggleSwitchModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './pricing-method-configuration.component.html',
    styleUrl: './pricing-method-configuration.component.scss'
})
export class PricingMethodConfigurationComponent implements OnInit {
    configuration: TenantPricingMethodConfiguration | null = null;
    defaultMethodCode = 'CALCULATED';
    enabledMethodCodes: string[] = [];
    categoryOverrides: TenantPricingMethodCategoryOverride[] = [];
    pricingDefaults: TenantPricingSimulatorDefaults = this.defaultPricingDefaults();
    pricingLimits: TenantPricingSimulatorLimits = this.defaultPricingLimits();
    selectedCategoryId: number | null = null;
    loading = true;
    saving = false;
    error = '';
    guideVisible = false;
    readonly billingFrequencyOptions = [
        { Name: 'Monthly', Code: 'MONTHLY' },
        { Name: 'Quarterly', Code: 'QUARTERLY' },
        { Name: 'Annually', Code: 'ANNUALLY' }
    ];
    readonly paymentTimingOptions = [
        { Name: 'Arrears', Code: 'ARREARS' },
        { Name: 'Advance', Code: 'ADVANCE' }
    ];

    readonly pricingMethodGuides: PricingMethodGuide[] = [
        {
            code: 'CALCULATED',
            name: 'Calculated rental',
            comparison: 'Funding-rate annuity',
            purpose: 'The standard amortising lease option when a periodic rental should be calculated from the funding rate.',
            calculation: 'Rental = (net financed amount − present value of balloon − present value of residual) ÷ annuity factor. Net financed amount = total asset cost − non-refundable down payment; monthly rate = annual funding rate ÷ 1,200.',
            example: 'For £12,000 of assets, a £2,000 down payment and a 12-month term, the engine amortises £10,000 after discounting any balloon and residual at the selected funding rate.',
            inputs: 'Asset cost per unit, quantity, term, annual funding rate, payment timing, down payment, residual percentage or amount, and balloon payment.',
            adjustments: 'Separately chargeable services and recurring charges are added to customer payments outside the base rental. A refundable deposit is reported separately. Legacy excess usage is an end-of-term projected charge when expected usage exceeds allowance.',
            guidance: 'Useful for vehicles, equipment and IT assets where a reducing-balance funding rate and a recoverable residual value are commercially meaningful.'
        },
        {
            code: 'MANUAL',
            name: 'Manual rental',
            comparison: 'Entered rental',
            purpose: 'Use an already agreed or externally calculated periodic rental without the simulator deriving a funding rate.',
            calculation: 'Periodic base rental = the entered manual periodic rental. The engine does not calculate a funding-rate finance charge or principal amortisation for this mode.',
            example: 'Entering £850 creates a £850 base rental for every lease period, before separately chargeable services, recurring charges and final balloon or excess-usage amounts.',
            inputs: 'Manual periodic rental, asset cost and quantity for reference, term, payment timing, residual, balloon, deposit, services, charges and projected excess usage.',
            adjustments: 'Services and charges are scheduled separately; the refundable deposit remains outside contractual consideration. The final period can include a balloon and legacy excess-usage projection. Payment timing does not alter the entered manual rental.',
            guidance: 'Appropriate for property, bespoke equipment or vendor programmes where the commercial rental is negotiated rather than modelled in LeaseHive.'
        },
        {
            code: 'RATE_FACTOR',
            name: 'Rate factor',
            comparison: 'Asset cost × factor',
            purpose: 'Price a lease from a factor that is agreed per payment period, commonly used in rate-card pricing.',
            calculation: 'Periodic base rental = total asset cost × rate factor. Total asset cost = asset cost per unit × quantity. The total rental must recover financed amount after residual and balloon.',
            example: '£30,000 total asset cost × 0.02 rate factor = £600 base rental per period. With a 12-month term, the model checks that £7,200 can recover the applicable principal.',
            inputs: 'Asset cost per unit, quantity, rate factor, term, down payment, residual, balloon, payment timing, services, charges, deposit and projected excess usage.',
            adjustments: 'The factor is applied once to the total asset cost—quantity is not applied again. The schedule shows implied finance charges after allocating recoverable principal; services and charges remain separate. Payment timing does not change the factor formula.',
            guidance: 'Well suited to vehicle or standard equipment rate cards where commercial teams publish a monthly factor instead of an annual funding rate.'
        },
        {
            code: 'FLAT_RATE',
            name: 'Flat rate',
            comparison: 'Principal + simple interest',
            purpose: 'Quote simple, non-compounding interest distributed evenly over the term.',
            calculation: 'Flat interest = net financed amount × annual flat rate × term ÷ 12. Periodic rental = (net financed amount − residual − balloon + flat interest) ÷ term.',
            example: '£10,000 financed for 12 months at 10% gives £1,000 flat interest and a £916.67 monthly base rental when there is no residual or balloon.',
            inputs: 'Asset cost and quantity, annual flat rate, term, down payment, residual, balloon, payment timing, services, charges, deposit and projected excess usage.',
            adjustments: 'Principal and flat interest are allocated evenly in the schedule. Residual is an expected recovery, while a balloon remains a final customer payment. Services and charges are added outside base rental; payment timing does not change the flat-interest formula.',
            guidance: 'Suitable for straightforward IT and equipment leases where a simple-interest commercial quote is preferred over a reducing-balance funding calculation.'
        },
        {
            code: 'STEPPED_RENTAL',
            name: 'Stepped rental',
            comparison: 'Entered period bands',
            purpose: 'Model deliberate step-up or step-down rentals over the lease term.',
            calculation: 'The entered rental amount applies to every period in its From Period–To Period range. All ranges must cover the full term exactly once, with no gaps or overlaps.',
            example: 'Periods 1–6 at £900 and periods 7–12 at £1,100 produce £12,000 of base rentals. The engine allocates implied finance charge proportionally across those rentals.',
            inputs: 'Term and a complete rental-step table, plus asset cost, quantity, down payment, residual, balloon, services, charges, deposit and projected excess usage.',
            adjustments: 'Total stepped rentals must recover financed amount after residual and balloon. Services and charges are separate; a balloon and legacy excess usage are added in the last period. Payment timing does not alter the entered step amounts.',
            guidance: 'Useful for property, seasonal equipment and corporate fleets where payments are expected to rise or fall with utilisation, budget cycles or contract phases.'
        },
        {
            code: 'USAGE_BASED',
            name: 'Usage-based rental',
            comparison: 'Excess projected usage × rate',
            purpose: 'Project a variable rental from expected use rather than financing cost.',
            calculation: 'Projected periodic rental = max(expected usage per period − included usage per period, 0) × rate per unit.',
            example: '1,500 expected km − 1,000 included km = 500 km; at £0.20 per km, the projected base rental is £100 per period.',
            inputs: 'Usage unit (KM, HOURS, COPIES or UNITS), expected usage per period, included usage per period, rate per unit, term, services, charges, balloon, residual and deposit.',
            adjustments: 'Usage is an estimate, so the schedule has no finance charge or principal recovery. Legacy expected-usage, allowance and excess-rate inputs are intentionally not added again. Services and charges remain separate, and payment timing does not change the usage projection.',
            guidance: 'Best for vehicles, printers, production equipment and metered IT where value tracks kilometres, hours, copies or units consumed.'
        },
        {
            code: 'HYBRID',
            name: 'Hybrid rental',
            comparison: 'Fixed base + usage charge',
            purpose: 'Combine a predictable fixed payment with a projected usage charge.',
            calculation: 'Projected periodic rental = fixed base rental + max(expected usage per period − included usage per period, 0) × rate per unit.',
            example: '£400 fixed rental plus (1,500 km − 1,000 km) × £0.20 gives a projected £500 periodic base rental.',
            inputs: 'Fixed base rental and the same usage inputs as Usage-based pricing, plus term, services, charges, balloon, residual and deposit.',
            adjustments: 'The variable element is already included in the displayed base rental. No separate legacy excess-usage projection or finance charge is calculated. Services and charges remain outside base rental, and payment timing does not change the projection.',
            guidance: 'Recommended for fleets, managed print and usage-sensitive equipment where a minimum commitment is required alongside variable consumption.'
        },
        {
            code: 'TARGET_IRR',
            name: 'Target IRR / yield',
            comparison: 'Rental solved to annual effective IRR',
            purpose: 'Solve the periodic rental required to achieve a target annual effective investment yield for the lessor.',
            calculation: 'A numerical solver finds the rental that makes lessor cash-flow NPV equal zero at the target annual effective IRR. Advance first payment occurs at month 0; arrears first payment occurs at month 1.',
            example: 'For a £12,000 asset over 12 months at a 12% target annual IRR, the solver finds the rental whose scheduled lessor cash flows achieve approximately 12% annual effective yield.',
            inputs: 'Target annual IRR, asset cost and quantity, term, payment timing, down payment, residual, balloon, services and charges, including optional explicit lessor costs.',
            adjustments: 'Asset cost is the initial lessor investment. Down payment, separately chargeable service/charge revenue, rental, balloon, residual recovery and projected excess usage are cash-flow revenue; explicit lessor costs reduce it. Refundable deposits and tax are excluded from yield cash flows.',
            guidance: 'Most useful for high-value vehicles, specialist equipment and investment-led property deals where the required lessor yield is the starting commercial constraint.'
        }
    ];

    constructor(
        private readonly configurationService: PricingMethodConfigurationService,
        private readonly messages: MessageService
    ) {}

    ngOnInit(): void {
        this.load();
    }

    get supportedMethods(): PricingMethodOption[] {
        return this.configuration?.SupportedMethods ?? [];
    }

    get enabledMethods(): PricingMethodOption[] {
        return this.supportedMethods.filter(method => this.enabledMethodCodes.includes(method.Code));
    }

    get categoryOptions() {
        return (this.configuration?.AssetCategories ?? [])
            .filter(category => !this.categoryOverrides.some(overrideItem => overrideItem.AssetCategoryId === category.Id));
    }

    get canUpdate(): boolean {
        return this.configuration?.CanUpdate === true;
    }

    isEnabled(methodCode: string): boolean {
        return this.enabledMethodCodes.includes(methodCode);
    }

    toggleMethod(methodCode: string, enabled: boolean): void {
        if (!this.canUpdate) return;
        if (enabled) {
            this.enabledMethodCodes = this.supportedMethods
                .filter(method => this.enabledMethodCodes.includes(method.Code) || method.Code === methodCode)
                .map(method => method.Code);
            return;
        }

        if (this.enabledMethodCodes.length === 1) {
            this.messages.add({ severity: 'warn', summary: 'One method is required', detail: 'Keep at least one simulator pricing method enabled.' });
            return;
        }
        this.enabledMethodCodes = this.enabledMethodCodes.filter(code => code !== methodCode);
        if (this.defaultMethodCode === methodCode) {
            this.defaultMethodCode = this.enabledMethodCodes[0] ?? 'CALCULATED';
        }
    }

    addCategoryOverride(): void {
        const assetCategoryId = Number(this.selectedCategoryId) || 0;
        if (!assetCategoryId || this.categoryOverrides.some(overrideItem => overrideItem.AssetCategoryId === assetCategoryId)) return;
        this.categoryOverrides = [
            ...this.categoryOverrides,
            { AssetCategoryId: assetCategoryId, EnabledMethodCodes: [...this.enabledMethodCodes] }
        ];
        this.selectedCategoryId = null;
    }

    removeCategoryOverride(assetCategoryId: number): void {
        if (!this.canUpdate) return;
        this.categoryOverrides = this.categoryOverrides.filter(overrideItem => overrideItem.AssetCategoryId !== assetCategoryId);
    }

    categoryName(assetCategoryId: number): string {
        const category = this.configuration?.AssetCategories.find(candidate => candidate.Id === assetCategoryId);
        return category?.Name || `Asset category #${assetCategoryId}`;
    }

    save(): void {
        if (!this.canUpdate || this.saving || !this.configuration) return;
        if (!this.enabledMethodCodes.length) {
            this.error = 'Enable at least one pricing method.';
            return;
        }
        if (!this.enabledMethodCodes.includes(this.defaultMethodCode)) {
            this.error = 'The default method must be enabled for the tenant.';
            return;
        }
        if (this.categoryOverrides.some(overrideItem => !overrideItem.EnabledMethodCodes.length)) {
            this.error = 'Each category override must enable at least one method.';
            return;
        }

        this.saving = true;
        this.error = '';
        this.configurationService.update({
            DefaultPricingMethodCode: this.defaultMethodCode,
            EnabledMethodCodes: [...this.enabledMethodCodes],
            CategoryOverrides: this.categoryOverrides.map(overrideItem => ({
                AssetCategoryId: overrideItem.AssetCategoryId,
                EnabledMethodCodes: [...overrideItem.EnabledMethodCodes]
            })),
            Defaults: { ...this.pricingDefaults },
            Limits: { ...this.pricingLimits },
            RowVersionStr: this.configuration.RowVersionStr
        }).subscribe({
            next: configuration => {
                this.applyConfiguration(configuration);
                this.messages.add({ severity: 'success', summary: 'Lease pricing saved', detail: 'Simulator method availability has been updated.' });
            },
            error: error => {
                this.error = this.errorMessage(error, 'Lease pricing settings could not be saved.');
                this.messages.add({ severity: 'error', summary: 'Settings not saved', detail: this.error });
            },
            complete: () => this.saving = false
        });
    }

    reset(): void {
        if (!this.configuration || this.saving) return;
        this.applyConfiguration(this.configuration);
        this.error = '';
    }

    private load(): void {
        this.loading = true;
        this.configurationService.get().subscribe({
            next: configuration => this.applyConfiguration(configuration),
            error: error => this.error = this.errorMessage(error, 'Lease pricing settings could not be loaded.'),
            complete: () => this.loading = false
        });
    }

    private applyConfiguration(configuration: TenantPricingMethodConfiguration): void {
        this.configuration = configuration;
        this.defaultMethodCode = configuration.DefaultPricingMethodCode;
        this.enabledMethodCodes = [...configuration.EnabledMethodCodes];
        this.categoryOverrides = configuration.CategoryOverrides.map(overrideItem => ({
            AssetCategoryId: overrideItem.AssetCategoryId,
            EnabledMethodCodes: [...overrideItem.EnabledMethodCodes]
        }));
        this.pricingDefaults = { ...configuration.Defaults };
        this.pricingLimits = { ...configuration.Limits };
    }

    private defaultPricingDefaults(): TenantPricingSimulatorDefaults {
        return {
            AnnualFundingRate: 0,
            TargetAnnualIrr: 0,
            EstimatedResidualValuePercent: 0,
            TermMonths: 36,
            BillingFrequency: 'MONTHLY',
            PaymentTimingCode: 'ARREARS',
            MonetaryRoundingDecimalPlaces: 4
        };
    }

    private defaultPricingLimits(): TenantPricingSimulatorLimits {
        return {
            MinimumAnnualFundingRate: 0,
            MaximumAnnualFundingRate: 1000,
            MinimumTargetAnnualIrr: 0,
            MaximumTargetAnnualIrr: 1000,
            MinimumResidualValuePercent: 0,
            MaximumResidualValuePercent: 100,
            MinimumTermMonths: 1,
            MaximumTermMonths: 600,
            MinimumMonetaryRoundingDecimalPlaces: 0,
            MaximumMonetaryRoundingDecimalPlaces: 4
        };
    }

    private errorMessage(error: unknown, fallback: string): string {
        if (typeof error === 'string') return error;
        if (typeof error === 'object' && error !== null) {
            const candidate = error as { message?: string; Message?: string; error?: { message?: string; Message?: string } };
            return candidate.message ?? candidate.Message ?? candidate.error?.message ?? candidate.error?.Message ?? fallback;
        }
        return fallback;
    }
}
