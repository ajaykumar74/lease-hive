import { IBase } from "@/shared/IBase";

export interface IQuoteAsset extends IBase {
	Id :number;
QuoteAssetId :string;
TenantId :number;
QuoteId :number;
LeaseRequirementAssetId :number;
LineNo :number;
AssetCategoryId :number;
AssetTypeId :number;
AssetMakeId :number;
AssetModelId :number;
Description :string;
Quantity :number;
UnitAssetCost :number;
ResidualValuePct :number;
ResidualValueAmount :number;
TermMonths :number;
RateFactor :number;
PeriodicRentalAmount :number;
BillingFrequency :string;
TaxCode :string;
LineSubtotal :number;

}