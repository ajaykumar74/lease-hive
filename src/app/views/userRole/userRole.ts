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
RoleCode?: string;
RoleName?: string;
RoleDisplayName?: string;
ApplicationUserName?: string;
ScopeReferenceDisplayName?: string;
AssignedByUserName?: string;

}

export interface IUserRoleList {
    Id: number;
    RoleId: number;
    RoleCode: string;
    RoleName: string;
    RoleDisplayName: string;
    ApplicationUserId: number;
    ApplicationUserName: string;
    ScopeType: string;
    ScopeReferenceId: number;
    ScopeReferenceDisplayName: string;
    AssignedById: number;
    AssignedByUserName: string;
    AssignedAt: Date;
    IsDelegated: boolean;
    RecordStatus: string;
}
