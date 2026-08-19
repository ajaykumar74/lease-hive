import { IBase } from "@/shared/IBase";

export interface IUserDelegation extends IBase {
	Id :number;
UserDelegationId :string;
DelegatorUserId :number;
DelegateUserId :number;
DelegationType :string;
ProcessCode :string;
OrganisationUnitId :number;
StartDateTime :Date;
EndDateTime :Date;
Reason :string;
ApprovedById :number;
ApprovedAt :Date;
TenantId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}
