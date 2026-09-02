import { IBase } from "@/shared/IBase";

export interface ILeaseContractParty extends IBase {
	Id :number;
LeaseContractPartyId :string;
TenantId :number;
LeaseContractId :number;
PartyId :number;
PartyRoleCode :string;
IsPrimary : boolean;
LegalNameSnapshot :string;
RegistrationNoSnapshot :string;
TaxIdSnapshot :string;
AddressSnapshotJson :string;
ContactSnapshotJson :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}