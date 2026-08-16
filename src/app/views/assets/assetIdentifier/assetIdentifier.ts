import { IBase } from "@/shared/IBase";

export interface IAssetIdentifier extends IBase {
	Id :number;
AssetIdentifierId :string;
TenantId :number;
AssetId :number;
IdentifierTypeCode :string;
IdentifierValue :string;
IssuingCountryCode :string;
IssuingStateCode :string;
IsPrimary : boolean;
IsVerified : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}