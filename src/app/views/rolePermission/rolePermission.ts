import { IBase } from "@/shared/IBase";

export interface IRolePermission extends IBase {
	Id :number;
RoleId :number;
PermissionId :number;
GrantType :string;
ConstraintJson :string;
TenantId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}