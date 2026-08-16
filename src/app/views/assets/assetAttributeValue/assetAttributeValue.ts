import { IBase } from "@/shared/IBase";

export interface IAssetAttributeValue extends IBase {
	Id :number;
AssetAttributeValueId :string;
TenantId :number;
AssetId :number;
AssetAttributeDefinitionId :number;
StringValue :string;
NumberValue :number;
DateValue :Date;
BooleanValue : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}