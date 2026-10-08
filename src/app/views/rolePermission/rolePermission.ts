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
RoleCode?: string;
RoleName?: string;
RoleDisplayName?: string;
PermissionCode?: string;
PermissionDisplayName?: string;

}

export interface IRolePermissionList {
    Id: number;
    RoleId: number;
    RoleCode: string;
    RoleName: string;
    RoleDisplayName: string;
    PermissionId: number;
    PermissionCode: string;
    PermissionDisplayName: string;
    GrantType: string;
    ConstraintJson: string;
    RecordStatus: string;
}
