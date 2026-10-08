import { IBase } from "@/shared/IBase";

export interface IAssetAttributeDefinition extends IBase {
	Id :number;
AssetAttributeDefinitionId :string;
TenantId :number;
AssetCategoryId :number;
AssetTypeId :number;
AssetCategoryDisplayName?: string;
AssetTypeDisplayName?: string;
AttributeCode :string;
AttributeName :string;
DataTypeCode :string;
UnitMeasureType :string;
IsRequired : boolean;
IsSearchable : boolean;
ValidationJson :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}
