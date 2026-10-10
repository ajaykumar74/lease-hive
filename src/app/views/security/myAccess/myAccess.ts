export interface IMyAccessSnapshot {
    User: IMyAccessUser;
    Roles: IMyAccessRole[];
    Permissions: IMyAccessPermission[];
    OrganisationUnits: IMyAccessOrganisationUnit[];
    PartyAccess: IMyAccessPartyAccess[];
    Delegations: IMyAccessDelegation[];
}

export interface IMyAccessUser {
    UserId: number;
    TenantId: number;
    UserCode: string;
    UserName: string;
    DisplayName: string;
    Email: string;
    DefaultOrganisationUnitId: number;
    DefaultOrganisationUnitDisplayName: string;
}

export interface IMyAccessRole {
    Id: number;
    RoleId: number;
    RoleCode: string;
    RoleName: string;
    RoleDisplayName: string;
    ScopeType: string;
    ScopeReferenceId: number;
    ScopeReferenceDisplayName: string;
    AssignedById: number;
    AssignedByUserName: string;
    AssignedAt: string;
    IsDelegated: boolean;
    EffectiveFrom?: string;
    EffectiveTo?: string;
}

export interface IMyAccessPermission {
    PermissionCode: string;
    ModuleCode: string;
    ResourceType: string;
    ResourceName: string;
    ActionName: string;
    Description: string;
    IsSensitive: boolean;
}

export interface IMyAccessOrganisationUnit {
    Id: number;
    OrganisationUnitId: number;
    OrganisationUnitCode: string;
    OrganisationUnitName: string;
    OrganisationUnitDisplayName: string;
    AccessLevel: string;
    CanViewChildUnits: boolean;
    CanViewParentUnits: boolean;
    IsDefault: boolean;
    EffectiveFrom?: string;
    EffectiveTo?: string;
}

export interface IMyAccessPartyAccess {
    Id: number;
    PartyId: number;
    PartyDisplayName: string;
    PartyRoleType: string;
    AccessLevel: string;
    PartyLocationId: number;
    PartyLocationDisplayName: string;
    CustomerDepartmentId: number;
    CustomerDepartmentDisplayName: string;
    EffectiveFrom?: string;
    EffectiveTo?: string;
}

export interface IMyAccessDelegation {
    Id: number;
    UserDelegationId: string;
    Direction: string;
    CounterpartyUserName: string;
    DelegationType: string;
    ProcessCode: string;
    OrganisationUnitId: number;
    OrganisationUnitDisplayName: string;
    StartDateTime: string;
    EndDateTime: string;
    Reason: string;
    ApprovedByUserName: string;
}
