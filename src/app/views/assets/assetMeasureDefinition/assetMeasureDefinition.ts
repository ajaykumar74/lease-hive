import { IBase } from "@/shared/IBase";

export interface IAssetMeasureDefinition extends IBase {
	Id :number;
AssetMeasureDefinitionId :string;
TenantId :number;
AssetCategoryId :number;
AssetTypeId :number;
MeasureCode :string;
MeasureName :string;
UnitOfMeasureId :string;
IsCumulative : boolean;
IsRequired : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}