import { IBase } from "@/shared/IBase";

export interface IUserPartyAccess extends IBase {
	Id :number;
PartyId :number;
ApplicationUserId :number;
PartyRoleType :string;
AccessLevel :string;
PartyLocationId :number;
CustomerDepartmentId :number;
TenantId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}