import { IBase } from "@/shared/IBase";

export interface ILeaseContractAsset extends IBase {
	Id :number;
LeaseContractAssetId :string;
TenantId :number;
LeaseContractId :number;
AssetId :number;
AssetCategoryId :number;
AssetTypeId :number;
SourceQuoteLineId :number;
SourcePurchaseOrderLineId :number;
Quantity :number;
UOMId :number;
AllocationStatusCode :string;
EffectiveFrom :Date;
EffectiveTo :Date;
AssetValueSnapshot :number;
SerialSnapshot :string;

}