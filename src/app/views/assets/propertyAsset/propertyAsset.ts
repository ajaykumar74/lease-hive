import { IBase } from "@/shared/IBase";

export interface IPropertyAsset extends IBase {
	Id :number;
TenantId :number;
AssetId :number;
AssetDisplayName?: string;
PropertyType :string;
SurveyNo :string;
BuiltUpArea :number;
AreaUOMId :number;
AreaUomDisplayName?: string;
FloorNo :string;
PossessionDate :Date;
TitleReference :string;
EffectiveFrom :Date;
EffectiveTo :Date | null;
RecordStatus :string;

}
