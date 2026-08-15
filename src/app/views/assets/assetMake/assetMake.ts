import { IBase } from "@/shared/IBase";

export interface IAssetMake extends IBase {
	Id :number;
AssetMakeId :string;
TenantId :number;
ManufacturerPartyId :number;
MakeCode :string;
MakeName :string;
AssetCategoryId :number;
CountryCode :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}