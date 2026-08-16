import { IBase } from "@/shared/IBase";

export interface IPropertyAsset extends IBase {
	Id :number;
TenantId :number;
AssetId :number;
PropertyType :string;
SurveyNo :string;
BuiltUpArea :number;
AreaUOMId :number;
FloorNo :string;
PossessionDate :Date;
TitleReference :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}