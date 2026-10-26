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
LeaseTypeCode?: string;
MaximumFundingRate?: number | null;
MaximumContractValue?: number | null;
MaximumDiscountAmount?: number | null;
ApprovalThresholdAmount?: number | null;
ExceptionThresholdAmount?: number | null;
RequireCommercialApproval?: boolean;
BlockPolicyViolations?: boolean;
CurrencyCode :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}
