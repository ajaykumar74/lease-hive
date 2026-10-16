import { IBase } from "@/shared/IBase";

export interface IPartyTenantContact extends IBase {
	Id :number;
PartyTenantContactId :string;
TenantId :number;
PartyId :number;
ApplicationUserId :number;
ContactRoleCode :string;
IsPrimary : boolean;
ReceivesSupportTickets : boolean;
ReceivesEscalations : boolean;
DisplayOrder :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}