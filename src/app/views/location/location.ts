import { IBase } from "@/shared/IBase";

export interface ILocation extends IBase {
	Id :number;
TenantId :number;
LocationCode :string;
LocationName :string;
LocationType :string;
AddressLine1 :string;
AddressLine2 :string;
Landmark :string;
City :string;
StateProvinceCode :string;
PostalCode :string;
CountryCode :string;
GeoLocation :string;
Email :string;
ContactPhone :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}