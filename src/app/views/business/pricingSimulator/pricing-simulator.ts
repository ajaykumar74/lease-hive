import {
  ILeasePricingChargeInput,
  ILeasePricingInput,
  ILeasePricingResult,
  ILeasePricingScheduleLine,
  ILeasePricingServiceInput
} from '@/views/crm/quote/quotation-workspace';

/**
 * Transient API contract for the pricing simulator. It intentionally excludes
 * QuoteId and QuoteAssetId so the server can calculate without a draft quote.
 */
export interface IPricingSimulatorInput extends Omit<ILeasePricingInput, 'QuoteId' | 'QuoteAssetId'> {
  LeaseTypeCode?: string;
  EffectiveDate?: string;
  RateFactorPerPeriod?: number;
  AnnualFlatRate?: number;
  RentalSteps?: PricingSimulationRentalStep[];
  UsageUnit?: string;
  ExpectedUsagePerPeriod?: number;
  IncludedUsagePerPeriod?: number;
  UsageRatePerUnit?: number;
  FixedBaseRentalAmount?: number;
  TargetAnnualIrr?: number;
  IsTaxExempt?: boolean;
  TaxCountryCode?: string;
  TaxJurisdictionCode?: string;
  TaxOverrideReason?: string;
  TaxComponents?: PricingSimulationTaxComponent[];
}

export interface PricingSimulationTaxComponent {
  TaxRuleId?: number;
  TaxCode: string;
  TaxName?: string;
  TaxTreatmentCode?: string;
  TaxJurisdictionCode?: string;
  TaxRate: number;
  TaxJurisdictionId?: number;
  AppliesToRental: boolean;
  AppliesToServices: boolean;
  AppliesToCharges: boolean;
}

export interface PricingSimulatorMethodOption {
  Code: string;
  Name: string;
}

export interface PricingSimulatorMethodOptions {
  DefaultPricingMethodCode: string;
  Methods: PricingSimulatorMethodOption[];
  Defaults: PricingSimulatorDefaults;
  Limits: PricingSimulatorLimits;
}

export interface PricingSimulatorDefaults {
  AnnualFundingRate: number;
  TargetAnnualIrr: number;
  EstimatedResidualValuePercent: number;
  TermMonths: number;
  BillingFrequency: string;
  PaymentTimingCode: string;
  MonetaryRoundingDecimalPlaces: number;
}

export interface PricingSimulatorLimits {
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

export interface PricingSimulationRentalStep {
  FromPeriod: number;
  ToPeriod: number;
  RentalAmount: number;
}

export interface PricingSimulationTaxBreakdown {
  TaxRuleId?: number;
  TaxCode: string;
  TaxName?: string;
  TaxTreatmentCode?: string;
  TaxJurisdictionCode?: string;
  TaxRate: number;
  TaxJurisdictionId: number;
  TaxableAmount: number;
  TaxAmount: number;
}

export interface PricingSimulationTaxDetermination {
  Status: 'DETERMINED' | 'EXEMPT' | 'ZERO_RATED' | 'OVERRIDDEN' | 'REQUIRED' | string;
  Reason?: string;
  CountryCode?: string;
  JurisdictionCode?: string;
  TaxTreatmentCode?: string;
  IsOverrideApplied: boolean;
}

export interface PricingSimulationScheduleLine extends ILeasePricingScheduleLine {
  /** Included in BaseRentalAmount; shown separately to explain a usage projection. */
  UsageChargeAmount: number;
  CashFlowMonth: number;
  LessorInvestmentAmount: number;
  LessorRevenueAmount: number;
  LessorCostAmount: number;
  LessorNetCashFlowAmount: number;
  TaxExclusiveCustomerPaymentAmount: number;
  TaxAmount: number;
  TaxInclusiveCustomerPaymentAmount: number;
  TaxBreakdown: PricingSimulationTaxBreakdown[];
}

export interface PricingSimulationResult extends ILeasePricingResult {
  /** Already included in PeriodicBaseRental and TotalBaseRentalPayments. */
  PeriodicUsageChargeAmount: number;
  TotalUsageChargePayments: number;
  TargetAnnualIrr: number;
  AchievedAnnualIrr: number;
  TotalLessorRevenueAmount: number;
  TotalLessorCostAmount: number;
  TotalNetLessorCashFlowAmount: number;
  TaxExclusivePayableAmount: number;
  TotalTaxAmount: number;
  TaxInclusivePayableAmount: number;
  TotalCashOutflowIncludingTaxAndRefundableDeposit: number;
  TaxBreakdown: PricingSimulationTaxBreakdown[];
  TaxDetermination: PricingSimulationTaxDetermination;
  Schedule: PricingSimulationScheduleLine[];
}

export interface PricingSimulationServiceInput extends ILeasePricingServiceInput {
  LessorCostAmount?: number;
}

export interface PricingSimulationChargeInput extends ILeasePricingChargeInput {
  LessorCostAmount?: number;
}
