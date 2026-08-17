import { IBase } from "@/shared/IBase";

export interface ILeaseRequirementAsset extends IBase {
	Id :number;
LeaseRequirementAssetId :number;
TenantId :number;
LeaseRequirementId :number;
LineNo :number;
AssetCategoryId :number;
AssetTypeId :number;
AssetMakeId :number;
AssetModelId :number;
Quantity :number;
NewUsedCode :string;
EstimatedUnitCost :number;
CurrencyCode :string;
ExpectedAnnualUsage :number;
UsageUOMId :number;
ServicePackageCode :string;
SpecificationsJson :string;
Remarks :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}