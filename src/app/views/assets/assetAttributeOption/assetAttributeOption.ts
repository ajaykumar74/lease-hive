import { IBase } from "@/shared/IBase";

export interface IAssetAttributeOption extends IBase {
	Id :number;
AssetAttributeOptionId :string;
TenantId :number;
AssetAttributeDefinitionId :number;
OptionCode :string;
OptionLabel :string;
SortOrder :number;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}