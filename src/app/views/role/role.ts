import { IBase } from "@/shared/IBase";

export interface IRole extends IBase {
	Id :number;
RoleId :string;
RoleCode :string;
RoleName :string;
RoleType :string;
Description :string;
IsSystemRole : boolean;
ScopeType :string;
TenantId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}
