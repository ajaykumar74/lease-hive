import { IBase } from "@/shared/IBase";

export interface ISupplierServiceArea extends IBase {
	Id :number;
TenantId :number;
PartyId :number;
SupplierProfileId :number;
PartyLocationId :number;
CountryCode :string;
StateProvinceCode :string;
City :string;
PostalCodePattern :string;
AssetCategoryId :number;
AssetTypeId :number;
CanSupply : boolean;
CanInstall : boolean;
CanMaintain : boolean;
CanInspect : boolean;
CanRecover : boolean;
CanDispose : boolean;
StandardLeadTimeDays :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}