import { IBase } from "@/shared/IBase";

export interface IPartyLocation extends IBase {
	Id :number;
TenantId :number;
PartyId :number;
LocationId :number;
PartyGSTRegistrationId :number;
LocationCode :string;
LocationName :string;
LocationType :string;
AddressLine1 :string;
AddressLine2 :string;
City :string;
StateCode :string;
PostalCode :string;
IsRegisteredOffice : boolean;
IsBillTo : boolean;
IsShipTo : boolean;
IsDefaultBillTo : boolean;
IsDefaultShipTo : boolean;
WorkingHours :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}