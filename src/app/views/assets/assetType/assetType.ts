import { IBase } from "@/shared/IBase";

export interface IAssetType extends IBase {
	Id :number;
AssetTypeId :string;
TenantId :string;
AssetCategoryId :string;
AssetTypeCode :string;
AssetTypeName :string;
DefaultUsefulLifeMonths :number;
DefaultResidualPercent :number;
RequiresSerialNo : boolean;
RequiresRegistrationNo : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}