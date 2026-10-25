import { IBase } from "@/shared/IBase";

export interface ILeasePricingPolicy extends IBase {
	Id :number;
LeasePricingPolicyId :string;
TenantId :number;
AssetCategoryId :number;
PolicyCode :string;
PolicyName :string;
DefaultPricingModeCode :string;
DefaultFundingRate :number;
MinimumFundingRate :number;
MaximumTermMonths :number;
MinimumDownPaymentPct :number;
MaximumResidualPct :number;
CurrencyCode :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}