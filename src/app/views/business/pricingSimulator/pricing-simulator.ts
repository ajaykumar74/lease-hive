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
  IsTaxExempt?: boolean;
  TaxComponents?: PricingSimulationTaxComponent[];
}

export interface PricingSimulationTaxComponent {
  TaxCode: string;
  TaxRate: number;
  TaxJurisdictionId?: number;
  AppliesToRental: boolean;
  AppliesToServices: boolean;
  AppliesToCharges: boolean;
}

export interface PricingSimulationTaxBreakdown {
  TaxCode: string;
  TaxRate: number;
  TaxJurisdictionId: number;
  TaxableAmount: number;
  TaxAmount: number;
}

export interface PricingSimulationScheduleLine extends ILeasePricingScheduleLine {
  TaxExclusiveCustomerPaymentAmount: number;
  TaxAmount: number;
  TaxInclusiveCustomerPaymentAmount: number;
  TaxBreakdown: PricingSimulationTaxBreakdown[];
}

export interface PricingSimulationResult extends ILeasePricingResult {
  TaxExclusivePayableAmount: number;
  TotalTaxAmount: number;
  TaxInclusivePayableAmount: number;
  TotalCashOutflowIncludingTaxAndRefundableDeposit: number;
  TaxBreakdown: PricingSimulationTaxBreakdown[];
  Schedule: PricingSimulationScheduleLine[];
}

export type PricingSimulationServiceInput = ILeasePricingServiceInput;
export type PricingSimulationChargeInput = ILeasePricingChargeInput;
