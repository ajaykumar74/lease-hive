import { IBase } from "@/shared/IBase";

export interface IUserRole extends IBase {
	Id :number;
RoleId :number;
ApplicationUserId :number;
ScopeType :string;
ScopeReferenceId :number;
AssignedById :number;
AssignedAt :Date;
IsDelegated : boolean;
TenantId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}