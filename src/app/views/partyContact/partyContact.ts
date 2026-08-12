import { IBase } from "@/shared/IBase";

export interface IPartyContact extends IBase {
	Id :number;
TenantId :number;
PartyId :number;
PartyLocationId :number;
ContactType :string;
Title :string;
FirstName :string;
LastName :string;
Designation :string;
DepartmentName :string;
Email :string;
MobileCountryCode :string;
MobileNumber :string;
PhoneNumber :string;
PreferredContactMethod :string;
IsPrimary : boolean;
ReceivesInvoices : boolean;
ReceivesCollectionsNotices : boolean;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}