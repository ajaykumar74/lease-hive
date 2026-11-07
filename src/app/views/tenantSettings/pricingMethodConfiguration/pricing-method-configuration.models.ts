export interface PricingMethodOption {
    Code: string;
    Name: string;
}

export interface TenantPricingMethodAssetCategory {
    Id: number;
    Name: string;
    Code: string;
}

export interface TenantPricingMethodCategoryOverride {
    AssetCategoryId: number;
    EnabledMethodCodes: string[];
}

export interface TenantPricingSimulatorDefaults {
    AnnualFundingRate: number;
    TargetAnnualIrr: number;
    EstimatedResidualValuePercent: number;
    TermMonths: number;
    BillingFrequency: string;
    PaymentTimingCode: string;
    MonetaryRoundingDecimalPlaces: number;
}

export interface TenantPricingSimulatorLimits {
    MinimumAnnualFundingRate: number;
    MaximumAnnualFundingRate: number;
    MinimumTargetAnnualIrr: number;
    MaximumTargetAnnualIrr: number;
    MinimumResidualValuePercent: number;
    MaximumResidualValuePercent: number;
    MinimumTermMonths: number;
    MaximumTermMonths: number;
    MinimumMonetaryRoundingDecimalPlaces: number;
    MaximumMonetaryRoundingDecimalPlaces: number;
}

export interface TenantPricingMethodConfiguration {
    SupportedMethods: PricingMethodOption[];
    AssetCategories: TenantPricingMethodAssetCategory[];
    DefaultPricingMethodCode: string;
    EnabledMethodCodes: string[];
    CategoryOverrides: TenantPricingMethodCategoryOverride[];
    Defaults: TenantPricingSimulatorDefaults;
    Limits: TenantPricingSimulatorLimits;
    RowVersionStr: string;
    CanUpdate: boolean;
}

export interface UpdateTenantPricingMethodConfiguration {
    DefaultPricingMethodCode: string;
    EnabledMethodCodes: string[];
    CategoryOverrides: TenantPricingMethodCategoryOverride[];
    Defaults: TenantPricingSimulatorDefaults;
    Limits: TenantPricingSimulatorLimits;
    RowVersionStr: string;
}
