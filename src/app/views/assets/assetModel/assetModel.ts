import { IBase } from "@/shared/IBase";

export interface IAssetModel extends IBase {
	Id :number;
AssetModelId :string;
TenantId :number;
AssetMakeId :number;
AssetTypeId :number;
ModelCode :string;
ModelName :string;
VariantName :string;
ModelYearFrom :number;
ModelYearTo :number;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}