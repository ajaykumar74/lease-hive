import { IBase } from "@/shared/IBase";

export interface IAssetCategory extends IBase {
	Id :number;
AssetCategoryId :string;
TenantId :string;
CategoryCode :string;
CategoryName :string;
ParentCategoryId :number;
SupportsRegistration : boolean;
SupportsMeasure : boolean;
ExtensionTypeCode :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}