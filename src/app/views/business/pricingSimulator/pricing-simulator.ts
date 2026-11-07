import {
  ILeasePricingChargeInput,
  ILeasePricingInput,
  ILeasePricingResult,
  ILeasePricingServiceInput
} from '@/views/crm/quote/quotation-workspace';

/**
 * Transient API contract for the pricing simulator. It intentionally excludes
 * QuoteId and QuoteAssetId so the server can calculate without a draft quote.
 */
export interface IPricingSimulatorInput extends Omit<ILeasePricingInput, 'QuoteId' | 'QuoteAssetId'> {
  LeaseTypeCode?: string;
  EffectiveDate?: string;
}

export type PricingSimulationResult = ILeasePricingResult;
export type PricingSimulationServiceInput = ILeasePricingServiceInput;
export type PricingSimulationChargeInput = ILeasePricingChargeInput;
